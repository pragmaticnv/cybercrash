from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap


BASE_DIR = Path(__file__).resolve().parent.parent.parent

MODEL_PATH = BASE_DIR / "models" / "location_xgboost_v2.pkl"
PREPROCESSOR_PATH = BASE_DIR / "models" / "location_preprocessor_v2.pkl"


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
    "location_risk_score_pre_prediction",
]

CATEGORICAL_FEATURES = [
    "fraud_type",
    "state_code",
]

FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES
FEATURE_LABELS = {
    "distance_from_complaint_state_km":
        "Distance from complaint state",

    "location_risk_score_pre_prediction":
        "Location risk score",

    "transaction_rapidity_pre_prediction":
        "Transaction rapidity",

    "fund_split_ratio":
        "Fund split ratio",

    "account_age_days":
        "Account age",

    "reported_amount":
        "Reported amount",

    "network_risk_score":
        "Network risk score",

    "network_degree":
        "Network degree",

    "case_tx_amount_pre_prediction":
        "Transaction amount",

    "case_tx_count_pre_prediction":
        "Transaction count",

    "unique_receivers_pre_prediction":
        "Unique receivers",

    "unique_senders_pre_prediction":
        "Unique senders",

    "previous_alert_count":
        "Previous alert count",

    "historical_cashout_count_pre_prediction":
        "Historical cashout count",

    "historical_cashout_amount_pre_prediction":
        "Historical cashout amount",

    "atm_density":
        "ATM density",

    "recent_cashout_24h_pre_prediction":
        "Recent 24h cashouts",
}


MODEL = joblib.load(MODEL_PATH)
PREPROCESSOR = joblib.load(PREPROCESSOR_PATH)

EXPLAINER = shap.TreeExplainer(MODEL)


def explain_hotspot(candidate_row):
    """
    Explain one exact candidate zone row.

    candidate_row must be a dictionary/Series containing
    the same FEATURES used by the XGBoost model.
    """

    row = pd.DataFrame([candidate_row])[FEATURES]

    encoded = PREPROCESSOR.transform(row)

    if hasattr(encoded, "toarray"):
        encoded = encoded.toarray()

    feature_names = PREPROCESSOR.get_feature_names_out()

    encoded_df = pd.DataFrame(
        encoded,
        columns=feature_names
    )

    shap_values = EXPLAINER.shap_values(
        encoded_df
    )

    if isinstance(shap_values, list):
        values = np.asarray(shap_values[-1])[0]
    else:
        values = np.asarray(shap_values)

        if values.ndim == 2:
            values = values[0]

    contributions = []

    for feature_name, value in zip(
        feature_names,
        values
    ):
          clean_name = feature_name

    if "__" in feature_name:
        clean_name = feature_name.split("__", 1)[1]

    if clean_name in FEATURE_LABELS:
        display_name = FEATURE_LABELS[clean_name]
    elif clean_name.startswith("fraud_type_"):
        category = clean_name.replace(
            "fraud_type_", ""
        )
        display_name = (
            f"Fraud-type model signal: {category}"
        )
    elif clean_name.startswith("state_code_"):
        category = clean_name.replace(
            "state_code_", ""
        )
        display_name = (
            f"State model signal: {category}"
        )
    else:
        display_name = clean_name.replace(
            "_", " "
        ).title()

    contributions.append({
        "feature": display_name,
        "raw_feature": feature_name,
        "contribution": float(value),
        "absolute_contribution": abs(float(value))
    })

    contributions.sort(
        key=lambda x: x["absolute_contribution"],
        reverse=True
    )

    return contributions


def summarize_reasoning(candidate_row, top_n=5):
    """
    Convert raw SHAP contributions into positive
    and negative model signals.
    """

    contributions = explain_hotspot(
        candidate_row
    )

    positive = [
        item
        for item in contributions
        if item["contribution"] > 0
    ][:top_n]

    negative = [
        item
        for item in contributions
        if item["contribution"] < 0
    ][:top_n]

    return {
        "positive_signals": positive,
        "negative_signals": negative
    }