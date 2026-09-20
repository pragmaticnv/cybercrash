import pandas as pd
import numpy as np
from money_flow_tracer import trace_money_flow
from network_analysis import analyze_network
from previous_case_intelligence import find_previous_cases
from investigation_queue import build_investigation_queue
from prediction_engine import predict_hotspots
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CASES_PATH = BASE / "01_cybercrime_cases.csv"
def make_json_safe(obj):
    if isinstance(obj, dict):
        return {str(k): make_json_safe(v) for k, v in obj.items()}

    if isinstance(obj, list):
        return [make_json_safe(v) for v in obj]

    if isinstance(obj, tuple):
        return [make_json_safe(v) for v in obj]

    if isinstance(obj, np.integer):
        return int(obj)

    if isinstance(obj, np.floating):
        return float(obj)

    if isinstance(obj, np.bool_):
        return bool(obj)

    if obj is None:
        return None

    return obj


def analyze_case(case_id, top_k=5):

    # ---------------------------------------------------------
    # 1. Load case
    # ---------------------------------------------------------
    cases = pd.read_csv(
        CASES_PATH,
        parse_dates=["complaint_time", "prediction_time"]
    )

    case_matches = cases[cases["case_id"] == case_id]

    if case_matches.empty:
        raise ValueError(f"Case not found: {case_id}")

    case = case_matches.iloc[0]

    primary_account = case["primary_mule_account_id"]
    prediction_time = case["prediction_time"]

    # ---------------------------------------------------------
    # 2. Prediction-time money flow
    # ---------------------------------------------------------
    flow = trace_money_flow(
        primary_account,
        max_hops=3,
        prediction_time=prediction_time
    )

    # ---------------------------------------------------------
    # 3. Network analysis
    # ---------------------------------------------------------
    network = analyze_network(flow)

    # ---------------------------------------------------------
    # 4. Get all prediction-time network accounts
    # ---------------------------------------------------------
    accounts = {primary_account}

    for account_list in flow["accounts_by_hop"].values():
        accounts.update(account_list)

    # ---------------------------------------------------------
    # 5. Previous-case intelligence
    # ---------------------------------------------------------
    previous_cases = find_previous_cases(
        list(accounts),
        prediction_time
    )

    # ---------------------------------------------------------
    # 6. Investigation queue
    # ---------------------------------------------------------
    investigation_queue = build_investigation_queue(
        primary_account,
        flow["accounts_by_hop"],
        previous_cases,
        top_k=10
    )

    # Convert DataFrame to JSON-compatible records
    investigation_records = investigation_queue.to_dict(
        orient="records"
    )

    # ---------------------------------------------------------
    # 7. Existing XGBoost hotspot prediction
    # ---------------------------------------------------------
    hotspots = predict_hotspots(
        case_id,
        top_k
    )

    # Validation is not exposed to frontend
    hotspots.pop("validation", None)

    # ---------------------------------------------------------
    # 8. Final response
    # ---------------------------------------------------------
    result = {
    "case": {
        "case_id": case_id,
        "primary_account": primary_account,
        "fraud_type": case["fraud_type"],
        "reported_amount": case["reported_amount"],
        "complaint_state": case["complaint_state_ut"],
        "complaint_time": str(case["complaint_time"]),
        "prediction_time": str(prediction_time)
    },

    "network": {
        "accounts_traced": flow["total_accounts_traced"],
        "transactions_traced": flow["total_transactions_traced"],
        "summary": network,
        "accounts_by_hop": flow["accounts_by_hop"]
    },

    "previous_case_intelligence": {
        "records": len(previous_cases),
        "accounts_with_previous_cases": (
            previous_cases["account_id"].nunique()
            if not previous_cases.empty
            else 0
        )
    },

    "investigation_queue": investigation_records,

    "hotspot_prediction": hotspots
}

    return make_json_safe(result)