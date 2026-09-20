import pandas as pd
import joblib


# =========================
# PATHS
# =========================

DATA_PATH = r"C:\SIH-ML\data\09_location_prediction_ml_dataset.csv"

MODEL_PATH = r"C:\SIH-ML\models\location_xgboost_v2.pkl"

PREPROCESSOR_PATH = r"C:\SIH-ML\models\location_preprocessor_v2.pkl"


# =========================
# FEATURES
# =========================

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


# =========================
# LOAD MODEL
# =========================

print("Loading model...")

MODEL = joblib.load(MODEL_PATH)
PREPROCESSOR = joblib.load(PREPROCESSOR_PATH)

print("Model loaded.")


# =========================
# LOAD DATA
# =========================

print("Loading data...")

DATA = pd.read_csv(
    DATA_PATH,
    usecols=FEATURES + [
        "case_id",
        "zone_id",
        "actual_cashout_in_zone"
    ]
)

print("Data loaded.")


# =========================
# HUMAN-READABLE FEATURE NAMES
# =========================

FEATURE_LABELS = {

    "reported_amount":
        "Reported fraud amount",

    "case_tx_count_pre_prediction":
        "Transaction count before prediction",

    "case_tx_amount_pre_prediction":
        "Transaction amount before prediction",

    "unique_receivers_pre_prediction":
        "Unique receiving accounts",

    "unique_senders_pre_prediction":
        "Unique sending accounts",

    "transaction_rapidity_pre_prediction":
        "Transaction rapidity",

    "fund_split_ratio":
        "Fund splitting pattern",

    "account_age_days":
        "Account age",

    "previous_alert_count":
        "Previous alerts",

    "network_degree":
        "Network connectivity",

    "network_risk_score":
        "Network risk",

    "historical_cashout_count_pre_prediction":
        "Historical cash-out activity",

    "historical_cashout_amount_pre_prediction":
        "Historical cash-out amount",

    "distance_from_complaint_state_km":
        "Geographic distance",

    "atm_density":
        "ATM density",

    "recent_cashout_24h_pre_prediction":
        "Recent cash-out activity",

    "location_risk_score_pre_prediction":
        "Location risk"

}


# =========================
# EXPLANATION FUNCTION
# =========================

def explain_prediction(case_id, zone_id):

    case = DATA[
        DATA["case_id"] == case_id
    ]

    if case.empty:
        raise ValueError(
            f"Case '{case_id}' not found."
        )

    zone = case[
        case["zone_id"] == zone_id
    ]

    if zone.empty:
        raise ValueError(
            f"Zone '{zone_id}' not found for case '{case_id}'."
        )

    row = zone.iloc[0]

    print("\n========================================")
    print("HOTSPOT EXPLANATION")
    print("========================================")

    print(f"Case: {case_id}")
    print(f"Zone: {zone_id}")

    print("\nKEY SIGNALS")
    print("----------------------------------------")

    # -------------------------------------
    # Location risk
    # -------------------------------------

    location_risk = float(
        row["location_risk_score_pre_prediction"]
    )

    if location_risk >= 0.5:
        print(
            f"✓ Location risk: elevated "
            f"({location_risk:.3f})"
        )
    else:
        print(
            f"• Location risk: "
            f"{location_risk:.3f}"
        )

    # -------------------------------------
    # Network risk
    # -------------------------------------

    network_risk = float(
        row["network_risk_score"]
    )

    if network_risk >= 0.5:
        print(
            f"✓ Network risk: elevated "
            f"({network_risk:.3f})"
        )
    else:
        print(
            f"• Network risk: "
            f"{network_risk:.3f}"
        )

    # -------------------------------------
    # Historical cashout activity
    # -------------------------------------

    cashout_count = float(
        row[
            "historical_cashout_count_pre_prediction"
        ]
    )

    print(
        f"✓ Historical cash-out activity: "
        f"{cashout_count:.0f} withdrawals"
    )

    # -------------------------------------
    # Geographic distance
    # -------------------------------------

    distance = float(
        row["distance_from_complaint_state_km"]
    )

    print(
        f"✓ Geographic distance: "
        f"{distance:.1f} km"
    )

    # -------------------------------------
    # ATM density
    # -------------------------------------

    atm_density = float(
        row["atm_density"]
    )

    print(
        f"• ATM density: "
        f"{atm_density:.3f}"
    )

    # -------------------------------------
    # Transaction pattern
    # -------------------------------------

    tx_count = float(
        row["case_tx_count_pre_prediction"]
    )

    tx_amount = float(
        row["case_tx_amount_pre_prediction"]
    )

    rapidity = float(
        row["transaction_rapidity_pre_prediction"]
    )

    print(
        f"• Pre-prediction transactions: "
        f"{tx_count:.0f}"
    )

    print(
        f"• Pre-prediction transaction amount: "
        f"{tx_amount:.2f}"
    )

    print(
        f"• Transaction rapidity: "
        f"{rapidity:.3f}"
    )

    print("\nPATTERN SUMMARY")
    print("----------------------------------------")

    print(
        "The model combines geographic, location-risk, "
        "network, transaction and historical cash-out "
        "signals to rank this zone among candidate "
        "hotspots."
    )

    print(
        "\nNote: These are model input signals, not "
        "proof that a future withdrawal will occur."
    )


# =========================
# TEST
# =========================

if __name__ == "__main__":

    explain_prediction(
        "CASE_007001",
        "GA_Z05"
    )