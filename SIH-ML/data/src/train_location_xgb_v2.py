import pandas as pd
import numpy as np
import joblib

from pathlib import Path
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import (
    average_precision_score,
    precision_score,
    recall_score,
    f1_score
)
from xgboost import XGBClassifier

BASE = Path(__file__).resolve().parent.parent

DATA = BASE / "09_location_prediction_ml_dataset_v2.csv"
MODEL_DIR = BASE.parent / "models"

MODEL_DIR.mkdir(exist_ok=True)

print("Loading dataset...")

df = pd.read_csv(DATA)

TARGET = "actual_cashout_in_zone"

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

train = df[df["split"] == "train"]
val = df[df["split"] == "validation"]
test = df[df["split"] == "test"]

X_train = train[features]
y_train = train[TARGET]

X_val = val[features]
y_val = val[TARGET]

X_test = test[features]
y_test = test[TARGET]

print("Train:", len(train))
print("Validation:", len(val))
print("Test:", len(test))

positive = y_train.sum()
negative = len(y_train) - positive

scale_pos_weight = negative / positive

print("Positive:", positive)
print("Negative:", negative)
print("scale_pos_weight:", scale_pos_weight)


# --------------------------------------------------
# PREPROCESSING
# --------------------------------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            ),
            categorical_features
        ),
        (
            "numerical",
            "passthrough",
            numerical_features
        )
    ]
)

print("Fitting preprocessor...")

X_train_processed = preprocessor.fit_transform(X_train)
X_val_processed = preprocessor.transform(X_val)
X_test_processed = preprocessor.transform(X_test)

print(
    "Processed feature count:",
    X_train_processed.shape[1]
)


# --------------------------------------------------
# XGBOOST
# --------------------------------------------------

print("Training XGBoost...")

model = XGBClassifier(
    n_estimators=400,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="binary:logistic",
    eval_metric="aucpr",
    scale_pos_weight=scale_pos_weight,
    random_state=42,
    n_jobs=-1
)

model.fit(
    X_train_processed,
    y_train
)

print("Training complete.")


# --------------------------------------------------
# VALIDATION
# --------------------------------------------------

val_scores = model.predict_proba(
    X_val_processed
)[:, 1]

val_predictions = (
    val_scores >= 0.5
).astype(int)

pr_auc = average_precision_score(
    y_val,
    val_scores
)

precision = precision_score(
    y_val,
    val_predictions,
    zero_division=0
)

recall = recall_score(
    y_val,
    val_predictions,
    zero_division=0
)

f1 = f1_score(
    y_val,
    val_predictions,
    zero_division=0
)


# --------------------------------------------------
# RECALL@K
# --------------------------------------------------

def recall_at_k(data, scores, k):

    temp = data[
        ["case_id", TARGET]
    ].copy()

    temp["score"] = scores

    hits = 0
    positive_cases = 0

    for case_id, group in temp.groupby("case_id"):

        positive = group[
            group[TARGET] == 1
        ]

        if len(positive) == 0:
            continue

        positive_cases += 1

        top_k = group.nlargest(
            k,
            "score"
        )

        if top_k[TARGET].sum() > 0:
            hits += 1

    return hits / positive_cases


print()
print("======================================")
print("VALIDATION RESULTS")
print("======================================")

print("PR-AUC:", round(pr_auc, 4))
print("Precision:", round(precision, 4))
print("Recall:", round(recall, 4))
print("F1:", round(f1, 4))

for k in [1, 3, 5, 10]:
    print(
        f"Recall@{k}:",
        round(
            recall_at_k(
                val,
                val_scores,
                k
            ),
            4
        )
    )


# --------------------------------------------------
# TEST
# --------------------------------------------------

print()
print("Evaluating untouched test set...")

test_scores = model.predict_proba(
    X_test_processed
)[:, 1]

test_predictions = (
    test_scores >= 0.5
).astype(int)

test_pr_auc = average_precision_score(
    y_test,
    test_scores
)

test_precision = precision_score(
    y_test,
    test_predictions,
    zero_division=0
)

test_recall = recall_score(
    y_test,
    test_predictions,
    zero_division=0
)

test_f1 = f1_score(
    y_test,
    test_predictions,
    zero_division=0
)

print()
print("======================================")
print("TEST RESULTS")
print("======================================")

print(
    "PR-AUC:",
    round(test_pr_auc, 4)
)

print(
    "Precision:",
    round(test_precision, 4)
)

print(
    "Recall:",
    round(test_recall, 4)
)

print(
    "F1:",
    round(test_f1, 4)
)

for k in [1, 3, 5, 10]:

    print(
        f"Recall@{k}:",
        round(
            recall_at_k(
                test,
                test_scores,
                k
            ),
            4
        )
    )


# --------------------------------------------------
# SAVE
# --------------------------------------------------

model_path = (
    MODEL_DIR /
    "location_xgboost_288_v2.pkl"
)

preprocessor_path = (
    MODEL_DIR /
    "location_preprocessor_288_v2.pkl"
)

joblib.dump(
    model,
    model_path
)

joblib.dump(
    preprocessor,
    preprocessor_path
)

print()
print("======================================")
print("MODEL SAVED")
print("======================================")

print(model_path)
print(preprocessor_path)