import pandas as pd
import numpy as np
from pathlib import Path
from collections import defaultdict, deque

BASE = Path(__file__).resolve().parent.parent

print("Loading data...")

cases = pd.read_csv(
    BASE / "01_cybercrime_cases.csv",
    parse_dates=["complaint_time", "prediction_time"]
)

accounts = pd.read_csv(BASE / "02_accounts.csv")
account_features = pd.read_csv(BASE / "08_account_features.csv")

transactions = pd.read_csv(
    BASE / "03_transactions.csv",
    parse_dates=["timestamp"]
)

withdrawals = pd.read_csv(
    BASE / "04_withdrawals.csv",
    parse_dates=["timestamp"]
)

atms = pd.read_csv(BASE / "05_atm_locations.csv")
zones = pd.read_csv(BASE / "07_geographic_zones.csv")

print("Cases:", len(cases))
print("Zones:", len(zones))
print("Transactions:", len(transactions))
print("Withdrawals:", len(withdrawals))


# ---------------------------------------------------------
# 1. PREPARE ZONE / ATM INFORMATION
# ---------------------------------------------------------

zone_atm_density = (
    atms.groupby("zone_id")
    .size()
    .rename("atm_density")
)

zones = zones.copy()

zones["atm_density"] = (
    zones["zone_id"]
    .map(zone_atm_density)
    .fillna(0)
)


# ---------------------------------------------------------
# 2. HAVERSINE DISTANCE
# ---------------------------------------------------------

def haversine(lat1, lon1, lat2, lon2):

    R = 6371.0

    lat1 = np.radians(lat1)
    lon1 = np.radians(lon1)
    lat2 = np.radians(lat2)
    lon2 = np.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        np.sin(dlat / 2) ** 2
        + np.cos(lat1)
        * np.cos(lat2)
        * np.sin(dlon / 2) ** 2
    )

    return 2 * R * np.arcsin(np.sqrt(a))


# ---------------------------------------------------------
# 3. STATE CENTERS
# ---------------------------------------------------------

state_centers = (
    zones.groupby("state_code")[["center_latitude", "center_longitude"]]
    .mean()
)


# ---------------------------------------------------------
# 4. PRECOMPUTE TRANSACTION GRAPH
# ---------------------------------------------------------

print("Preparing transaction graph...")

tx_graph = defaultdict(list)

for row in transactions.itertuples(index=False):

    tx_graph[row.source_account].append(
        (
            row.destination_account,
            row.timestamp
        )
    )


# ---------------------------------------------------------
# 5. FUNCTION: GET PRE-PREDICTION 3-HOP NETWORK
# ---------------------------------------------------------

def get_network(primary_account, cutoff):

    visited = {primary_account}

    queue = deque([(primary_account, 0)])

    network_accounts = set()

    while queue:

        account, hop = queue.popleft()

        if hop >= 3:
            continue

        for destination, timestamp in tx_graph.get(account, []):

            # IMPORTANT:
            # never use transactions after prediction time
            if timestamp > cutoff:
                continue

            if destination in visited:
                continue

            visited.add(destination)

            network_accounts.add(destination)

            queue.append(
                (destination, hop + 1)
            )

    network_accounts.add(primary_account)

    return network_accounts


# ---------------------------------------------------------
# 6. PREPARE WITHDRAWAL LOOKUP
# ---------------------------------------------------------

withdrawal_data = withdrawals.merge(
    atms[
        [
            "atm_id",
            "zone_id"
        ]
    ],
    on="atm_id",
    how="left"
)

withdrawal_data = withdrawal_data.dropna(
    subset=["zone_id"]
)


# ---------------------------------------------------------
# 7. ACTUAL FUTURE CASHOUT TARGET
# ---------------------------------------------------------

print("Preparing targets...")

future_withdrawals = withdrawal_data.merge(
    cases[
        [
            "case_id",
            "prediction_time"
        ]
    ],
    on="case_id",
    how="inner"
)

future_withdrawals = future_withdrawals[
    future_withdrawals["timestamp"]
    >= future_withdrawals["prediction_time"]
]

actual_zone_lookup = (
    future_withdrawals
    .groupby("case_id")["zone_id"]
    .apply(set)
    .to_dict()
)


# ---------------------------------------------------------
# 8. BUILD DATASET
# ---------------------------------------------------------

rows = []

total_cases = len(cases)

