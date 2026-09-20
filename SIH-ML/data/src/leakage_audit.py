import pandas as pd

file_path = r"C:\SIH-ML\data\09_location_prediction_ml_dataset.csv"

print("=" * 50)
print("LEAKAGE AUDIT")
print("=" * 50)

# Columns that should NEVER be model inputs
forbidden_columns = [
    "actual_cashout_in_zone",
    "case_id",
    "zone_id",
    "split",
    "source_type",
    "prediction_time",
    "complaint_time"
]

# Columns explicitly representing pre-prediction information
pre_prediction_columns = [
    "case_tx_count_pre_prediction",
    "case_tx_amount_pre_prediction",
    "unique_receivers_pre_prediction",
    "unique_senders_pre_prediction",
    "transaction_rapidity_pre_prediction",
    "historical_cashout_count_pre_prediction",
    "historical_cashout_amount_pre_prediction",
    "recent_cashout_24h_pre_prediction",
    "location_risk_score_pre_prediction"
]

# Load only the columns needed for the audit
usecols = forbidden_columns + pre_prediction_columns

df = pd.read_csv(
    file_path,
    usecols=usecols
)

print("\n1. DATA SHAPE")
print("-" * 50)
print(df.shape)

print("\n2. FORBIDDEN COLUMNS PRESENT")
print("-" * 50)

for col in forbidden_columns:
    print(f"{col}: {'YES' if col in df.columns else 'NO'}")

print("\n3. PRE-PREDICTION FEATURES")
print("-" * 50)

for col in pre_prediction_columns:
    if col in df.columns:
        print(f"{col}: PRESENT")

print("\n4. MISSING VALUES")
print("-" * 50)

missing = df.isnull().sum()

if missing.sum() == 0:
    print("No missing values found.")
else:
    print(missing[missing > 0])

print("\n5. TARGET CHECK")
print("-" * 50)

print(
    df["actual_cashout_in_zone"]
    .value_counts()
    .sort_index()
)

print("\n6. PREDICTION TIME CHECK")
print("-" * 50)

complaint_time = pd.to_datetime(
    df["complaint_time"],
    errors="coerce"
)

prediction_time = pd.to_datetime(
    df["prediction_time"],
    errors="coerce"
)

difference = prediction_time - complaint_time

print("Minimum difference:", difference.min())
print("Maximum difference:", difference.max())

expected = pd.Timedelta(minutes=30)

if (difference == expected).all():
    print("PASS: prediction_time is exactly complaint_time + 30 minutes.")
else:
    print("WARNING: prediction_time is not consistently complaint_time + 30 minutes.")

print("\n7. PRE-PREDICTION COLUMN SANITY CHECK")
print("-" * 50)

for col in pre_prediction_columns:
    if col in df.columns:
        print(
            f"{col}: "
            f"min={df[col].min()}, "
            f"max={df[col].max()}"
        )

print("\n" + "=" * 50)
print("LEAKAGE AUDIT COMPLETE")
print("=" * 50)