import pandas as pd
import numpy as np

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import average_precision_score
from xgboost import XGBClassifier


DATA_PATH = r"C:\SIH-ML\data\09_location_prediction_ml_dataset.csv"


# ------------------------------------------------------------
# Load data
# ------------------------------------------------------------

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

train = df[df["split"] == "train"].copy()
validation = df[df["split"] == "validation"].copy()

target = "actual_cashout_in_zone"

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


def train_test_feature_set(name, remove_features):

    print("\n========================================")
    print(name)
    print("========================================")

    cats = [x for x in categorical if x not in remove_features]
    nums = [x for x in numerical if x not in remove_features]

    features = cats + nums

    X_train = train[features]
    y_train = train[target]

    X_val = validation[features]
    y_val = validation[target]

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore",
                    sparse_output=True
                ),
                cats
            )
        ],
        remainder="passthrough"
    )

    X_train_enc = preprocessor.fit_transform(X_train)
    X_val_enc = preprocessor.transform(X_val)

    negative = (y_train == 0).sum()
    positive = (y_train == 1).sum()

    model = XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="aucpr",
        scale_pos_weight=negative / positive,
        random_state=42,
        n_jobs=-1,
        tree_method="hist"
    )

    model.fit(
        X_train_enc,
        y_train,
        eval_set=[(X_val_enc, y_val)],
        verbose=False
    )

    probabilities = model.predict_proba(X_val_enc)[:, 1]

    pr_auc = average_precision_score(
        y_val,
        probabilities
    )

    print("Features used:", len(features))
    print("Removed:", remove_features)
    print("PR-AUC:", round(pr_auc, 4))


# ------------------------------------------------------------
# Three experiments
# ------------------------------------------------------------

train_test_feature_set(
    "1. FULL V2 MODEL",
    []
)

train_test_feature_set(
    "2. WITHOUT DISTANCE",
    [
        "distance_from_complaint_state_km"
    ]
)

train_test_feature_set(
    "3. WITHOUT LOCATION RISK",
    [
        "location_risk_score_pre_prediction"
    ]
)

train_test_feature_set(
    "4. WITHOUT BOTH",
    [
        "distance_from_complaint_state_km",
        "location_risk_score_pre_prediction"
    ]
)

print("\n========================================")
print("ABLATION TEST COMPLETE")
print("========================================")