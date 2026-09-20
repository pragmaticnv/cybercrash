from pydantic import BaseModel
from typing import List
from pathlib import Path
from datetime import datetime
from collections import defaultdict, deque
from reasoning import summarize_reasoning
import numpy as np
import pandas as pd
import joblib


# ============================================================
# PATHS
# ============================================================

BASE = Path(__file__).resolve().parent.parent

ACCOUNT_FEATURES_PATH = BASE / "08_account_features.csv"
TRANSACTIONS_PATH = BASE / "03_transactions.csv"
WITHDRAWALS_PATH = BASE / "04_withdrawals.csv"
ATM_PATH = BASE / "05_atm_locations.csv"
ZONES_PATH = BASE / "07_geographic_zones.csv"

MODEL_PATH = (
    BASE.parent / "models" / "location_xgboost_v2.pkl"
)

PREPROCESSOR_PATH = (
    BASE.parent / "models" / "location_preprocessor_v2.pkl"
)


# ============================================================
# MODEL FEATURES
# ============================================================

NUMERIC_FEATURES = [
    "reported_amount",
    "case_tx_count_pre_prediction",
    "case_tx_amount_pre_prediction",
    "unique_receivers_pre_prediction",
    "unique_senders_pre_prediction",
    "transaction_rapidity_pre_prediction",
    "fund_split_ratio",
    "account_age_days",
    "previous_alert_count",
    "network_degree",
    "network_risk_score",
    "historical_cashout_count_pre_prediction",
    "historical_cashout_amount_pre_prediction",
    "distance_from_complaint_state_km",
    "atm_density",
    "recent_cashout_24h_pre_prediction",
    "location_risk_score_pre_prediction",
]

CATEGORICAL_FEATURES = [
    "fraud_type",
    "state_code",
]

FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES


# ============================================================
# LOAD STATIC DATA
# ============================================================

print("Loading new-case prediction resources...")

ACCOUNT_FEATURES = pd.read_csv(
    ACCOUNT_FEATURES_PATH
)

TRANSACTIONS = pd.read_csv(
    TRANSACTIONS_PATH,
    parse_dates=["timestamp"]
)

WITHDRAWALS = pd.read_csv(
    WITHDRAWALS_PATH,
    parse_dates=["timestamp"]
)

ATM_LOCATIONS = pd.read_csv(
    ATM_PATH
)

ZONES = pd.read_csv(
    ZONES_PATH
)


# ============================================================
# ATM DENSITY
# ============================================================

ZONE_ATM_DENSITY = (
    ATM_LOCATIONS
    .groupby("zone_id")
    .size()
    .rename("atm_density")
)

ZONES = ZONES.copy()

ZONES["atm_density"] = (
    ZONES["zone_id"]
    .map(ZONE_ATM_DENSITY)
    .fillna(0)
)


# ============================================================
# ATM + WITHDRAWAL LOOKUP
# ============================================================

WITHDRAWAL_DATA = WITHDRAWALS.merge(
    ATM_LOCATIONS[
        ["atm_id", "zone_id"]
    ],
    on="atm_id",
    how="left"
)

WITHDRAWAL_DATA = WITHDRAWAL_DATA.dropna(
    subset=["zone_id"]
)


# ============================================================
# STATE CENTERS
# ============================================================

STATE_CENTERS = (
    ZONES
    .groupby("state_code")[
        ["center_latitude", "center_longitude"]
    ]
    .mean()
)


# ============================================================
# HAVERSINE
# ============================================================

def haversine(
    lat1,
    lon1,
    lat2,
    lon2
):
    """
    Calculate distance between two geographic points
    in kilometers.
    """

    R = 6371.0

    lat1 = np.radians(lat1)
    lon1 = np.radians(lon1)

    lat2 = np.radians(lat2)
    lon2 = np.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        np.sin(dlat / 2) ** 2
        +
        np.cos(lat1)
        * np.cos(lat2)
        * np.sin(dlon / 2) ** 2
    )

    return (
        2
        * R
        * np.arcsin(np.sqrt(a))
    )


# ============================================================
# EXISTING ACCOUNT FEATURES
# ============================================================

