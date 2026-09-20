import pandas as pd
import joblib

from collections import Counter

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
# LOAD DATA
# =========================

print("Loading test data...")

df = pd.read_csv(
    DATA_PATH,
    usecols=FEATURES + [
        "case_id",
        "zone_id",
        "actual_cashout_in_zone",
        "split"
    ]
)

test = df[df["split"] == "test"].copy()

print(f"Test cases: {test['case_id'].nunique():,}")
print(f"Test rows:  {len(test):,}")


# =========================
# LOAD MODEL
# =========================

print("\nLoading model...")

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)

print("Model loaded.")


# =========================
# PREDICT
# =========================

X_test = test[FEATURES]

X_encoded = preprocessor.transform(X_test)

scores = model.predict_proba(X_encoded)[:, 1]

test["score"] = scores


# =========================
# RANK EACH ACTUAL ZONE
# =========================

ranks = []

for case_id, group in test.groupby("case_id"):

    ranked = group.sort_values(
        "score",
        ascending=False
    ).reset_index(drop=True)

    actual_rows = ranked[
        ranked["actual_cashout_in_zone"] == 1
    ]

    if len(actual_rows) == 0:
        continue

    # Normally there is one actual zone.
    actual_zone = actual_rows.iloc[0]["zone_id"]

    actual_rank = (
        ranked.index[
            ranked["zone_id"] == actual_zone
        ][0]
        + 1
    )

    ranks.append({
        "case_id": case_id,
        "actual_zone": actual_zone,
        "actual_rank": actual_rank
    })


rank_df = pd.DataFrame(ranks)


# =========================
# RANKING METRICS
# =========================

total = len(rank_df)

recall_at_1 = (
    (rank_df["actual_rank"] <= 1).sum() / total
)

recall_at_3 = (
    (rank_df["actual_rank"] <= 3).sum() / total
)

recall_at_5 = (
    (rank_df["actual_rank"] <= 5).sum() / total
)

recall_at_10 = (
    (rank_df["actual_rank"] <= 10).sum() / total
)


# =========================
# RANK DISTRIBUTION
# =========================

rank_bins = {
    "Rank 1": (1, 1),
    "Rank 2–3": (2, 3),
    "Rank 4–5": (4, 5),
    "Rank 6–10": (6, 10),
    "Rank 11–20": (11, 20),
    "Rank 21–50": (21, 50),
    "Rank 51–100": (51, 100),
    "Rank 101–144": (101, 144)
}


# =========================
# OUTPUT
# =========================

print("\n========================================")
print("TEST RANKING DIAGNOSTIC")
print("========================================")

print(f"Cases evaluated: {total:,}")

print("\nRecall@K")
print("----------------------------------------")
print(f"Recall@1:  {recall_at_1:.4f} ({recall_at_1 * 100:.2f}%)")
print(f"Recall@3:  {recall_at_3:.4f} ({recall_at_3 * 100:.2f}%)")
print(f"Recall@5:  {recall_at_5:.4f} ({recall_at_5 * 100:.2f}%)")
print(f"Recall@10: {recall_at_10:.4f} ({recall_at_10 * 100:.2f}%)")

print("\nActual-zone rank distribution")
print("----------------------------------------")

for label, (low, high) in rank_bins.items():

    count = (
        (rank_df["actual_rank"] >= low) &
        (rank_df["actual_rank"] <= high)
    ).sum()

    percentage = count / total * 100

    print(
        f"{label:<12} : "
        f"{count:4d} cases ({percentage:.2f}%)"
    )


print("\nRank statistics")
print("----------------------------------------")
print(
    f"Median actual rank: "
    f"{rank_df['actual_rank'].median():.1f}"
)

print(
    f"Mean actual rank:   "
    f"{rank_df['actual_rank'].mean():.2f}"
)

print(
    f"Best rank:          "
    f"{rank_df['actual_rank'].min()}"
)

print(
    f"Worst rank:         "
    f"{rank_df['actual_rank'].max()}"
)

print("\n========================================")
print("DIAGNOSTIC COMPLETE")
print("========================================")