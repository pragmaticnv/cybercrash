import pandas as pd
import numpy as np

from pathlib import Path

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import (
    average_precision_score,
    precision_score,
    recall_score,
    f1_score
)


# ============================================================
# 1. FILE LOCATION
# ============================================================

file_path = Path("data/09_location_prediction_ml_dataset.csv")


# ============================================================
# 2. FEATURES
# ============================================================

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


# ============================================================
# 3. LOAD DATA
# ============================================================

print("========================================")
print("LOADING DATA")
print("========================================")

df = pd.read_csv(
    file_path,
    usecols=required_columns
)

print("Rows:", len(df))
print("Columns:", len(df.columns))


# ============================================================
# 4. CREATE SPLITS
# ============================================================

train_df = df[df["split"] == "train"]
validation_df = df[df["split"] == "validation"]
test_df = df[df["split"] == "test"]


X_train = train_df[numeric_features + categorical_features]
y_train = train_df[target]

X_validation = validation_df[numeric_features + categorical_features]
y_validation = validation_df[target]

X_test = test_df[numeric_features + categorical_features]
y_test = test_df[target]


print("\n========================================")
print("SPLITS")
print("========================================")

print("Training:", X_train.shape)
print("Validation:", X_validation.shape)
print("Test:", X_test.shape)


# ============================================================
# 5. CALCULATE CLASS WEIGHT
# ============================================================

negative_count = (y_train == 0).sum()
positive_count = (y_train == 1).sum()

class_weight_ratio = negative_count / positive_count

print("\n========================================")
print("CLASS IMBALANCE")
print("========================================")

print("Negative samples:", negative_count)
print("Positive samples:", positive_count)
print("Negative / Positive ratio:", round(class_weight_ratio, 2))


# ============================================================
# 6. PREPROCESSING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        )
    ],
    remainder="passthrough"
)


# ============================================================
# 7. BASELINE MODEL
# ============================================================

model = SGDClassifier(
    loss="log_loss",
    class_weight="balanced",
    max_iter=1000,
    random_state=42,
    n_jobs=-1
)


pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ============================================================
# 8. TRAIN
# ============================================================

print("\n========================================")
print("TRAINING BASELINE MODEL")
print("========================================")

pipeline.fit(X_train, y_train)

print("Baseline training complete!")


# ============================================================
# 9. VALIDATION PREDICTIONS
# ============================================================

print("\n========================================")
print("VALIDATION")
print("========================================")

validation_probabilities = pipeline.predict_proba(
    X_validation
)[:, 1]

validation_predictions = (
    validation_probabilities >= 0.5
).astype(int)


# ============================================================
# 10. METRICS
# ============================================================

pr_auc = average_precision_score(
    y_validation,
    validation_probabilities
)

precision = precision_score(
    y_validation,
    validation_predictions,
    zero_division=0
)

recall = recall_score(
    y_validation,
    validation_predictions,
    zero_division=0
)

f1 = f1_score(
    y_validation,
    validation_predictions,
    zero_division=0
)


print("PR-AUC:", round(pr_auc, 4))
print("Precision:", round(precision, 4))
print("Recall:", round(recall, 4))
print("F1:", round(f1, 4))


# ============================================================
# 11. TOP-K RECALL
# ============================================================

print("\n========================================")
print("TOP-K HOTSPOT RECALL")
print("========================================")


validation_results = pd.read_csv(
    file_path,
    usecols=[
        "case_id",
        "zone_id",
        "split",
        target
    ]
)

validation_results = validation_results[
    validation_results["split"] == "validation"
].copy()

validation_results["prediction_probability"] = (
    validation_probabilities
)


def calculate_recall_at_k(results, k):

    hits = 0
    total_positive_cases = 0

    for case_id, group in results.groupby("case_id"):

        actual_positive = group[target].sum()

        if actual_positive > 0:

            total_positive_cases += 1

            top_k = group.nlargest(
                k,
                "prediction_probability"
            )

            if top_k[target].sum() > 0:
                hits += 1

    if total_positive_cases == 0:
        return 0

    return hits / total_positive_cases


recall_at_5 = calculate_recall_at_k(
    validation_results,
    5
)

recall_at_10 = calculate_recall_at_k(
    validation_results,
    10
)

print("Recall@5:", round(recall_at_5, 4))
print("Recall@10:", round(recall_at_10, 4))


# ============================================================
# COMPLETE
# ============================================================

print("\n========================================")
print("BASELINE MODEL COMPLETE")
print("========================================")