def get_existing_account_features(account_id):
    """
    Return stored account intelligence if available.
    """

    account = ACCOUNT_FEATURES[
        ACCOUNT_FEATURES["account_id"] == account_id
    ]

    if account.empty:
        return None

    return account.iloc[0].to_dict()


from typing import List, Optional


# ============================================================
# INPUT MODELS
# ============================================================

class TransactionInput(BaseModel):
    source_account: str
    destination_account: str
    amount: float
    timestamp: Optional[datetime] = None


class NewCaseRequest(BaseModel):
    case_id: str
    fraud_type: str
    reported_amount: float
    complaint_state: str
    primary_account: str
    prediction_time: Optional[datetime] = None
    transactions: List[TransactionInput]


# ============================================================
# TRANSACTION NETWORK
# ============================================================

def trace_new_case_network(
    primary_account,
    transactions,
    max_hops=3,
    prediction_time=None
):
    """
    Build a transaction network from the incoming case.

    Traversal follows outgoing transactions from the
    primary account up to max_hops.
    """

    transaction_data = []

    for tx in transactions:

        if hasattr(tx, "model_dump"):
            tx_dict = tx.model_dump()
        else:
            tx_dict = dict(tx)

        # Ensure timestamp is a pandas-compatible timestamp
        ts_val = tx_dict.get("timestamp")
        if ts_val is None or str(ts_val).strip() == "":
            ts_val = datetime.now()
        tx_dict["timestamp"] = pd.to_datetime(ts_val)

        transaction_data.append(
            tx_dict
        )
        if (
    prediction_time is not None
    and
    tx_dict["timestamp"]
    > pd.to_datetime(prediction_time)
):
            continue

    # --------------------------------------------------------
    # Build graph
    # --------------------------------------------------------

    graph = defaultdict(list)

    for tx in transaction_data:

        graph[
            tx["source_account"]
        ].append(
            (
                tx["destination_account"],
                tx["timestamp"]
            )
        )

    # --------------------------------------------------------
    # BFS
    # --------------------------------------------------------

    accounts_by_hop = {
        "hop_0": [primary_account]
    }

    visited = {
        primary_account
    }

    current_accounts = [
        primary_account
    ]

    for hop in range(
        1,
        max_hops + 1
    ):

        next_accounts = []

        for account in current_accounts:

            for destination, timestamp in graph.get(
                account,
                []
            ):

                if destination in visited:
                    continue

                visited.add(destination)

                next_accounts.append(
                    destination
                )

        accounts_by_hop[
            f"hop_{hop}"
        ] = next_accounts

        current_accounts = next_accounts

    # --------------------------------------------------------
    # Keep transactions connected to traced network
    # --------------------------------------------------------

    network_transactions = []

    for tx in transaction_data:

        if (
            tx["source_account"] in visited
            or
            tx["destination_account"] in visited
        ):

            network_transactions.append(tx)

    return {
        "primary_account": primary_account,
        "max_hops": max_hops,
        "accounts_by_hop": accounts_by_hop,
        "total_accounts_traced": len(visited),
        "total_transactions_traced": len(
            network_transactions
        ),
        "transactions": network_transactions,
    }


# ============================================================
# BUILD CASE-LEVEL FEATURES
# ============================================================

