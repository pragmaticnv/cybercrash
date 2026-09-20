import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity


# ============================================================
# PATHS
# ============================================================

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = BASE_DIR / "09_location_prediction_ml_dataset.csv"
WITHDRAWAL_PATH = BASE_DIR / "04_withdrawals.csv"
ATM_PATH = BASE_DIR / "05_atm_locations.csv"

MODEL_PATH = BASE_DIR.parent / "models" / "location_xgboost_v2.pkl"
PREPROCESSOR_PATH = BASE_DIR.parent / "models" / "location_preprocessor_v2.pkl"


# ============================================================
# XGBOOST FEATURES
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
    "location_risk_score_pre_prediction"
]

CATEGORICAL_FEATURES = [
    "fraud_type",
    "state_code"
]

FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES


# ============================================================
# BEHAVIOR FEATURES
# ============================================================

BEHAVIOR_FEATURES = [
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
    "network_risk_score"
]


# ============================================================
# TIME WINDOWS
# ============================================================

BINS = [
    0, 3, 6, 9, 12, 15, 18, 21, 24
]

LABELS = [
    "12–3 AM",
    "3–6 AM",
    "6–9 AM",
    "9 AM–12 PM",
    "12–3 PM",
    "3–6 PM",
    "6–9 PM",
    "9 PM–12 AM"
]


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading ML model...")

MODEL = joblib.load(MODEL_PATH)
PREPROCESSOR = joblib.load(PREPROCESSOR_PATH)

print("Model loaded.")


# ============================================================
# LOAD DATA
# ============================================================

print("Loading data...")

DATA = pd.read_csv(
    DATA_PATH,
    usecols=FEATURES + [
        "case_id",
        "zone_id",
        "state_code",
        "actual_cashout_in_zone",
        "split"
    ]
)

ATM_LOCATIONS = pd.read_csv(
    ATM_PATH
)

WITHDRAWALS = pd.read_csv(
    WITHDRAWAL_PATH
)

print("Data loaded.")


# ============================================================
# PREPARE WITHDRAWAL DATA
# ============================================================

WITHDRAWALS["timestamp"] = pd.to_datetime(
    WITHDRAWALS["timestamp"],
    errors="coerce"
)

WITHDRAWALS["hour"] = (
    WITHDRAWALS["timestamp"].dt.hour
)

WITHDRAWALS["time_window"] = pd.cut(
    WITHDRAWALS["hour"],
    bins=BINS,
    labels=LABELS,
    right=False,
    include_lowest=True
)

WITHDRAWALS = WITHDRAWALS.merge(
    ATM_LOCATIONS[
        ["atm_id", "zone_id"]
    ],
    on="atm_id",
    how="left"
)


# ============================================================
# PREPARE CASE-LEVEL DATA FOR SIMILARITY
# ============================================================

case_features = (
    DATA.drop_duplicates("case_id")[
        ["case_id"] + BEHAVIOR_FEATURES
    ]
    .reset_index(drop=True)
)


def get_actual_zone(group):

    positive = group[
        group["actual_cashout_in_zone"] == 1
    ]

    if positive.empty:
        return None

# Fast vectorized lookup for actual cashout zone
actual_zones = (
    DATA[DATA["actual_cashout_in_zone"] == 1][["case_id", "zone_id"]]
    .rename(columns={"zone_id": "actual_zone"})
    .drop_duplicates("case_id")
)

case_info = (
    DATA[["case_id"]]
    .drop_duplicates()
    .merge(actual_zones, on="case_id", how="left")
)

CASE_DATA = case_features.merge(
    case_info,
    on="case_id",
    how="left"
)


# ============================================================
# SCALE BEHAVIOR FEATURES
# ============================================================

SCALER = StandardScaler()

CASE_MATRIX = SCALER.fit_transform(
    CASE_DATA[BEHAVIOR_FEATURES]
)


# ============================================================
# TIME WINDOWS
# ============================================================

def get_time_windows(zone_id):

    zone_withdrawals = WITHDRAWALS[
        WITHDRAWALS["zone_id"] == zone_id
    ]

    if zone_withdrawals.empty:
        return []

    counts = (
        zone_withdrawals["time_window"]
        .value_counts()
        .reindex(
            LABELS,
            fill_value=0
        )
    )

    total = counts.sum()

    if total == 0:
        return []

    shares = (
        counts / total * 100
    ).sort_values(
        ascending=False
    )

    result = []

    for window, share in shares.head(3).items():

        result.append({
            "time_window": str(window),
            "historical_share_percent":
                round(float(share), 2)
        })

    return result


# ============================================================
# ATM CANDIDATES
# ============================================================

def get_atm_candidates(
    zone_id,
    limit=5
):

    candidates = ATM_LOCATIONS[
        ATM_LOCATIONS["zone_id"] == zone_id
    ].head(limit)

    result = []

    for _, row in candidates.iterrows():

        result.append({

            "atm_id":
                row["atm_id"],

            "bank":
                row["bank"],

            "atm_name":
                row["atm_name"],

            "latitude":
                row["latitude"],

            "longitude":
                row["longitude"]

        })

    return result


