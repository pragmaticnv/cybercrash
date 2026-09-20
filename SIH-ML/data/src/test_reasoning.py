from reasoning import summarize_reasoning
from new_case_prediction import (
    trace_new_case_network,
    build_new_case_features,
    build_candidate_zone_features
)


case = {
    "case_id": "LIVE_DEMO_001",
    "fraud_type": "UPI_FRAUD",
    "reported_amount": 75000,
    "complaint_state": "CH",
    "primary_account": "NEW_DEMO_ACCOUNT_001",
    "prediction_time": "2026-09-19T20:00:00",
    "transactions": [
        {
            "source_account": "NEW_DEMO_ACCOUNT_001",
            "destination_account": "DEMO_ACC_101",
            "amount": 30000,
            "timestamp": "2026-09-19T18:30:00"
        },
        {
            "source_account": "DEMO_ACC_101",
            "destination_account": "DEMO_ACC_202",
            "amount": 15000,
            "timestamp": "2026-09-19T18:45:00"
        },
        {
            "source_account": "DEMO_ACC_202",
            "destination_account": "DEMO_ACC_303",
            "amount": 10000,
            "timestamp": "2026-09-19T19:00:00"
        }
    ]
}


print("Building network...")

network = trace_new_case_network(
    case["primary_account"],
    case["transactions"],
    max_hops=3,
    prediction_time=case["prediction_time"]
)


print("Building case features...")

case_features = build_new_case_features(
    case,
    network
)


print("Building candidate zones...")

candidate_data = build_candidate_zone_features(
    case,
    network,
    case_features
)


print(
    "Candidate zones:",
    len(candidate_data)
)


# Load the existing model
from new_case_prediction import (
    MODEL_PATH,
    PREPROCESSOR_PATH,
    FEATURES
)

import joblib


model = joblib.load(
    MODEL_PATH
)

preprocessor = joblib.load(
    PREPROCESSOR_PATH
)


X = candidate_data[FEATURES]

X_encoded = preprocessor.transform(X)

scores = model.predict_proba(
    X_encoded
)[:, 1]

candidate_data["risk_score"] = scores


# Get the exact top hotspot
top_row = (
    candidate_data
    .sort_values(
        "risk_score",
        ascending=False
    )
    .iloc[0]
)


print("\n================================")
print("TOP PREDICTED HOTSPOT")
print("================================")

print(
    "Zone:",
    top_row["zone_id"]
)

print(
    "Risk:",
    round(
        float(top_row["risk_score"]),
        4
    )
)


print("\n================================")
print("SHAP REASONING")
print("================================")


reasoning = summarize_reasoning(
    top_row.to_dict()
)


print("\nPositive signals:")

for item in reasoning["positive_signals"]:
    print(
        f"+ {item['feature']}: "
        f"{item['contribution']:.6f}"
    )


print("\nNegative signals:")

for item in reasoning["negative_signals"]:
    print(
        f"- {item['feature']}: "
        f"{item['contribution']:.6f}"
    )