def build_new_case_features(
    case,
    network
):
    """
    Reproduce the case-level feature calculations
    used during training.
    """

    transactions = network[
        "transactions"
    ]

    primary_account = case[
        "primary_account"
    ]

    prediction_time = pd.to_datetime(
        case["prediction_time"]
    )

    # --------------------------------------------------------
    # Existing account intelligence
    # --------------------------------------------------------

    account = get_existing_account_features(
        primary_account
    )

    # --------------------------------------------------------
    # Only transactions available before prediction
    # --------------------------------------------------------

    case_tx = [

        tx for tx in transactions

        if pd.to_datetime(
            tx["timestamp"]
        ) <= prediction_time

    ]

    # --------------------------------------------------------
    # Case transaction statistics
    # --------------------------------------------------------

    case_tx_count = len(
        case_tx
    )

    case_tx_amount = sum(
        tx["amount"]
        for tx in case_tx
    )

    unique_receivers = len({
        tx["destination_account"]
        for tx in case_tx
    })

    unique_senders = len({
        tx["source_account"]
        for tx in case_tx
    })

    # --------------------------------------------------------
    # EXACT TRAINING RAPIDITY FORMULA
    # --------------------------------------------------------

    if len(case_tx) > 1:

        timestamps = [
            pd.to_datetime(
                tx["timestamp"]
            )
            for tx in case_tx
        ]

        time_span = (
            max(timestamps)
            - min(timestamps)
        ).total_seconds()

        rapidity = (
            len(case_tx)
            /
            max(
                time_span / 3600,
                1
            )
        )

    elif len(case_tx) == 1:

        rapidity = 1.0

    else:

        rapidity = 0.0

    # --------------------------------------------------------
    # ACCOUNT FEATURES
    # --------------------------------------------------------

    if account is not None:

        account_age_days = float(
            account["account_age_days"]
        )

        previous_alert_count = float(
            account["previous_alert_count"]
        )

        fund_split_ratio = float(
            account["fund_split_ratio"]
        )

        network_degree = float(
            account["network_degree"]
        )

        network_risk_score = float(
            account["network_risk_score"]
        )

        account_source = (
            "EXISTING_ACCOUNT_INTELLIGENCE"
        )

    else:

        # New account
        account_age_days = 0.0

        previous_alert_count = 0.0

        network_degree = float(
            network[
                "total_accounts_traced"
            ]
        )

        # Calculate observable network risk
        network_amount = sum(
            tx["amount"]
            for tx in case_tx
        )

        network_degree_count = len({
            tx["destination_account"]
            for tx in case_tx
        })

        network_risk_score = min(
            1.0,
            (
                np.log1p(
                    network_degree_count
                ) / 5.0
                +
                np.log1p(
                    network_amount
                ) / 20.0
            ) / 2
        )

        outgoing_amounts = [

            tx["amount"]

            for tx in case_tx

            if tx["source_account"]
            == primary_account
        ]

        total_outgoing = sum(
            outgoing_amounts
        )

        if (
            total_outgoing > 0
            and
            len(outgoing_amounts) > 1
        ):

            largest_transfer = max(
                outgoing_amounts
            )

            fund_split_ratio = (
                1
                -
                largest_transfer
                /
                total_outgoing
            )

        else:

            fund_split_ratio = 0.0

        account_source = (
            "NEW_ACCOUNT_INCOMING_DATA"
        )

    return {
        "case_id": case["case_id"],

        "fraud_type": case[
            "fraud_type"
        ],

        "state_code": case[
            "complaint_state"
        ],

        "reported_amount": float(
            case["reported_amount"]
        ),

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

        "fund_split_ratio":
            fund_split_ratio,

        "account_age_days":
            account_age_days,

        "previous_alert_count":
            previous_alert_count,

        "network_degree":
            network_degree,

        "network_risk_score":
            network_risk_score,

        "account_source":
            account_source,
    }


# ============================================================
# BUILD 288 CANDIDATE ZONE ROWS
# ============================================================