# ============================================================
# HISTORICAL CASE SIMILARITY
# ============================================================

def find_similar_cases(
    case_id,
    top_k=10
):

    if case_id not in set(
        CASE_DATA["case_id"]
    ):

        return []

    target_index = CASE_DATA.index[
        CASE_DATA["case_id"] == case_id
    ][0]

    target_vector = CASE_MATRIX[
        target_index
    ].reshape(1, -1)

    similarities = cosine_similarity(
        target_vector,
        CASE_MATRIX
    )[0]

    results = CASE_DATA.copy()

    results["similarity"] = similarities

    # Remove current case
    results = results[
        results["case_id"] != case_id
    ]

    # Training cases only
    #
    # We determine the split from the original DATA.
    train_cases = set(
        DATA[
            DATA["case_id"].isin(
                results["case_id"]
            )
        ]
        .groupby("case_id")
        .filter(
            lambda x: True
        )["case_id"]
    )

    # Build explicit training case list
    case_split = (
        DATA.groupby("case_id")
        .size()
        .index
    )

    # Use split already loaded in memory instead of re-reading CSV
    split_lookup = (
        DATA[["case_id", "split"]]
        .drop_duplicates("case_id")
    )

    results = results.merge(
        split_lookup,
        on="case_id",
        how="left"
    )

    results = results[
        results["split"] == "train"
    ]

    # Only cases with observed cashout zones
    results = results[
        results["actual_zone"].notna()
    ]

    results = results.sort_values(
        "similarity",
        ascending=False
    ).head(top_k)

    output = []

    for _, row in results.iterrows():

        output.append({

            "case_id":
                row["case_id"],

            "observed_zone":
                row["actual_zone"],

            "behavior_similarity":
                round(
                    float(row["similarity"]),
                    3
                )

        })

    return output


# ============================================================
# HISTORICAL PATTERN SUMMARY
# ============================================================

def get_historical_pattern(
    similar_cases
):

    if not similar_cases:

        return {
            "cases_analyzed": 0,
            "dominant_zone": None,
            "pattern_strength": 0.0,
            "message":
                "No historical cases with observed cashouts were found."
        }

    zones = [
        case["observed_zone"]
        for case in similar_cases
    ]

    zone_counts = (
        pd.Series(zones)
        .value_counts()
    )

    dominant_zone = zone_counts.index[0]

    dominant_count = int(
        zone_counts.iloc[0]
    )

    total = len(zones)

    strength = (
        dominant_count / total
    )

    if strength >= 0.5:

        message = (
            f"{dominant_count} of {total} "
            f"similar historical cases were "
            f"associated with {dominant_zone}, "
            f"showing a recurring geographic pattern."
        )

    elif strength >= 0.3:

        message = (
            f"{dominant_count} of {total} "
            f"similar historical cases were "
            f"associated with {dominant_zone}, "
            f"but the cases are distributed across "
            f"multiple zones."
        )

    else:

        message = (
            f"No dominant geographic pattern was "
            f"found among the {total} similar "
            f"historical cases."
        )

    return {

        "cases_analyzed":
            total,

        "dominant_zone":
            dominant_zone
            if strength >= 0.3
            else None,

        "pattern_strength":
            round(strength, 3),

        "message":
            message

    }


# ============================================================
# EXPLANATION SIGNALS
# ============================================================

def get_explanation(
    row
):

    signals = []

    location_risk = float(
        row[
            "location_risk_score_pre_prediction"
        ]
    )

    if location_risk >= 0.5:

        signals.append({
            "signal":
                "Elevated location-risk signal",

            "value":
                round(location_risk, 3)
        })


    distance = float(
        row[
            "distance_from_complaint_state_km"
        ]
    )

    signals.append({

        "signal":
            "Geographic distance",

        "value":
            f"{distance:.1f} km"

    })


    transaction_amount = float(
        row[
            "case_tx_amount_pre_prediction"
        ]
    )

    signals.append({

        "signal":
            "Pre-prediction transaction amount",

        "value":
            f"₹{transaction_amount:,.2f}"

    })


    atm_density = float(
        row["atm_density"]
    )

    signals.append({

        "signal":
            "ATM density",

        "value":
            atm_density

    })


    network_risk = float(
        row["network_risk_score"]
    )

    signals.append({

        "signal":
            "Network risk",

        "value":
            round(network_risk, 3)

    })


    historical_cashouts = float(
        row[
            "historical_cashout_count_pre_prediction"
        ]
    )

    signals.append({

        "signal":
            "Historical cash-out activity",

        "value":
            int(historical_cashouts)

    })


    return signals


# ============================================================
# MAIN PREDICTION ENGINE
# ============================================================

