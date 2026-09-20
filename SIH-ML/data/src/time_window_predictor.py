import pandas as pd


# ============================================================
# PATHS
# ============================================================

WITHDRAWAL_PATH = r"C:\SIH-ML\data\04_withdrawals.csv"
ATM_PATH = r"C:\SIH-ML\data\05_atm_locations.csv"


# ============================================================
# TIME WINDOWS
# ============================================================

BINS = [0, 3, 6, 9, 12, 15, 18, 21, 24]

LABELS = [
    "12–3 AM",
    "3–6 AM",
    "6–9 AM",
    "9 AM–12 PM",
    "12–3 PM",
    "3–6 PM",
    "6–9 PM",
    "9 PM–12 AM"
]


# ============================================================
# LOAD DATA
# ============================================================

print("Loading withdrawal data...")

withdrawals = pd.read_csv(WITHDRAWAL_PATH)

atm_locations = pd.read_csv(
    ATM_PATH,
    usecols=["atm_id", "zone_id"]
)


# ============================================================
# PREPARE DATA
# ============================================================

withdrawals["timestamp"] = pd.to_datetime(
    withdrawals["timestamp"]
)

withdrawals["hour"] = withdrawals["timestamp"].dt.hour

withdrawals = withdrawals.merge(
    atm_locations,
    on="atm_id",
    how="left"
)

withdrawals["time_window"] = pd.cut(
    withdrawals["hour"],
    bins=BINS,
    labels=LABELS,
    right=False
)


# ============================================================
# FUNCTION
# ============================================================

def get_time_windows(zone_id, top_k=3):

    zone_data = withdrawals[
        withdrawals["zone_id"] == zone_id
    ]

    if len(zone_data) == 0:
        return []

    distribution = (
        zone_data["time_window"]
        .value_counts(normalize=True)
        .reindex(LABELS, fill_value=0)
        * 100
    )

    distribution = distribution.sort_values(
        ascending=False
    )

    results = []

    for window, percentage in distribution.head(top_k).items():

        results.append({
            "time_window": str(window),
            "historical_share": round(float(percentage), 2)
        })

    return results


# ============================================================
# TEST WITH TOP PREDICTED ZONES
# ============================================================

test_zones = [
    "GA_Z05",
    "GA_Z02",
    "GA_Z00",
    "GA_Z06",
    "GA_Z03"
]


print("\n========================================")
print("TOP-3 PROBABLE WITHDRAWAL WINDOWS")
print("========================================")

for rank, zone in enumerate(test_zones, start=1):

    results = get_time_windows(zone)

    print(f"\nHOTSPOT #{rank}: {zone}")

    if not results:
        print("No historical withdrawal data available.")
        continue

    for i, result in enumerate(results, start=1):

        print(
            f"{i}. {result['time_window']} "
            f"→ {result['historical_share']}%"
        )


print("\n========================================")
print("DONE")
print("========================================")