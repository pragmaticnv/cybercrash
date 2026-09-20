import pandas as pd
from pathlib import Path

# ==========================================
# FILE LOCATION
# ==========================================

file_path = Path("data/09_location_prediction_ml_dataset.csv")


# ==========================================
# FEATURES WE WILL USE
# ==========================================

numeric_features = [
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
    "time_similarity",
    "network_similarity",
    "distance_from_complaint_state_km",
    "atm_density",
    "recent_cashout_24h_pre_prediction",
    "location_risk_score_pre_prediction"
]

categorical_features = [
    "fraud_type",
    "state_code"
]

target = "actual_cashout_in_zone"

required_columns = (
    numeric_features
    + categorical_features
    + [target, "split"]
)


# ==========================================
# READ DATA
# ==========================================

print("========================================")
print("PREPARING ML DATA")
print("========================================")

print("\nReading required columns...")

df = pd.read_csv(
    file_path,
    usecols=required_columns
)

print("Rows loaded:", len(df))
print("Columns loaded:", len(df.columns))


# ==========================================
# CHECK TARGET
# ==========================================

print("\n========================================")
print("TARGET CHECK")
print("========================================")

print(df[target].value_counts())


# ==========================================
# CHECK CATEGORICAL FEATURES
# ==========================================

print("\n========================================")
print("FRAUD TYPES")
print("========================================")

print(df["fraud_type"].unique())

print("\n========================================")
print("STATE CODES")
print("========================================")

print("Number of states:", df["state_code"].nunique())


# ==========================================
# CREATE TRAIN / VALIDATION / TEST
# ==========================================

train_df = df[df["split"] == "train"].copy()
validation_df = df[df["split"] == "validation"].copy()
test_df = df[df["split"] == "test"].copy()

print("\n========================================")
print("DATASET SPLIT")
print("========================================")

print("Training rows:", len(train_df))
print("Validation rows:", len(validation_df))
print("Test rows:", len(test_df))


# ==========================================
# TARGET
# ==========================================

y_train = train_df[target]
y_validation = validation_df[target]
y_test = test_df[target]


# ==========================================
# FEATURES
# ==========================================

X_train = train_df[numeric_features + categorical_features]
X_validation = validation_df[numeric_features + categorical_features]
X_test = test_df[numeric_features + categorical_features]


# ==========================================
# DISPLAY SHAPES
# ==========================================

print("\n========================================")
print("FINAL ML DATA SHAPES")
print("========================================")

print("X_train:", X_train.shape)
print("y_train:", y_train.shape)

print("X_validation:", X_validation.shape)
print("y_validation:", y_validation.shape)

print("X_test:", X_test.shape)
print("y_test:", y_test.shape)


# ==========================================
# DISPLAY SAMPLE
# ==========================================

print("\n========================================")
print("FEATURE SAMPLE")
print("========================================")

print(X_train.head())

print("\n========================================")
print("PREPARATION COMPLETE")
print("========================================")