def predict_hotspots(
    case_id,
    top_k=5
):

    case_data = DATA[
        DATA["case_id"] == case_id
    ].copy()

    if case_data.empty:

        raise ValueError(
            f"Case ID '{case_id}' not found."
        )


    # --------------------------------------------------------
    # XGBOOST PREDICTION
    # --------------------------------------------------------

    X = case_data[FEATURES]

    X_encoded = PREPROCESSOR.transform(X)

    scores = MODEL.predict_proba(
        X_encoded
    )[:, 1]

    case_data["risk_score"] = scores


    ranked = (
        case_data
        .sort_values(
            "risk_score",
            ascending=False
        )
        .head(top_k)
    )


    # --------------------------------------------------------
    # HISTORICAL CASE SIMILARITY
    # --------------------------------------------------------

    similar_cases = find_similar_cases(
        case_id,
        top_k=10
    )

    historical_pattern = (
        get_historical_pattern(
            similar_cases
        )
    )


    # --------------------------------------------------------
    # HOTSPOTS
    # --------------------------------------------------------

    hotspots = []


    for rank, (_, row) in enumerate(
        ranked.iterrows(),
        start=1
    ):

        zone_id = row["zone_id"]

        hotspots.append({

            "rank":
                rank,

            "zone_id":
                zone_id,

            "state_code":
                row["state_code"],

            "risk_score":
                round(
                    float(row["risk_score"]),
                    4
                ),

            "explanation":
                get_explanation(row),

            "historical_time_windows":
                get_time_windows(zone_id),

            "atm_candidates":
                get_atm_candidates(
                    zone_id
                )

        })


    # --------------------------------------------------------
    # VALIDATION INFORMATION
    # --------------------------------------------------------

    actual_rows = case_data[
        case_data["actual_cashout_in_zone"] == 1
    ]

    actual_zone = None
    actual_rank = None

    if not actual_rows.empty:

        actual_zone = (
            actual_rows.iloc[0]["zone_id"]
        )

        full_ranked = (
            case_data
            .sort_values(
                "risk_score",
                ascending=False
            )
            .reset_index(drop=True)
        )

        matching = full_ranked[
            full_ranked["zone_id"]
            == actual_zone
        ]

        if not matching.empty:

            actual_rank = (
                matching.index[0] + 1
            )


    # --------------------------------------------------------
    # FINAL RESULT
    # --------------------------------------------------------

    return {

        "case_id":
            case_id,

        "candidate_zones":
            len(case_data),

        "hotspots":
            hotspots,

        "historical_case_analysis": {

            "similar_cases":
                similar_cases,

            "pattern":
                historical_pattern

        },

        "validation": {

            "actual_cashout_zone":
                actual_zone,

            "actual_zone_rank":
                actual_rank

        }

    }


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    CASE_ID = "CASE_007001"

    result = predict_hotspots(
        CASE_ID,
        top_k=5
    )

    print("\n========================================")
    print("FINAL ML PREDICTION ENGINE")
    print("========================================")

    print(
        f"Case ID: {result['case_id']}"
    )

    print(
        f"Candidate zones: "
        f"{result['candidate_zones']}"
    )


    # --------------------------------------------------------
    # HOTSPOTS
    # --------------------------------------------------------

    for hotspot in result["hotspots"]:

        print("\n----------------------------------------")

        print(
            f"#{hotspot['rank']} "
            f"{hotspot['zone_id']} "
            f"({hotspot['state_code']})"
        )

        print(
            f"Risk Score: "
            f"{hotspot['risk_score']}"
        )

        print("\nSupporting signals:")

        for signal in hotspot[
            "explanation"
        ]:

            print(
                f"  - {signal['signal']}: "
                f"{signal['value']}"
            )

        print("\nHistorical withdrawal windows:")

        for window in hotspot[
            "historical_time_windows"
        ]:

            print(
                f"  - "
                f"{window['time_window']} → "
                f"{window['historical_share_percent']}%"
            )

        print("\nATM candidates:")

        for atm in hotspot[
            "atm_candidates"
        ]:

            print(
                f"  - "
                f"{atm['atm_id']} | "
                f"{atm['bank']}"
            )


    # --------------------------------------------------------
    # SIMILAR CASES
    # --------------------------------------------------------

    print("\n========================================")
    print("HISTORICAL CASE PATTERN")
    print("========================================")

    for case in result[
        "historical_case_analysis"
    ]["similar_cases"]:

        print(
            f"{case['case_id']} | "
            f"Similarity: "
            f"{case['behavior_similarity']} | "
            f"Observed zone: "
            f"{case['observed_zone']}"
        )


    pattern = result[
        "historical_case_analysis"
    ]["pattern"]

    print("\nPattern summary:")
    print("----------------------------------------")

    print(
        f"Cases analyzed: "
        f"{pattern['cases_analyzed']}"
    )

    print(
        f"Dominant zone: "
        f"{pattern['dominant_zone']}"
    )

    print(
        f"Pattern strength: "
        f"{pattern['pattern_strength']}"
    )

    print(
        f"{pattern['message']}"
    )


    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    print("\n========================================")
    print("VALIDATION — DEMO ONLY")
    print("========================================")

    print(
        "Actual cashout zone:",
        result["validation"][
            "actual_cashout_zone"
        ]
    )

    print(
        "Actual zone rank:",
        result["validation"][
            "actual_zone_rank"
        ]
    )


    print("\n========================================")
    print("PREDICTION ENGINE READY")
    print("========================================")