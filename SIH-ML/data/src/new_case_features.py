import pandas as pd


DATA_DIR = "data"


def build_case_features(case_id):
    """
    Build the case-level features required by the hotspot model.

    Only transactions belonging to the current case and occurring
    at or before prediction_time are used.
    """

    # ---------------------------------------------------------
    # Load data
    # ---------------------------------------------------------

    cases = pd.read_csv(f"{DATA_DIR}/01_cybercrime_cases.csv")
    accounts = pd.read_csv(f"{DATA_DIR}/08_account_features.csv")
    transactions = pd.read_csv(f"{DATA_DIR}/03_transactions.csv")

    transactions["timestamp"] = pd.to_datetime(
        transactions["timestamp"]
    )

    # ---------------------------------------------------------
    # Get case
    # ---------------------------------------------------------

    case = cases[cases["case_id"] == case_id]

    if case.empty:
        raise ValueError(f"Case not found: {case_id}")

    case = case.iloc[0]

    prediction_time = pd.to_datetime(
        case["prediction_time"]
    )

    mule_account = case["primary_mule_account_id"]

    # ---------------------------------------------------------
    # Get account/network profile
    # ---------------------------------------------------------

    account = accounts[
        accounts["account_id"] == mule_account
    ]

    if account.empty:
        raise ValueError(
            f"Account not found: {mule_account}"
        )

    account = account.iloc[0]

    # ---------------------------------------------------------
    # CASE-SPECIFIC TRANSACTIONS
    #
    # Critical leakage protection:
    #
    # case_id must match
    # AND
    # timestamp must be <= prediction_time
    # ---------------------------------------------------------

    case_transactions = transactions[
        (transactions["case_id"] == case_id)
        &
        (transactions["timestamp"] <= prediction_time)
    ].copy()

    # ---------------------------------------------------------
    # Incoming / outgoing transactions
    # ---------------------------------------------------------

    incoming_tx = case_transactions[
        case_transactions["destination_account"]
        == mule_account
    ]

    outgoing_tx = case_transactions[
        case_transactions["source_account"]
        == mule_account
    ]

    # ---------------------------------------------------------
    # Transaction count
    # ---------------------------------------------------------

    case_tx_count = len(case_transactions)

    # ---------------------------------------------------------
    # Transaction amount
    # ---------------------------------------------------------

    case_tx_amount = case_transactions["amount"].sum()

    # ---------------------------------------------------------
    # Unique receivers
    # ---------------------------------------------------------

    unique_receivers = case_transactions[
    "destination_account"
].nunique()
    # ---------------------------------------------------------
    # Unique senders
    # ---------------------------------------------------------

    unique_senders = incoming_tx[
        "source_account"
    ].nunique()

    # ---------------------------------------------------------
    # Transaction rapidity
    #
    # Match the dataset convention:
    # 1.0 when only one transaction exists.
    # ---------------------------------------------------------

    if len(case_transactions) <= 1:
        transaction_rapidity = 1.0
    else:

        tx_times = (
            case_transactions["timestamp"]
            .sort_values()
        )

        time_differences = (
            tx_times.diff()
            .dt.total_seconds()
            .dropna()
        )

        if len(time_differences) > 0:

            # Normalize average gap to hours.
            average_gap_hours = (
                time_differences.mean() / 3600
            )

            transaction_rapidity = (
                1 / (1 + average_gap_hours)
            )

        else:
            transaction_rapidity = 1.0

    # ---------------------------------------------------------
    # Account-derived features
    #
    # These come directly from the account feature table.
    # ---------------------------------------------------------

    account_age_days = account["account_age_days"]

    previous_alert_count = account[
        "previous_alert_count"
    ]

    fund_split_ratio = account[
        "fund_split_ratio"
    ]

    network_degree = account[
        "network_degree"
    ]

    network_risk_score = account[
        "network_risk_score"
    ]

    # ---------------------------------------------------------
    # Final feature dictionary
    # ---------------------------------------------------------

    features = {

        "case_id": case_id,

        "fraud_type": case["fraud_type"],

        "state_code": case["complaint_state_code"],

        "reported_amount": case["reported_amount"],

        "case_tx_count_pre_prediction":
            case_tx_count,

        "case_tx_amount_pre_prediction":
            case_tx_amount,

        "unique_receivers_pre_prediction":
            unique_receivers,

        "unique_senders_pre_prediction":
            unique_senders,

        "transaction_rapidity_pre_prediction":
            transaction_rapidity,

        "fund_split_ratio":
            fund_split_ratio,

        "account_age_days":
            account_age_days,

        "previous_alert_count":
            previous_alert_count,

        "network_degree":
            network_degree,

        "network_risk_score":
            network_risk_score,
    }

    return features


# =============================================================
# TEST
# =============================================================

if __name__ == "__main__":

    case_id = "CASE_007001"

    features = build_case_features(case_id)

    print()
    print("CORRECTED NEW CASE FEATURE BUILDER")
    print("=" * 55)

    for key, value in features.items():
        print(f"{key}: {value}")