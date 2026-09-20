import pandas as pd
import numpy as np
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import (
    average_precision_score,
    precision_score,
    recall_score,
    f1_score
)
from xgboost import XGBClassifier


# ============================================================
# 1. PATH
# ============================================================

DATA_PATH = r"C:\SIH-ML\data\09_location_prediction_ml_dataset.csv"


# ============================================================
# 2. LOAD DATA
# ============================================================

print("Loading dataset...")

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

    # IMPORTANT:
    # time_similarity and network_similarity are intentionally removed

    "distance_from_complaint_state_km",
    "atm_density",
    "recent_cashout_24h_pre_prediction",
    "location_risk_score_pre_prediction",

    "actual_cashout_in_zone",
    "split"
]

df = pd.read_csv(DATA_PATH, usecols=columns)

print("Dataset shape:", df.shape)


# ============================================================
# 3. FEATURES
# ============================================================

target = "actual_cashout_in_zone"

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

print("\nNumber of model features:", len(features))

print("\nCategorical features:")
print(categorical_features)

print("\nNumerical features:")
print(numerical_features)


# ============================================================
# 4. CHRONOLOGICAL SPLIT
# ============================================================

train_df = df[df["split"] == "train"].copy()
validation_df = df[df["split"] == "validation"].copy()
test_df = df[df["split"] == "test"].copy()

print("\nSplits:")
print("Train:", train_df.shape)
print("Validation:", validation_df.shape)
print("Test:", test_df.shape)


X_train = train_df[features]
y_train = train_df[target]

X_validation = validation_df[features]
y_validation = validation_df[target]

X_test = test_df[features]
y_test = test_df[target]


# ============================================================
# 5. CLASS IMBALANCE
# ============================================================

negative_count = (y_train == 0).sum()
positive_count = (y_train == 1).sum()

scale_pos_weight = negative_count / positive_count

print("\nClass distribution:")
print("Negative:", negative_count)
print("Positive:", positive_count)
print("Scale pos weight:", round(scale_pos_weight, 2))


# ============================================================
# 6. ENCODING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=True
            ),
            categorical_features
        )
    ],
    remainder="passthrough"
)

print("\nEncoding features...")

X_train_encoded = preprocessor.fit_transform(X_train)
X_validation_encoded = preprocessor.transform(X_validation)
X_test_encoded = preprocessor.transform(X_test)

print("Encoded train shape:", X_train_encoded.shape)
print("Encoded validation shape:", X_validation_encoded.shape)
print("Encoded test shape:", X_test_encoded.shape)


# ============================================================
# 7. XGBOOST MODEL
# ============================================================

print("\nTraining XGBoost...")

model = XGBClassifier(
    n_estimators=400,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,

    objective="binary:logistic",
    eval_metric="aucpr",

    scale_pos_weight=scale_pos_weight,

    random_state=42,
    n_jobs=-1,

    tree_method="hist"
)

model.fit(
    X_train_encoded,
    y_train,
    eval_set=[
        (X_validation_encoded, y_validation)
    ],
    verbose=50
)


# ============================================================
# 8. VALIDATION PREDICTIONS
# ============================================================

print("\nGenerating validation predictions...")

validation_probability = model.predict_proba(
    X_validation_encoded
)[:, 1]

validation_prediction = (
    validation_probability >= 0.5
).astype(int)


# ============================================================
# 9. STANDARD METRICS
# ============================================================

pr_auc = average_precision_score(
    y_validation,
    validation_probability
)

precision = precision_score(
    y_validation,
    validation_prediction,
    zero_division=0
)

recall = recall_score(
    y_validation,
    validation_prediction,
    zero_division=0
)

f1 = f1_score(
    y_validation,
    validation_prediction,
    zero_division=0
)

print("\n========================================")
print("VALIDATION RESULTS")
print("========================================")

print("PR-AUC   :", round(pr_auc, 4))
print("Precision:", round(precision, 4))
print("Recall   :", round(recall, 4))
print("F1       :", round(f1, 4))


# ============================================================
# 10. CASE-LEVEL RANKING METRICS
# ============================================================

ranking_df = validation_df[
    ["case_id", "zone_id", target]
].copy()

ranking_df["probability"] = validation_probability

ranking_df = ranking_df.sort_values(
    ["case_id", "probability"],
    ascending=[True, False]
)

ranking_df["rank"] = (
    ranking_df
    .groupby("case_id")
    .cumcount()
    + 1
)


def recall_at_k(data, k):

    positive_cases = (
        data[data[target] == 1]["case_id"]
        .nunique()
    )

    captured_cases = (
        data[
            (data["rank"] <= k) &
            (data[target] == 1)
        ]["case_id"]
        .nunique()
    )

    return captured_cases / positive_cases


recall_5 = recall_at_k(ranking_df, 5)
recall_10 = recall_at_k(ranking_df, 10)

print("\nRanking metrics:")
print("Recall@5 :", round(recall_5, 4))
print("Recall@10:", round(recall_10, 4))


# ============================================================
# 11. FEATURE IMPORTANCE
# ============================================================

print("\n========================================")
print("TOP FEATURE IMPORTANCE")
print("========================================")

feature_names = preprocessor.get_feature_names_out()

importance = pd.DataFrame({
    "feature": feature_names,
    "importance": model.feature_importances_
})

importance = importance.sort_values(
    "importance",
    ascending=False
)

print(importance.head(20).to_string(index=False))


# ============================================================
# 12. SAVE MODEL
# ============================================================

MODEL_PATH = r"C:\SIH-ML\models"

import os
os.makedirs(MODEL_PATH, exist_ok=True)

joblib.dump(
    preprocessor,
    os.path.join(MODEL_PATH, "location_preprocessor_v2.pkl")
)

joblib.dump(
    model,
    os.path.join(MODEL_PATH, "location_xgboost_v2.pkl")
)

print("\n========================================")
print("MODEL SAVED")
print("========================================")

print("Preprocessor:")
print(os.path.join(MODEL_PATH, "location_preprocessor_v2.pkl"))

print("\nModel:")
print(os.path.join(MODEL_PATH, "location_xgboost_v2.pkl"))

print("\nDONE.")