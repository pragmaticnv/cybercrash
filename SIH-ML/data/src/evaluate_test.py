import pandas as pd
import joblib

from sklearn.metrics import (
    average_precision_score,
    precision_score,
    recall_score,
    f1_score
)

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

print(f"Test rows: {len(test):,}")
print(f"Test cases: {test['case_id'].nunique():,}")
print(
    f"Positive targets: "
    f"{test['actual_cashout_in_zone'].sum():,}"
)


# =========================
# LOAD MODEL
# =========================

print("\nLoading model...")

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)

print("Model loaded.")


# =========================
# PREPROCESS
# =========================

X_test = test[FEATURES]
y_test = test["actual_cashout_in_zone"]

X_test_encoded = preprocessor.transform(X_test)


# =========================
# PREDICTIONS
# =========================

print("\nGenerating predictions...")

scores = model.predict_proba(X_test_encoded)[:, 1]

y_pred = (scores >= 0.5).astype(int)


# =========================
# METRICS
# =========================

pr_auc = average_precision_score(y_test, scores)

precision = precision_score(
    y_test,
    y_pred,
    zero_division=0
)

recall = recall_score(
    y_test,
    y_pred,
    zero_division=0
)

f1 = f1_score(
    y_test,
    y_pred,
    zero_division=0
)


# =========================
# RANKING METRICS
# =========================

results = test[
    ["case_id", "zone_id", "actual_cashout_in_zone"]
].copy()

results["score"] = scores

top5_hits = 0
top10_hits = 0

for case_id, group in results.groupby("case_id"):

    ranked = group.sort_values(
        "score",
        ascending=False
    )

    actual = ranked[
        ranked["actual_cashout_in_zone"] == 1
    ]

    if len(actual) == 0:
        continue

    actual_zone = actual.iloc[0]["zone_id"]

    top5_zones = ranked.head(5)["zone_id"].values
    top10_zones = ranked.head(10)["zone_id"].values

    if actual_zone in top5_zones:
        top5_hits += 1

    if actual_zone in top10_zones:
        top10_hits += 1


total_cases = results["case_id"].nunique()

recall_at_5 = top5_hits / total_cases
recall_at_10 = top10_hits / total_cases


# =========================
# OUTPUT
# =========================

print("\n========================================")
print("FINAL TEST SET EVALUATION")
print("========================================")

print(f"Test cases:       {total_cases:,}")
print(f"Test rows:        {len(test):,}")
print(f"Positive targets: {int(y_test.sum()):,}")

print("\nClassification Metrics")
print("----------------------------------------")
print(f"PR-AUC:    {pr_auc:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1 Score:  {f1:.4f}")

print("\nRanking Metrics")
print("----------------------------------------")
print(f"Recall@5:  {recall_at_5:.4f}")
print(f"Recall@10: {recall_at_10:.4f}")

print("\n========================================")
print("TEST EVALUATION COMPLETE")
print("========================================")