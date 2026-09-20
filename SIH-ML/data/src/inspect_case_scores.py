import pandas as pd
import joblib

DATA_PATH = r"C:\SIH-ML\data\09_location_prediction_ml_dataset.csv"
MODEL_PATH = r"C:\SIH-ML\models\location_xgboost_v2.pkl"
PREPROCESSOR_PATH = r"C:\SIH-ML\models\location_preprocessor_v2.pkl"

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

case_id = "CASE_007001"

case_df = df[
    df["case_id"] == case_id
].copy()

categorical = [
    "fraud_type",
    "state_code"
]

numerical = [
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

features = categorical + numerical

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)

X = case_df[features]

X_encoded = preprocessor.transform(X)

case_df["model_score"] = model.predict_proba(
    X_encoded
)[:, 1]

result = case_df.sort_values(
    "model_score",
    ascending=False
)

print("\n========================================")
print("CASE SCORE DIAGNOSTIC")
print("========================================")

print("Case:", case_id)
print("Candidate zones:", len(result))

print("\nTOP 10 ZONES:")
print(
    result[
        [
            "zone_id",
            "state_code",
            "model_score",
            "location_risk_score_pre_prediction",
            "distance_from_complaint_state_km",
            "actual_cashout_in_zone"
        ]
    ].head(10).to_string(index=False)
)

print("\nUNIQUE STATES IN TOP 10:")
print(
    result.head(10)["state_code"]
    .value_counts()
)

print("\nMODEL SCORE STATISTICS:")
print(
    result["model_score"].describe()
)

print("\nLOCATION RISK STATISTICS:")
print(
    result["location_risk_score_pre_prediction"].describe()
)

print("\nDISTANCE STATISTICS:")
print(
    result["distance_from_complaint_state_km"].describe()
)

print("\n========================================")
print("DONE")
print("========================================")