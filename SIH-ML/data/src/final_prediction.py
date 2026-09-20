import pandas as pd
import joblib


# ============================================================
# PATHS
# ============================================================

DATA_PATH = r"C:\SIH-ML\data\09_location_prediction_ml_dataset.csv"
WITHDRAWAL_PATH = r"C:\SIH-ML\data\04_withdrawals.csv"
ATM_PATH = r"C:\SIH-ML\data\05_atm_locations.csv"

MODEL_PATH = r"C:\SIH-ML\models\location_xgboost_v2.pkl"
PREPROCESSOR_PATH = r"C:\SIH-ML\models\location_preprocessor_v2.pkl"


# ============================================================
# TIME WINDOWS
# ============================================================

BINS = [0, 3, 6, 9, 12, 15, 18, 21, 24]

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
# MODEL FEATURES
# ============================================================

CATEGORICAL = [
    "fraud_type",
    "state_code"
]

NUMERICAL = [
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

FEATURES = CATEGORICAL + NUMERICAL


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading ML model...")

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)

print("Model loaded.")


# ============================================================
# LOAD DATA
# ============================================================

print("Loading prediction data...")

columns = [
    "case_id",
    "zone_id",
    "fraud_type",
    "state_code",

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

    "actual_cashout_in_zone",
    "split"
]

df = pd.read_csv(
    DATA_PATH,
    usecols=columns
)

withdrawals = pd.read_csv(WITHDRAWAL_PATH)

atm_locations = pd.read_csv(
    ATM_PATH,
    usecols=["atm_id", "zone_id", "bank"]
)

# ============================================================
# PREPARE WITHDRAWAL TIME DATA
# ============================================================

withdrawals["timestamp"] = pd.to_datetime(
    withdrawals["timestamp"]
)

withdrawals["hour"] = withdrawals["timestamp"].dt.hour

withdrawals = withdrawals.merge(
    atm_locations[["atm_id", "zone_id"]],
    on="atm_id",
    how="left"
)

withdrawals["time_window"] = pd.cut(
    withdrawals["hour"],
    bins=BINS,
    labels=LABELS,
    right=False
)


# ============================================================
# SELECT CASE
# ============================================================

case_id = "CASE_007001"

case_df = df[
    df["case_id"] == case_id
].copy()

print("\n========================================")
print("CASE ANALYSIS")
print("========================================")

print("Case ID:", case_id)
print("Candidate zones:", len(case_df))


# ============================================================
# LOCATION PREDICTION
# ============================================================

X = case_df[FEATURES]

X_encoded = preprocessor.transform(X)

case_df["model_score"] = model.predict_proba(
    X_encoded
)[:, 1]


# ============================================================
# RANK ZONES
# ============================================================

hotspots = (
    case_df
    .sort_values("model_score", ascending=False)
    .reset_index(drop=True)
)

hotspots["rank"] = hotspots.index + 1


# ============================================================
# RISK BAND
# ============================================================

def risk_band(score):

    if score >= 0.75:
        return "HIGH"

    elif score >= 0.25:
        return "MEDIUM"

    else:
        return "LOW"


hotspots["risk_band"] = hotspots[
    "model_score"
].apply(risk_band)


# ============================================================
# FINAL TOP 5
# ============================================================

top_hotspots = hotspots.head(5)


# ============================================================
# DISPLAY RESULTS
# ============================================================

print("\n========================================")
print("FINAL HOTSPOT PREDICTION")
print("========================================")


for _, row in top_hotspots.iterrows():

    zone = row["zone_id"]

    print("\n----------------------------------------")

    print(
        f"HOTSPOT #{int(row['rank'])}"
    )

    print(
        f"Zone: {zone}"
    )

    print(
        f"State: {row['state_code']}"
    )

    print(
        f"Risk Score: {row['model_score']:.4f}"
    )

    print(
        f"Risk Band: {row['risk_band']}"
    )


    # ========================================================
    # TIME WINDOWS
    # ========================================================

    zone_withdrawals = withdrawals[
        withdrawals["zone_id"] == zone
    ]

    print("\nProbable withdrawal windows:")

    if len(zone_withdrawals) == 0:

        print(
            "No historical withdrawal data available."
        )

    else:

        distribution = (
            zone_withdrawals["time_window"]
            .value_counts(normalize=True)
            .reindex(LABELS, fill_value=0)
            * 100
        )

        distribution = distribution.sort_values(
            ascending=False
        )

        for i, (window, percentage) in enumerate(
            distribution.head(3).items(),
            start=1
        ):

            print(
                f"{i}. {window} "
                f"→ historical share "
                f"{percentage:.2f}%"
            )


    # ========================================================
    # ATM CANDIDATES
    # ========================================================

    candidate_atms = atm_locations[
        atm_locations["zone_id"] == zone
    ]

    print("\nATM candidates in zone:")

    if len(candidate_atms) == 0:

        print("No ATM candidates found.")

    else:

        for _, atm in candidate_atms.head(5).iterrows():

            print(
                f"- {atm['atm_id']} "
                f"({atm['bank']})"
            )


# ============================================================
# ACTUAL CASHOUT — DEMO ONLY
# ============================================================

actual = hotspots[
    hotspots["actual_cashout_in_zone"] == 1
]

print("\n========================================")
print("VALIDATION CHECK — DEMO ONLY")
print("========================================")

if len(actual) > 0:

    print(
        "Actual cashout zone:",
        actual.iloc[0]["zone_id"]
    )

    print(
        "Actual zone predicted at rank:",
        int(actual.iloc[0]["rank"])
    )

else:

    print(
        "No actual cashout zone available."
    )


print("\n========================================")
print("FINAL PREDICTION COMPLETE")
print("========================================")