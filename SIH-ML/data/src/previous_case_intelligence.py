import pandas as pd
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CASES_PATH = BASE / "01_cybercrime_cases.csv"


def find_previous_cases(account_ids, prediction_time=None):
    """
    Check whether accounts in the traced money-flow network
    have appeared as primary mule accounts in previous cases.
    """

    cases = pd.read_csv(CASES_PATH)

    # Convert complaint time to datetime
    cases["complaint_time"] = pd.to_datetime(cases["complaint_time"])

    # Keep only cases where an account was identified
    cases = cases.dropna(subset=["primary_mule_account_id"])

    # IMPORTANT: remove cases that happened after prediction time
    if prediction_time is not None:
        prediction_time = pd.to_datetime(prediction_time)
        cases = cases[cases["complaint_time"] < prediction_time]

    results = []

    for account_id in account_ids:

        matches = cases[
            cases["primary_mule_account_id"] == account_id
        ]

        if not matches.empty:

            for _, case in matches.iterrows():

                results.append({
                    "account_id": account_id,
                    "case_id": case["case_id"],
                    "complaint_time": case["complaint_time"],
                    "fraud_type": case["fraud_type"],
                    "reported_amount": case["reported_amount"],
                    "complaint_state": case["complaint_state_ut"]
                })

    return pd.DataFrame(results)



if __name__ == "__main__":

    # Example accounts from our money-flow network
    test_accounts = [
        "ACC_009021",
        "ACC_013115",
        "ACC_005809",
        "ACC_014794"
    ]

    result = find_previous_cases(test_accounts)

    print("\n" + "=" * 60)
    print("PREVIOUS CASE INTELLIGENCE")
    print("=" * 60)

    print(
        f"\nAccounts checked: "
        f"{len(test_accounts)}"
    )

    print(
        f"Accounts with previous cases: "
        f"{result['account_id'].nunique() if not result.empty else 0}"
    )

    print(
        f"Previous case records found: "
        f"{len(result)}"
    )

    if not result.empty:

        print("\nPREVIOUS CASES:")

        print(
            result.to_string(index=False)
        )

    else:

        print("\nNo previous cases found.")

    print("\n" + "=" * 60)