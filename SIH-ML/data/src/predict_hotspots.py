import pandas as pd
import joblib


# ============================================================
# PATHS
# ============================================================

DATA_PATH = r"C:\SIH-ML\data\09_location_prediction_ml_dataset.csv"

MODEL_PATH = r"C:\SIH-ML\models\location_xgboost_v2.pkl"
PREPROCESSOR_PATH = r"C:\SIH-ML\models\location_preprocessor_v2.pkl"


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading model...")

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)

print("Model loaded successfully.")


# ============================================================
# LOAD VALIDATION DATA
# ============================================================

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

df = pd.read_csv(DATA_PATH, usecols=columns)

# Use validation cases for demonstration
df = df[df["split"] == "validation"].copy()


# ============================================================
# FEATURES
# ============================================================

categorical_features = [
    "fraud_type",
    "state_code"
]

numerical_features = [
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

features = categorical_features + numerical_features


# ============================================================
# SELECT ONE CASE
# ============================================================

case_id = df["case_id"].iloc[0]

case_df = df[df["case_id"] == case_id].copy()

print("\n========================================")
print("CASE")
print("========================================")
print("Case ID:", case_id)
print("Candidate zones:", len(case_df))


# ============================================================
# PREDICT
# ============================================================

X = case_df[features]

X_encoded = preprocessor.transform(X)

probabilities = model.predict_proba(X_encoded)[:, 1]

case_df["risk_score"] = probabilities


# ============================================================
# RANK HOTSPOTS
# ============================================================

hotspots = case_df.sort_values(
    "risk_score",
    ascending=False
).reset_index(drop=True)

hotspots["rank"] = hotspots.index + 1


# ============================================================
# DISPLAY TOP 10
# ============================================================

print("\n========================================")
print("TOP 10 PREDICTED HOTSPOTS")
print("========================================")

display_columns = [
    "rank",
    "zone_id",
    "state_code",
    "risk_score",
    "location_risk_score_pre_prediction",
    "distance_from_complaint_state_km",
    "actual_cashout_in_zone"
]

print(
    hotspots[display_columns]
    .head(10)
    .to_string(index=False)
)


# ============================================================
# ACTUAL LOCATION
# ============================================================

actual = hotspots[
    hotspots["actual_cashout_in_zone"] == 1
]

print("\n========================================")
print("ACTUAL CASHOUT ZONE")
print("========================================")

if len(actual) > 0:

    print(
        actual[
            [
                "zone_id",
                "rank",
                "risk_score"
            ]
        ].to_string(index=False)
    )

else:

    print("No positive cashout zone in this case.")


print("\nDONE.")