def build_candidate_zone_features(
    case,
    network,
    case_features
):
    """
    Generate the exact location features for every
    candidate zone.
    """

    prediction_time = pd.to_datetime(
        case["prediction_time"]
    )

    complaint_state = case[
        "complaint_state"
    ]

    # --------------------------------------------------------
    # Complaint state center
    # --------------------------------------------------------

    if complaint_state in STATE_CENTERS.index:

        complaint_lat = STATE_CENTERS.loc[
            complaint_state,
            "center_latitude"
        ]

        complaint_lon = STATE_CENTERS.loc[
            complaint_state,
            "center_longitude"
        ]

    else:

        complaint_lat = ZONES[
            "center_latitude"
        ].mean()

        complaint_lon = ZONES[
            "center_longitude"
        ].mean()

    # --------------------------------------------------------
    # Network accounts
    # --------------------------------------------------------

    network_accounts = set()

    for hop_accounts in network[
        "accounts_by_hop"
    ].values():

        network_accounts.update(
            hop_accounts
        )

    network_accounts.add(
        case["primary_account"]
    )

    # --------------------------------------------------------
    # Historical withdrawals from traced network
    # --------------------------------------------------------

    network_withdrawals = WITHDRAWAL_DATA[
        WITHDRAWAL_DATA[
            "account_id"
        ].isin(network_accounts)
        &
        (
            WITHDRAWAL_DATA[
                "timestamp"
            ] <= prediction_time
        )
    ].copy()

    # --------------------------------------------------------
    # Recent 24h start
    # --------------------------------------------------------

    recent_start = (
        prediction_time
        -
        pd.Timedelta(hours=24)
    )

    rows = []

    # --------------------------------------------------------
    # Every candidate zone
    # --------------------------------------------------------

    for zone in ZONES.itertuples(
        index=False
    ):

        # ----------------------------------------------------
        # Distance
        # ----------------------------------------------------

        distance = haversine(
            complaint_lat,
            complaint_lon,
            zone.center_latitude,
            zone.center_longitude
        )

        # ----------------------------------------------------
        # Historical cashouts
        # ----------------------------------------------------

        zone_history = (
            network_withdrawals[
                network_withdrawals[
                    "zone_id"
                ]
                ==
                zone.zone_id
            ]
        )

        historical_count = len(
            zone_history
        )

        historical_amount = (

            zone_history[
                "amount"
            ].sum()

            if historical_count

            else 0.0
        )

        # ----------------------------------------------------
        # Recent 24-hour cashouts
        # ----------------------------------------------------

        recent_cashouts = (
            zone_history[
                zone_history[
                    "timestamp"
                ] >= recent_start
            ]
        )

        recent_count = len(
            recent_cashouts
        )

        # ----------------------------------------------------
        # Location risk
        # EXACT TRAINING FORMULA
        # ----------------------------------------------------

        distance_score = np.exp(
            -distance / 1500
        )

        atm_score = min(
            zone.atm_density / 100,
            1.0
        )

        historical_score = min(
            np.log1p(
                historical_count
            ) / 3,
            1.0
        )

        network_score = (
            case_features[
                "network_risk_score"
            ]
        )

        location_risk = (
            0.35 * distance_score
            +
            0.25 * atm_score
            +
            0.20 * historical_score
            +
            0.20 * network_score
        )

        # ----------------------------------------------------
        # Combine all 19 model features
        # ----------------------------------------------------

        row = {}

        for feature in NUMERIC_FEATURES:

            if feature in case_features:

                row[feature] = (
                    case_features[
                        feature
                    ]
                )

        row[
            "historical_cashout_count_pre_prediction"
        ] = historical_count

        row[
            "historical_cashout_amount_pre_prediction"
        ] = historical_amount

        row[
            "distance_from_complaint_state_km"
        ] = distance

        row[
            "atm_density"
        ] = zone.atm_density

        row[
            "recent_cashout_24h_pre_prediction"
        ] = recent_count

        row[
            "location_risk_score_pre_prediction"
        ] = location_risk

        row[
            "fraud_type"
        ] = case_features[
            "fraud_type"
        ]

        row[
            "state_code"
        ] = zone.state_code

        row[
            "zone_id"
        ] = zone.zone_id

        rows.append(row)

    return pd.DataFrame(rows)


# ============================================================
# PREDICT NEW CASE HOTSPOTS
# ============================================================

