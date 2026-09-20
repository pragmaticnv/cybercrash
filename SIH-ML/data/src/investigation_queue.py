import pandas as pd
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

ACCOUNT_FEATURES_PATH = BASE / "08_account_features.csv"


def build_investigation_queue(
    primary_account,
    accounts_by_hop,
    previous_cases,
    top_k=10
):
    """
    Build an explainable investigation-priority queue.

    This is NOT an ML fraud classifier.
    It only prioritizes accounts for human investigation.
    """

    # ---------------------------------------------------------
    # 1. Load account features
    # ---------------------------------------------------------
    account_features = pd.read_csv(ACCOUNT_FEATURES_PATH)

    # ---------------------------------------------------------
    # 2. Create account -> hop mapping
    # ---------------------------------------------------------
    hop_map = {
        primary_account: 0
    }

    for hop_name, accounts in accounts_by_hop.items():
        hop_number = int(hop_name.split("_")[1])

        for account_id in accounts:
            hop_map[account_id] = hop_number

    # ---------------------------------------------------------
    # 3. Keep only accounts in the traced network
    # ---------------------------------------------------------
    network_accounts = pd.DataFrame(
        [
            {
                "account_id": account_id,
                "hop": hop
            }
            for account_id, hop in hop_map.items()
        ]
    )

    # ---------------------------------------------------------
    # 4. Merge account-level features
    # ---------------------------------------------------------
    queue = network_accounts.merge(
        account_features,
        on="account_id",
        how="left"
    )

    # ---------------------------------------------------------
    # 5. Count valid previous cases
    # ---------------------------------------------------------
    if previous_cases is not None and not previous_cases.empty:

        previous_case_counts = (
            previous_cases
            .groupby("account_id")
            .size()
            .reset_index(name="previous_case_count")
        )

        queue = queue.merge(
            previous_case_counts,
            on="account_id",
            how="left"
        )

    else:
        queue["previous_case_count"] = 0

    queue["previous_case_count"] = (
        queue["previous_case_count"]
        .fillna(0)
        .astype(int)
    )

    # ---------------------------------------------------------
    # 6. Fill missing numerical values
    # ---------------------------------------------------------
    numerical_columns = [
        "network_risk_score",
        "previous_alert_count",
        "network_degree",
        "outgoing_amount_total",
        "outgoing_transaction_count",
        "unique_receivers",
        "fund_split_ratio",
        "transfer_velocity"
    ]

    for column in numerical_columns:
        queue[column] = pd.to_numeric(
            queue[column],
            errors="coerce"
        ).fillna(0)

    # ---------------------------------------------------------
    # 7. Normalize important signals
    # ---------------------------------------------------------
    def minmax(series):
        minimum = series.min()
        maximum = series.max()

        if maximum == minimum:
            return pd.Series(0.0, index=series.index)

        return (series - minimum) / (maximum - minimum)

    queue["network_risk_norm"] = minmax(
        queue["network_risk_score"]
    )

    queue["alerts_norm"] = minmax(
        queue["previous_alert_count"]
    )

    queue["degree_norm"] = minmax(
        queue["network_degree"]
    )

    queue["outgoing_amount_norm"] = minmax(
        queue["outgoing_amount_total"]
    )

    queue["outgoing_count_norm"] = minmax(
        queue["outgoing_transaction_count"]
    )

    queue["previous_cases_norm"] = minmax(
        queue["previous_case_count"]
    )

    # ---------------------------------------------------------
    # 8. Network proximity score
    # ---------------------------------------------------------
    # Primary = strongest proximity
    # Hop 1 > Hop 2 > Hop 3
    queue["proximity_score"] = (
        1.0 / (1.0 + queue["hop"])
    )

    # ---------------------------------------------------------
    # 9. Calculate investigation priority
    # ---------------------------------------------------------
    queue["investigation_score"] = (
        0.25 * queue["network_risk_norm"]
        + 0.20 * queue["previous_cases_norm"]
        + 0.15 * queue["alerts_norm"]
        + 0.10 * queue["degree_norm"]
        + 0.10 * queue["outgoing_amount_norm"]
        + 0.05 * queue["outgoing_count_norm"]
        + 0.15 * queue["proximity_score"]
    )

    # ---------------------------------------------------------
    # 10. Generate human-readable reasons
    # ---------------------------------------------------------
    def generate_reasons(row):

        reasons = []

        if row["previous_case_count"] > 0:
            reasons.append(
                f"{int(row['previous_case_count'])} previous case(s)"
            )

        if row["previous_alert_count"] > 0:
            reasons.append(
                f"{int(row['previous_alert_count'])} previous alert(s)"
            )

        if row["network_risk_score"] >= 0.6:
            reasons.append("high network risk")

        elif row["network_risk_score"] >= 0.4:
            reasons.append("elevated network risk")

        if row["outgoing_amount_total"] >= 50000:
            reasons.append("high outgoing transaction value")

        if row["outgoing_transaction_count"] >= 5:
            reasons.append("high outgoing transaction activity")

        if row["hop"] == 1:
            reasons.append("directly connected to primary account")

        elif row["hop"] == 2:
            reasons.append("2 hops from primary account")

        elif row["hop"] == 3:
            reasons.append("3 hops from primary account")

        if not reasons:
            reasons.append("network-connected account")

        return reasons

    queue["reasons"] = queue.apply(
        generate_reasons,
        axis=1
    )

    # ---------------------------------------------------------
    # 11. Sort by investigation priority
    # ---------------------------------------------------------
    queue = queue.sort_values(
        by="investigation_score",
        ascending=False
    ).reset_index(drop=True)

    # ---------------------------------------------------------
    # 12. Assign priority labels
    # ---------------------------------------------------------
    queue["priority"] = "Standard"

    queue.loc[
        queue["investigation_score"] >= 0.60,
        "priority"
    ] = "High"

    queue.loc[
        (queue["investigation_score"] >= 0.40)
        & (queue["investigation_score"] < 0.60),
        "priority"
    ] = "Medium"

    # ---------------------------------------------------------
    # 13. Always keep primary account visible
    # ---------------------------------------------------------
    top_accounts = queue.head(top_k).copy()

    if primary_account not in top_accounts["account_id"].values:

        primary_row = queue[
            queue["account_id"] == primary_account
        ]

        if not primary_row.empty:

            # Replace the last row with primary account
            top_accounts = pd.concat(
                [
                    top_accounts.iloc[:-1],
                    primary_row
                ],
                ignore_index=True
            )

    # ---------------------------------------------------------
    # 14. Select dashboard fields
    # ---------------------------------------------------------
    output_columns = [
        "account_id",
        "hop",
        "priority",
        "investigation_score",
        "network_risk_score",
        "previous_case_count",
        "previous_alert_count",
        "network_degree",
        "outgoing_amount_total",
        "outgoing_transaction_count",
        "unique_receivers",
        "reasons"
    ]

    return top_accounts[output_columns]