for case_number, case in enumerate(
    cases.itertuples(index=False),
    start=1
):

    if case_number % 100 == 0:
        print(
            f"Processing case {case_number}/{total_cases}"
        )

    case_id = case.case_id
    prediction_time = case.prediction_time
    primary_account = case.primary_mule_account_id

    # ---------------------------------------------
    # CASE TRANSACTIONS BEFORE PREDICTION
    # ---------------------------------------------

    case_tx = transactions[
        (transactions["case_id"] == case_id)
        &
        (transactions["timestamp"] <= prediction_time)
    ]

    case_tx_count = len(case_tx)

    case_tx_amount = (
        case_tx["amount"].sum()
        if len(case_tx)
        else 0
    )

    unique_receivers = (
        case_tx["destination_account"].nunique()
        if len(case_tx)
        else 0
    )

    unique_senders = (
        case_tx["source_account"].nunique()
        if len(case_tx)
        else 0
    )

    if len(case_tx) > 1:
        time_span = (
            case_tx["timestamp"].max()
            - case_tx["timestamp"].min()
        ).total_seconds()

        rapidity = (
            len(case_tx) / max(time_span / 3600, 1)
        )
    elif len(case_tx) == 1:
        rapidity = 1.0
    else:
        rapidity = 0.0


    # ---------------------------------------------
    # 3-HOP NETWORK
    # ---------------------------------------------

    network_accounts = get_network(
        primary_account,
        prediction_time
    )

    # ---------------------------------------------
    # PREVIOUS NETWORK WITHDRAWALS
    # ---------------------------------------------

    network_withdrawals = withdrawal_data[
        withdrawal_data["account_id"].isin(network_accounts)
        &
        (withdrawal_data["timestamp"] <= prediction_time)
    ]

    # ---------------------------------------------
    # TARGET
    # ---------------------------------------------

    actual_zones = actual_zone_lookup.get(
        case_id,
        set()
    )


    # ---------------------------------------------
    # NETWORK RISK
    #
    # Transparent synthetic proxy:
    # high network activity + high-value movement
    # ---------------------------------------------

    network_tx = transactions[
        transactions["source_account"].isin(network_accounts)
        &
        (transactions["timestamp"] <= prediction_time)
    ]

    network_degree = (
        network_tx["destination_account"]
        .nunique()
        if len(network_tx)
        else 0
    )

    network_amount = (
        network_tx["amount"].sum()
        if len(network_tx)
        else 0
    )

    network_risk_score = min(
        1.0,
        (
            np.log1p(network_degree) / 5.0
            +
            np.log1p(network_amount) / 20.0
        ) / 2
    )


    # ---------------------------------------------
    # ZONE LOOP - ALL 288 ZONES
    # ---------------------------------------------

    complaint_state = case.complaint_state_code

    if complaint_state in state_centers.index:

        complaint_lat = state_centers.loc[
            complaint_state,
            "center_latitude"
        ]

        complaint_lon = state_centers.loc[
            complaint_state,
            "center_longitude"
        ]

    else:

       complaint_lat = zones["center_latitude"].mean()
       complaint_lon = zones["center_longitude"].mean()    


    for zone in zones.itertuples(index=False):

        # -----------------------------------------
        # DISTANCE
        # -----------------------------------------

        distance = haversine(
            complaint_lat,
            complaint_lon,
            zone.center_latitude,
            zone.center_longitude
        )


        # -----------------------------------------
        # HISTORICAL CASHOUT
        # -----------------------------------------

        zone_history = network_withdrawals[
            network_withdrawals["zone_id"]
            == zone.zone_id
        ]

        historical_count = len(zone_history)

        historical_amount = (
            zone_history["amount"].sum()
            if historical_count
            else 0
        )


        # -----------------------------------------
        # RECENT 24-HOUR CASHOUT
        # -----------------------------------------

        recent_start = (
            prediction_time
            - pd.Timedelta(hours=24)
        )

        recent_cashouts = zone_history[
            zone_history["timestamp"] >= recent_start
        ]

        recent_count = len(recent_cashouts)


        # -----------------------------------------
        # LOCATION RISK
        #
        # Transparent replacement formula.
        # This is NOT the old synthetic formula.
        # -----------------------------------------

        distance_score = np.exp(
            -distance / 1500
        )

        atm_score = min(
            zone.atm_density / 100,
            1.0
        )

        historical_score = min(
            np.log1p(historical_count) / 3,
            1.0
        )

        network_score = network_risk_score

        location_risk = (
            0.35 * distance_score
            + 0.25 * atm_score
            + 0.20 * historical_score
            + 0.20 * network_score
        )


        # -----------------------------------------
        # TARGET
        # -----------------------------------------

        target = int(
            zone.zone_id in actual_zones
        )


        rows.append(
            {
                "case_id": case_id,
                "zone_id": zone.zone_id,
                "state_code": zone.state_code,

                "complaint_time": case.complaint_time,
                "prediction_time": prediction_time,

                "fraud_type": case.fraud_type,
                "reported_amount": case.reported_amount,

                "case_tx_count_pre_prediction":
                    case_tx_count,

                "case_tx_amount_pre_prediction":
                    case_tx_amount,

                "unique_receivers_pre_prediction":
                    unique_receivers,

                "unique_senders_pre_prediction":
                    unique_senders,

                "transaction_rapidity_pre_prediction":
                    rapidity,

                "network_degree":
                    network_degree,

                "network_risk_score":
                    network_risk_score,

                "historical_cashout_count_pre_prediction":
                    historical_count,

                "historical_cashout_amount_pre_prediction":
                    historical_amount,

                "distance_from_complaint_state_km":
                    distance,

                "atm_density":
                    zone.atm_density,

                "recent_cashout_24h_pre_prediction":
                    recent_count,

                "location_risk_score_pre_prediction":
                    location_risk,

                "actual_cashout_in_zone":
                    target,

                "source_type":
                    "SYNTHETIC_DERIVED"
            }
        )


# ---------------------------------------------------------
# 9. SAVE
# ---------------------------------------------------------

output = pd.DataFrame(rows)

# Chronological split
output = output.sort_values(
    ["prediction_time", "case_id", "zone_id"]
)

case_ids = output["case_id"].drop_duplicates().tolist()

n = len(case_ids)

train_end = int(n * 0.70)
val_end = int(n * 0.85)

train_cases = set(case_ids[:train_end])
val_cases = set(case_ids[train_end:val_end])

output["split"] = np.where(
    output["case_id"].isin(train_cases),
    "train",
    np.where(
        output["case_id"].isin(val_cases),
        "validation",
        "test"
    )
)

output_path = (
    BASE /
    "09_location_prediction_ml_dataset_v2.csv"
)

output.to_csv(
    output_path,
    index=False
)

print()
print("======================================")
print("DATASET V2 COMPLETE")
print("======================================")
print("Rows:", len(output))
print("Columns:", len(output.columns))
print("Cases:", output.case_id.nunique())
print("Zones per case:", output.zone_id.nunique())
print()
print(
    output["actual_cashout_in_zone"]
    .value_counts()
)
print()
print("Saved to:")
print(output_path)