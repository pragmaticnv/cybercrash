import pandas as pd
import numpy as np

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
# CONFIGURATION
# ============================================================

DATA_PATH = r"C:\SIH-ML\data\09_location_prediction_ml_dataset.csv"

TARGET = "actual_cashout_in_zone"

# Features that must NOT be given to the model
EXCLUDED_COLUMNS = [
    "case_id",
    "zone_id",
    "complaint_time",
    "actual_cashout_in_zone",
    "source_type",
    "split",
    "prediction_time",
    "recent_cashout_24h_pre_prediction"
]


# ============================================================
# LOAD DATA
# ============================================================

print("=" * 60)
print("XGBOOST LOCATION HOTSPOT MODEL")
print("=" * 60)

print("\nLoading dataset...")

columns_to_load = [
    "case_id",
    "zone_id",
    "split",
    TARGET,

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
    "location_risk_score_pre_prediction",

    "fraud_type",
    "state_code"
]

df = pd.read_csv(
    DATA_PATH,
    usecols=columns_to_load
)

print(f"Dataset loaded: {df.shape}")


# ============================================================
# SPLIT DATA
# ============================================================

train_df = df[df["split"] == "train"].copy()
validation_df = df[df["split"] == "validation"].copy()
test_df = df[df["split"] == "test"].copy()

print("\nDATA SPLIT")
print("-" * 60)
print(f"Train:       {train_df.shape}")
print(f"Validation:  {validation_df.shape}")
print(f"Test:        {test_df.shape}")


# ============================================================
# DEFINE FEATURES
# ============================================================

feature_columns = [
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
    "location_risk_score_pre_prediction",
    "fraud_type",
    "state_code"
]

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
    "location_risk_score_pre_prediction"
]

categorical_features = [
    "fraud_type",
    "state_code"
]


X_train = train_df[feature_columns]
y_train = train_df[TARGET]

X_validation = validation_df[feature_columns]
y_validation = validation_df[TARGET]

X_test = test_df[feature_columns]
y_test = test_df[TARGET]


# ============================================================
# CLASS IMBALANCE
# ============================================================

negative_count = (y_train == 0).sum()
positive_count = (y_train == 1).sum()

scale_pos_weight = negative_count / positive_count

print("\nCLASS DISTRIBUTION")
print("-" * 60)
print(f"Negative samples: {negative_count:,}")
print(f"Positive samples: {positive_count:,}")
print(f"Scale pos weight: {scale_pos_weight:.2f}")


# ============================================================
# ENCODING
# ============================================================

print("\nPreparing categorical encoding...")

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            ),
            categorical_features
        )
    ],
    remainder="passthrough"
)


print("Fitting encoder...")

X_train_encoded = preprocessor.fit_transform(X_train)

X_validation_encoded = preprocessor.transform(X_validation)

X_test_encoded = preprocessor.transform(X_test)

print(
    f"Encoded feature count: "
    f"{X_train_encoded.shape[1]}"
)


# ============================================================
# XGBOOST MODEL
# ============================================================

print("\nTraining XGBoost...")
print("-" * 60)

model = XGBClassifier(
    n_estimators=400,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,

    objective="binary:logistic",
    eval_metric="aucpr",

    scale_pos_weight=scale_pos_weight,

    tree_method="hist",

    random_state=42,
    n_jobs=-1
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
# VALIDATION PREDICTIONS
# ============================================================

print("\nGenerating validation predictions...")

validation_probabilities = model.predict_proba(
    X_validation_encoded
)[:, 1]


# ============================================================
# PR-AUC
# ============================================================

pr_auc = average_precision_score(
    y_validation,
    validation_probabilities
)


# ============================================================
# THRESHOLD METRICS
# ============================================================

threshold = 0.5

validation_predictions = (
    validation_probabilities >= threshold
).astype(int)


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


# ============================================================
# RECALL@K
# ============================================================

def recall_at_k(df_input, probabilities, k):

    temp = df_input[
        ["case_id", "zone_id", TARGET]
    ].copy()

    temp["probability"] = probabilities

    captured = 0
    total_positive_cases = (
        temp.groupby("case_id")[TARGET]
        .max()
        .sum()
    )

    for case_id, group in temp.groupby("case_id"):

        top_k = group.nlargest(
            k,
            "probability"
        )

        if top_k[TARGET].sum() > 0:
            captured += 1

    if total_positive_cases == 0:
        return 0

    return captured / total_positive_cases


recall_5 = recall_at_k(
    validation_df,
    validation_probabilities,
    5
)

recall_10 = recall_at_k(
    validation_df,
    validation_probabilities,
    10
)


# ============================================================
# RESULTS
# ============================================================

print("\n")
print("=" * 60)
print("XGBOOST VALIDATION RESULTS")
print("=" * 60)

print(f"\nPR-AUC:     {pr_auc:.4f}")
print(f"Precision:  {precision:.4f}")
print(f"Recall:     {recall:.4f}")
print(f"F1 Score:   {f1:.4f}")
print(f"Recall@5:   {recall_5:.4f}")
print(f"Recall@10:  {recall_10:.4f}")

print("\n" + "=" * 60)
print("TRAINING COMPLETE")
print("=" * 60)
# ============================================================
# FEATURE IMPORTANCE
# ============================================================

print("\n")
print("=" * 60)
print("TOP FEATURE IMPORTANCE")
print("=" * 60)

# Get feature names after one-hot encoding
encoded_feature_names = preprocessor.get_feature_names_out()

importance_df = pd.DataFrame({
    "feature": encoded_feature_names,
    "importance": model.feature_importances_
})

importance_df = importance_df.sort_values(
    "importance",
    ascending=False
)

print("\nTop 20 features:\n")

print(
    importance_df.head(20).to_string(index=False)
)