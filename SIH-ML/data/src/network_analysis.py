import pandas as pd


def analyze_network(flow_result):
    """
    Calculate network-level intelligence from the
    output of money_flow_tracer.py.
    """

    transactions = flow_result["transactions"]

    if transactions.empty:
        return {
            "network_accounts": 0,
            "transactions_traced": 0,
            "max_hop": 0,
            "total_amount": 0,
            "unique_receivers": 0,
            "average_transaction_amount": 0,
            "high_value_transactions": 0,
        }

    # Basic network statistics
    network_accounts = flow_result["total_accounts_traced"]
    transactions_traced = len(transactions)

    max_hop = transactions["hop"].max()

    total_amount = transactions["amount"].sum()

    unique_receivers = transactions[
        "destination_account"
    ].nunique()

    average_transaction_amount = transactions[
        "amount"
    ].mean()

    # Transactions above ₹20,000
    high_value_transactions = (
        transactions["amount"] >= 20000
    ).sum()

    return {
        "network_accounts": int(network_accounts),
        "transactions_traced": int(transactions_traced),
        "max_hop": int(max_hop),
        "total_amount": float(total_amount),
        "unique_receivers": int(unique_receivers),
        "average_transaction_amount": float(
            average_transaction_amount
        ),
        "high_value_transactions": int(
            high_value_transactions
        ),
    }


if __name__ == "__main__":

    from money_flow_tracer import trace_money_flow

    account = "ACC_006632"

    # First trace the money flow
    flow_result = trace_money_flow(
        account,
        max_hops=3
    )

    # Then analyze the network
    network = analyze_network(flow_result)

    print("\n" + "=" * 60)
    print("NETWORK INTELLIGENCE")
    print("=" * 60)

    print(
        f"\nPrimary Account: {account}"
    )

    print(
        f"Network Accounts: "
        f"{network['network_accounts']}"
    )

    print(
        f"Transactions Traced: "
        f"{network['transactions_traced']}"
    )

    print(
        f"Maximum Network Depth: "
        f"{network['max_hop']} hops"
    )

    print(
        f"Total Downstream Amount: "
        f"₹{network['total_amount']:,.2f}"
    )

    print(
        f"Unique Receivers: "
        f"{network['unique_receivers']}"
    )

    print(
        f"Average Transaction: "
        f"₹{network['average_transaction_amount']:,.2f}"
    )

    print(
        f"High-Value Transactions "
        f"(≥ ₹20,000): "
        f"{network['high_value_transactions']}"
    )

    print("\n" + "=" * 60)