import pandas as pd
from collections import deque


from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
TRANSACTIONS_PATH = BASE / "03_transactions.csv"


def trace_money_flow(account_id, max_hops=3, prediction_time=None):
    """
    Trace downstream money flow starting from an account.

    Graph direction:
        source_account -> destination_account

    Parameters:
        account_id: Starting account
        max_hops: Maximum number of downstream hops to trace

    Returns:
        Dictionary containing traced accounts and transactions.
    """

    transactions = pd.read_csv(TRANSACTIONS_PATH)

    # Make sure timestamps are usable
    transactions["timestamp"] = pd.to_datetime(
        transactions["timestamp"],
        errors="coerce"
    )
        # Prevent future transactions from entering prediction-time analysis
    if prediction_time is not None:
        prediction_time = pd.to_datetime(prediction_time)
        transactions = transactions[
            transactions["timestamp"] <= prediction_time
        ]

    # Queue contains:
    # (account, current_hop)
    queue = deque([(account_id, 0)])

    visited_accounts = {account_id}
    traced_transactions = []
    account_hops = {account_id: 0}

    while queue:

        current_account, current_hop = queue.popleft()

        if current_hop >= max_hops:
            continue

        # Find transactions flowing OUT of current account
        outgoing = transactions[
            transactions["source_account"] == current_account
        ]

        for _, tx in outgoing.iterrows():

            destination = tx["destination_account"]

            # Save transaction
            traced_transactions.append({
                "transaction_id": tx["transaction_id"],
                "timestamp": tx["timestamp"],
                "source_account": tx["source_account"],
                "destination_account": destination,
                "amount": tx["amount"],
                "channel": tx["channel"],
                "transaction_direction": tx["transaction_direction"],
                "case_id": tx["case_id"],
                "hop": current_hop + 1
            })

            # Discover new account
            if destination not in visited_accounts:

                visited_accounts.add(destination)

                account_hops[destination] = current_hop + 1

                queue.append(
                    (destination, current_hop + 1)
                )

    # Convert results to DataFrames
    flow_df = pd.DataFrame(traced_transactions)

    accounts_by_hop = {}

    for account, hop in account_hops.items():

        if hop == 0:
            continue

        accounts_by_hop.setdefault(
            f"hop_{hop}", []
        ).append(account)

    return {
        "primary_account": account_id,
        "max_hops": max_hops,
        "accounts_by_hop": accounts_by_hop,
        "total_accounts_traced": len(visited_accounts) - 1,
        "total_transactions_traced": len(flow_df),
        "transactions": flow_df
    }


if __name__ == "__main__":

    account = "ACC_006632"

    result = trace_money_flow(
        account,
        max_hops=3
    )

    print("\n" + "=" * 60)
    print("MONEY FLOW TRACE")
    print("=" * 60)

    print(f"\nPrimary Account: {result['primary_account']}")
    print(f"Maximum Hops: {result['max_hops']}")

    print(
        f"Accounts Traced: "
        f"{result['total_accounts_traced']}"
    )

    print(
        f"Transactions Traced: "
        f"{result['total_transactions_traced']}"
    )

    print("\nACCOUNTS BY HOP:")

    for hop, accounts in result["accounts_by_hop"].items():

        print(f"\n{hop}:")

        for account in accounts:
            print(f"  → {account}")

    print("\nTRANSACTION FLOW:")

    if not result["transactions"].empty:

        display_columns = [
            "transaction_id",
            "source_account",
            "destination_account",
            "amount",
            "channel",
            "hop"
        ]

        print(
            result["transactions"][display_columns]
            .to_string(index=False)
        )

    else:
        print("No downstream transactions found.")

    print("\n" + "=" * 60)