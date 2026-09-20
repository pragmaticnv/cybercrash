import pandas as pd
from pathlib import Path

file_path = Path("data/09_location_prediction_ml_dataset.csv")

print("========================================")
print("SIH ML DATASET - SECOND CHECK")
print("========================================")

# Read only the columns we need for this check
columns = [
    "fraud_type",
    "source_type",
    "split",
    "actual_cashout_in_zone",
    "state_code"
]

print("\nReading selected columns...")

df = pd.read_csv(
    file_path,
    usecols=columns
)

print("\n========================================")
print("FRAUD TYPES")
print("========================================")

print(df["fraud_type"].value_counts())

print("\n========================================")
print("SOURCE TYPES")
print("========================================")

print(df["source_type"].value_counts())

print("\n========================================")
print("SPLIT COUNTS")
print("========================================")

print(df["split"].value_counts())

print("\n========================================")
print("TARGET BY SPLIT")
print("========================================")

target_by_split = pd.crosstab(
    df["split"],
    df["actual_cashout_in_zone"]
)

print(target_by_split)

print("\n========================================")
print("POSITIVE RATE BY SPLIT")
print("========================================")

for split_name in ["train", "validation", "test"]:

    split_data = df[df["split"] == split_name]

    positives = split_data["actual_cashout_in_zone"].sum()
    total = len(split_data)

    rate = positives / total * 100

    print(
        f"{split_name}: "
        f"{positives} positives / "
        f"{total} rows = "
        f"{rate:.4f}%"
    )

print("\n========================================")
print("UNIQUE STATES")
print("========================================")

print("Number of states/UT codes:", df["state_code"].nunique())

print("\n========================================")
print("CHECK COMPLETE")
print("========================================")