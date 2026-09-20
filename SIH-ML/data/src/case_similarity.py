import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity


# =========================
# PATH
# =========================

DATA_PATH = r"C:\SIH-ML\data\09_location_prediction_ml_dataset.csv"


# =========================
# BEHAVIOR FEATURES ONLY
# =========================

BEHAVIOR_FEATURES = [
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
    "network_risk_score"
]


# =========================
# LOAD DATA
# =========================

print("Loading data...")

df = pd.read_csv(
    DATA_PATH,
    usecols=BEHAVIOR_FEATURES + [
        "case_id",
        "zone_id",
        "actual_cashout_in_zone",
        "split"
    ]
)

print("Data loaded.")


# =========================
# CASE-LEVEL REPRESENTATION
# =========================

case_features = (
    df.groupby("case_id")[BEHAVIOR_FEATURES]
    .mean()
    .reset_index()
)


def get_actual_zone(group):

    positive = group[
        group["actual_cashout_in_zone"] == 1
    ]

    if positive.empty:
        return None

    return positive.iloc[0]["zone_id"]


case_info = (
    df.groupby("case_id")
    .apply(
        lambda group: pd.Series({
            "split": group["split"].iloc[0],
            "actual_zone": get_actual_zone(group)
        }),
        include_groups=False
    )
    .reset_index()
)


case_data = case_features.merge(
    case_info,
    on="case_id",
    how="left"
)


# =========================
# SCALE BEHAVIOR FEATURES
# =========================

scaler = StandardScaler()

X = scaler.fit_transform(
    case_data[BEHAVIOR_FEATURES]
)


# =========================
# FIND SIMILAR CASES
# =========================

def find_similar_cases(
    case_id,
    top_k=10
):

    if case_id not in set(case_data["case_id"]):

        raise ValueError(
            f"Case '{case_id}' not found."
        )

    target_index = case_data.index[
        case_data["case_id"] == case_id
    ][0]

    target_vector = X[
        target_index
    ].reshape(1, -1)

    similarities = cosine_similarity(
        target_vector,
        X
    )[0]

    results = case_data.copy()

    results["similarity"] = similarities

    # Remove current case.
    results = results[
        results["case_id"] != case_id
    ]

    # Only historical training cases.
    results = results[
        results["split"] == "train"
    ]

    # Only cases with an observed cashout zone.
    results = results[
        results["actual_zone"].notna()
    ]

    results = results.sort_values(
        "similarity",
        ascending=False
    ).head(top_k)

    return results[
        [
            "case_id",
            "actual_zone",
            "similarity"
        ]
    ]


# =========================
# GEOGRAPHIC PATTERN
# =========================

def analyze_geographic_pattern(
    similar_cases
):

    if similar_cases.empty:

        return {
            "dominant_zone": None,
            "dominant_zone_count": 0,
            "cases_analyzed": 0,
            "pattern_strength": 0.0,
            "pattern_message":
                "No historical cases with observed cashouts were found."
        }

    zone_counts = (
        similar_cases["actual_zone"]
        .value_counts()
    )

    dominant_zone = zone_counts.index[0]

    dominant_count = int(
        zone_counts.iloc[0]
    )

    total_cases = len(
        similar_cases
    )

    pattern_strength = (
        dominant_count / total_cases
    )

    if pattern_strength >= 0.5:

        message = (
            f"{dominant_count} of {total_cases} "
            f"similar historical cases were associated "
            f"with {dominant_zone}, indicating a "
            f"recurring geographic pattern."
        )

    elif pattern_strength >= 0.3:

        message = (
            f"{dominant_count} of {total_cases} "
            f"similar historical cases were associated "
            f"with {dominant_zone}. This shows a "
            f"partial geographic pattern, but the cases "
            f"are distributed across multiple zones."
        )

    else:

        message = (
            f"No dominant geographic pattern was found "
            f"among the {total_cases} similar historical "
            f"cases."
        )

    return {
        "dominant_zone": dominant_zone,
        "dominant_zone_count": dominant_count,
        "cases_analyzed": total_cases,
        "pattern_strength": round(
            pattern_strength,
            3
        ),
        "pattern_message": message
    }


# =========================
# FULL ANALYSIS
# =========================

def analyze_case_pattern(
    case_id,
    top_k=10
):

    similar_cases = find_similar_cases(
        case_id,
        top_k
    )

    pattern = analyze_geographic_pattern(
        similar_cases
    )

    return {
        "case_id": case_id,
        "similar_cases": similar_cases,
        "pattern": pattern
    }


# =========================
# TEST
# =========================

if __name__ == "__main__":

    TEST_CASE = "CASE_007001"

    result = analyze_case_pattern(
        TEST_CASE,
        top_k=10
    )

    print("\n========================================")
    print("BEHAVIOR-BASED CASE SIMILARITY")
    print("========================================")

    print(
        f"Current case: {TEST_CASE}"
    )

    print(
        "\nSimilarity features:"
    )

    for feature in BEHAVIOR_FEATURES:
        print(f"  - {feature}")

    print("\nSimilar historical cases:")
    print("----------------------------------------")

    for _, row in result[
        "similar_cases"
    ].iterrows():

        print(
            f"{row['case_id']} | "
            f"Behavior similarity: "
            f"{row['similarity']:.3f} | "
            f"Observed zone: "
            f"{row['actual_zone']}"
        )

    pattern = result["pattern"]

    print("\nGeographic pattern:")
    print("----------------------------------------")

    print(
        f"Cases analyzed: "
        f"{pattern['cases_analyzed']}"
    )

    print(
        f"Dominant zone: "
        f"{pattern['dominant_zone']}"
    )

    print(
        f"Cases in dominant zone: "
        f"{pattern['dominant_zone_count']}"
    )

    print(
        f"Pattern strength: "
        f"{pattern['pattern_strength']:.3f}"
    )

    print(
        f"\n{pattern['pattern_message']}"
    )

    print("\n========================================")
    print("ANALYSIS COMPLETE")
    print("========================================")