import pandas as pd
import numpy as np

FILE = r"C:\SIH-ML\data\09_location_prediction_ml_dataset.csv"

TARGET = "actual_cashout_in_zone"

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
    "time_similarity",
    "network_similarity",
    "distance_from_complaint_state_km",
    "atm_density",
    "recent_cashout_24h_pre_prediction",
    "location_risk_score_pre_prediction",
]

USECOLS = [
    "case_id",
    "zone_id",
    "state_code",
    TARGET,
] + NUMERIC_FEATURES


print("=" * 60)
print("DEEP LEAKAGE / DATA SANITY AUDIT")
print("=" * 60)

df = pd.read_csv(FILE, usecols=USECOLS)

print("\nDATA SHAPE")
print("-" * 60)
print("Rows:", len(df))
print("Columns:", len(df.columns))


# ============================================================
# 1. CASE / ZONE STRUCTURE
# ============================================================

print("\n1. CASE / ZONE STRUCTURE")
print("-" * 60)

case_counts = df.groupby("case_id").size()

print("Unique cases:", df["case_id"].nunique())
print("Rows per case:")
print(case_counts.value_counts().sort_index())

if case_counts.nunique() == 1:
    print("PASS: Every case has the same number of candidate zones.")
else:
    print("WARNING: Candidate-zone count differs between cases.")


# ============================================================
# 2. TARGET DISTRIBUTION
# ============================================================

print("\n2. TARGET DISTRIBUTION")
print("-" * 60)

print(df[TARGET].value_counts().sort_index())

positive_cases = (
    df.groupby("case_id")[TARGET]
    .max()
)

print("Cases with at least one positive zone:",
      positive_cases.sum())

print("Total cases:",
      len(positive_cases))


# ============================================================
# 3. POSITIVE ZONES PER CASE
# ============================================================

print("\n3. POSITIVE ZONES PER CASE")
print("-" * 60)

positive_per_case = (
    df.groupby("case_id")[TARGET]
    .sum()
)

print(positive_per_case.value_counts().sort_index())

print("Maximum positive zones in one case:",
      positive_per_case.max())


# ============================================================
# 4. TARGET BY ZONE
# ============================================================

print("\n4. TARGET BY ZONE")
print("-" * 60)

zone_stats = (
    df.groupby("zone_id")[TARGET]
    .agg(["count", "sum", "mean"])
    .sort_values("mean", ascending=False)
)

print("Unique zones:", len(zone_stats))

print("\nTop 10 zones by positive rate:")
print(zone_stats.head(10))

print("\nBottom 10 zones by positive rate:")
print(zone_stats.tail(10))


# ============================================================
# 5. TARGET BY STATE
# ============================================================

print("\n5. TARGET BY STATE")
print("-" * 60)

state_stats = (
    df.groupby("state_code")[TARGET]
    .agg(["count", "sum", "mean"])
    .sort_values("mean", ascending=False)
)

print("Unique states/UTs:", len(state_stats))

print("\nHighest positive-rate states:")
print(state_stats.head(10))


# ============================================================
# 6. NUMERIC FEATURE COMPARISON
# ============================================================

print("\n6. FEATURE DISTRIBUTION: POSITIVE VS NEGATIVE")
print("-" * 60)

positive = df[df[TARGET] == 1]
negative = df[df[TARGET] == 0]

comparison = []

for feature in NUMERIC_FEATURES:

    pos_mean = positive[feature].mean()
    neg_mean = negative[feature].mean()

    pos_median = positive[feature].median()
    neg_median = negative[feature].median()

    comparison.append({
        "feature": feature,
        "positive_mean": pos_mean,
        "negative_mean": neg_mean,
        "positive_median": pos_median,
        "negative_median": neg_median
    })

comparison_df = pd.DataFrame(comparison)

print(comparison_df.to_string(index=False))


# ============================================================
# 7. CORRELATION WITH TARGET
# ============================================================

print("\n7. FEATURE / TARGET CORRELATION")
print("-" * 60)

correlations = []

for feature in NUMERIC_FEATURES:

    corr = df[[feature, TARGET]].corr().iloc[0, 1]

    correlations.append({
        "feature": feature,
        "correlation": corr
    })

corr_df = (
    pd.DataFrame(correlations)
    .sort_values(
        "correlation",
        key=lambda x: x.abs(),
        ascending=False
    )
)

print(corr_df.to_string(index=False))


# ============================================================
# 8. CONSTANT FEATURES
# ============================================================

print("\n8. CONSTANT / LOW-VARIANCE FEATURES")
print("-" * 60)

for feature in NUMERIC_FEATURES:

    unique_count = df[feature].nunique()

    print(
        f"{feature}: "
        f"{unique_count} unique values"
    )


# ============================================================
# 9. CASE-LEVEL FEATURE CONSISTENCY
# ============================================================

print("\n9. CASE-LEVEL FEATURE CONSISTENCY")
print("-" * 60)

case_features = [
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
]

for feature in case_features:

    unique_per_case = (
        df.groupby("case_id")[feature]
        .nunique()
    )

    percentage_constant = (
        (unique_per_case == 1).mean() * 100
    )

    print(
        f"{feature}: "
        f"{percentage_constant:.2f}% of cases have "
        f"one constant value across zones"
    )


# ============================================================
# 10. CHECK WHETHER TARGET IS SIMPLY LOCATION RISK
# ============================================================

print("\n10. LOCATION RISK VS TARGET")
print("-" * 60)

risk_bins = pd.qcut(
    df["location_risk_score_pre_prediction"],
    q=10,
    duplicates="drop"
)

risk_analysis = (
    df.groupby(risk_bins, observed=True)[TARGET]
    .agg(["count", "sum", "mean"])
)

print(risk_analysis)


# ============================================================
# 11. CHECK HISTORICAL CASHOUT SIGNAL
# ============================================================

print("\n11. HISTORICAL CASHOUT SIGNAL")
print("-" * 60)

history_bins = pd.qcut(
    df["historical_cashout_count_pre_prediction"],
    q=5,
    duplicates="drop"
)

history_analysis = (
    df.groupby(history_bins, observed=True)[TARGET]
    .agg(["count", "sum", "mean"])
)

print(history_analysis)


# ============================================================
# 12. CHECK SUSPICIOUSLY PERFECT FEATURES
# ============================================================

print("\n12. SUSPICIOUSLY PERFECT SEPARATION")
print("-" * 60)

for feature in NUMERIC_FEATURES:

    pos_min = positive[feature].min()
    pos_max = positive[feature].max()

    neg_min = negative[feature].min()
    neg_max = negative[feature].max()

    perfect_separation = (
        pos_min > neg_max or
        neg_min > pos_max
    )

    if perfect_separation:
        print(
            "WARNING:",
            feature,
            "shows possible perfect separation."
        )
        print(
            "Positive range:",
            pos_min,
            "to",
            pos_max
        )
        print(
            "Negative range:",
            neg_min,
            "to",
            neg_max
        )


# ============================================================
# 13. FINAL SUMMARY
# ============================================================

print("\n")
print("=" * 60)
print("DEEP AUDIT COMPLETE")
print("=" * 60)

print("""
IMPORTANT:
This audit checks the structure and statistical behaviour
of the finished ML dataset.

It does NOT prove how the original feature-generation
scripts were written because those scripts are not present
in the current project folder.

Use the results to identify suspicious relationships before
training the final model.
""")