def predict_new_case_hotspots(
    case,
    top_k=5
):
    """
    Complete new-case prediction pipeline.

    Returns ranked predicted hotspot zones.
    """

    # --------------------------------------------------------
    # Network
    # --------------------------------------------------------

    network = trace_new_case_network(
    case["primary_account"],
    case["transactions"],
    max_hops=3,
    prediction_time=case["prediction_time"]
)
    # --------------------------------------------------------
    # Case features
    # --------------------------------------------------------

    case_features = build_new_case_features(
        case,
        network
    )

    # --------------------------------------------------------
    # Candidate zones
    # --------------------------------------------------------

    candidate_data = (
        build_candidate_zone_features(
            case,
            network,
            case_features
        )
    )

    # --------------------------------------------------------
    # Validate feature structure
    # --------------------------------------------------------

    missing_features = [
        feature
        for feature in FEATURES
        if feature not in candidate_data.columns
    ]

    if missing_features:

        raise ValueError(
            "Missing model features: "
            + str(missing_features)
        )

    # --------------------------------------------------------
    # Load same trained model + preprocessor
    # --------------------------------------------------------

    model = joblib.load(
        MODEL_PATH
    )

    preprocessor = joblib.load(
        PREPROCESSOR_PATH
    )

    # --------------------------------------------------------
    # Model input
    # --------------------------------------------------------

    X = candidate_data[
        FEATURES
    ]

    X_encoded = preprocessor.transform(
        X
    )

    scores = model.predict_proba(
        X_encoded
    )[:, 1]

    candidate_data[
        "risk_score"
    ] = scores

    # --------------------------------------------------------
    # Rank
    # --------------------------------------------------------

    ranked = (
        candidate_data
        .sort_values(
            "risk_score",
            ascending=False
        )
        .head(top_k)
    )

    hotspots = []

    for rank, (_, row) in enumerate(
        ranked.iterrows(),
        start=1
    ):

        reasoning = summarize_reasoning(
            row.to_dict(),
            top_n=3
        )

        zone_id = row["zone_id"]

        # ----------------------------------------------------
        # Zone geographic information
        # ----------------------------------------------------

        zone_match = ZONES[
            ZONES["zone_id"] == zone_id
        ]

        if not zone_match.empty:

            zone_info = zone_match.iloc[0]

            zone_name = zone_info["zone_name"]

            zone_latitude = float(
                zone_info["center_latitude"]
            )

            zone_longitude = float(
                zone_info["center_longitude"]
            )

        else:

            zone_name = zone_id
            zone_latitude = None
            zone_longitude = None

        # ----------------------------------------------------
        # ----------------------------------------------------
        # ATM candidates for this predicted zone
        # ----------------------------------------------------

        # Get ATMs inside the predicted zone
        zone_atms = ATM_LOCATIONS[
            ATM_LOCATIONS["zone_id"] == zone_id
        ].copy()

        # Keep only the 3 ATMs closest to the predicted zone center
        if (
            not zone_atms.empty
            and zone_latitude is not None
            and zone_longitude is not None
        ):
            zone_atms["atm_distance_km"] = zone_atms.apply(
                lambda atm: haversine(
                    zone_latitude,
                    zone_longitude,
                    atm["latitude"],
                    atm["longitude"]
                ),
                axis=1
            )

            zone_atms = (
                zone_atms
                .sort_values("atm_distance_km")
                .head(3)
            )

            atm_candidates = []

            for _, atm in zone_atms.iterrows():
                atm_candidates.append({
                    "atm_id": atm["atm_id"],
                    "bank": atm["bank"],
                    "atm_name": atm["atm_name"],
                    "latitude": float(atm["latitude"]),
                    "longitude": float(atm["longitude"]),
                    "distance_from_zone_km": round(
                        float(atm["atm_distance_km"]),
                        2
                    ),
                    "source_type": atm["source_type"]
                })

        else:
            atm_candidates = []

        # ----------------------------------------------------
        # Final hotspot result
        # ----------------------------------------------------

        hotspots.append({
            "rank": rank,
            "model_reasoning": reasoning,

            "zone_id": zone_id,

            "zone_name": zone_name,

            "state_code": row["state_code"],

            "risk_score": round(
                float(row["risk_score"]),
                4
            ),

            "zone_coordinates": {
                "latitude": zone_latitude,
                "longitude": zone_longitude
            },

            "distance_km": round(
                float(
                    row[
                        "distance_from_complaint_state_km"
                    ]
                ),
                2
            ),

            "atm_density": int(
                row["atm_density"]
            ),

            "historical_cashout_count": int(
                row[
                    "historical_cashout_count_pre_prediction"
                ]
            ),

            "recent_cashout_24h": int(
                row[
                    "recent_cashout_24h_pre_prediction"
                ]
            ),

            "location_risk": round(
                float(
                    row[
                        "location_risk_score_pre_prediction"
                    ]
                ),
                4
            ),

            "atm_candidates": atm_candidates
        })

    return {
"case_id":
    case["case_id"],

"prediction_time":
    str(
        case["prediction_time"]
    ),

"network":
    network,

"case_features": {
    key: value
    for key, value
    in case_features.items()
    if key != "account_source"
},

"account_source":
    case_features[
        "account_source"
    ],

"candidate_zones_evaluated":
    len(candidate_data),

"hotspots":
    hotspots
    }
