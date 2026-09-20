import pandas as pd
import numpy as np
from pathlib import Path
BASE = Path(__file__).resolve().parent.parent


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0

    lat1 = np.radians(lat1)
    lon1 = np.radians(lon1)
    lat2 = np.radians(lat2)
    lon2 = np.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        np.sin(dlat / 2) ** 2
        + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2) ** 2
    )

    return 2 * R * np.arcsin(np.sqrt(a))


def build_zone_features(case_id):

    # -----------------------------
    # Load data
    # -----------------------------
    cases = pd.read_csv(
        BASE/"01_cybercrime_cases.csv",
        parse_dates=["complaint_time", "prediction_time"]
    )

    zones = pd.read_csv(BASE/"07_geographic_zones.csv")

    atms = pd.read_csv(BASE/"05_atm_locations.csv")

    withdrawals = pd.read_csv(
        BASE/"04_withdrawals.csv",
        parse_dates=["timestamp"]
    )

    # -----------------------------
    # Get case information
    # -----------------------------
    case = cases[cases["case_id"] == case_id]

    if case.empty:
        raise ValueError(f"Case not found: {case_id}")

    case = case.iloc[0]

    complaint_state = case["complaint_state_code"]
    prediction_time = case["prediction_time"]

    # -----------------------------
    # ATM density per zone
    # -----------------------------
    atm_density = (
        atms.groupby("zone_id")
        .size()
        .rename("atm_density")
        .reset_index()
    )

    zones = zones.merge(
        atm_density,
        on="zone_id",
        how="left"
    )

    zones["atm_density"] = zones["atm_density"].fillna(0)

    # -----------------------------
    # Distance from complaint state
    # -----------------------------
    state_zones = zones[
        zones["state_code"] == complaint_state
    ]

    state_lat = state_zones["center_latitude"].mean()
    state_lon = state_zones["center_longitude"].mean()

    zones["distance_from_complaint_state_km"] = haversine_km(
        state_lat,
        state_lon,
        zones["center_latitude"].values,
        zones["center_longitude"].values
    )

    # -----------------------------
    # Historical cashout features
    # -----------------------------

    # Only withdrawals available before prediction time
    historical = withdrawals[
        withdrawals["timestamp"] <= prediction_time
    ].copy()

    # Count and amount by zone
    historical_count = (
        historical.groupby("atm_id")
        .size()
    )

    historical_amount = (
        historical.groupby("atm_id")["amount"]
        .sum()
    )

    # Map ATM -> zone
    atm_zone_map = atms[
        ["atm_id", "zone_id"]
    ].drop_duplicates()

    historical = historical.merge(
        atm_zone_map,
        on="atm_id",
        how="left"
    )

    zone_history = historical.groupby("zone_id").agg(
        historical_cashout_count_pre_prediction=(
            "withdrawal_id",
            "count"
        ),
        historical_cashout_amount_pre_prediction=(
            "amount",
            "sum"
        )
    ).reset_index()

    zones = zones.merge(
        zone_history,
        on="zone_id",
        how="left"
    )

    zones[
        "historical_cashout_count_pre_prediction"
    ] = zones[
        "historical_cashout_count_pre_prediction"
    ].fillna(0)

    zones[
        "historical_cashout_amount_pre_prediction"
    ] = zones[
        "historical_cashout_amount_pre_prediction"
    ].fillna(0)

    # -----------------------------
    # Recent cashouts: previous 24h
    # -----------------------------
    window_start = prediction_time - pd.Timedelta(hours=24)

    recent = withdrawals[
        (withdrawals["timestamp"] > window_start)
        & (withdrawals["timestamp"] <= prediction_time)
    ].copy()

    recent = recent.merge(
        atm_zone_map,
        on="atm_id",
        how="left"
    )

    recent_counts = (
        recent.groupby("zone_id")
        .size()
        .rename("recent_cashout_24h_pre_prediction")
        .reset_index()
    )

    zones = zones.merge(
        recent_counts,
        on="zone_id",
        how="left"
    )

    zones[
        "recent_cashout_24h_pre_prediction"
    ] = zones[
        "recent_cashout_24h_pre_prediction"
    ].fillna(0)

    # -----------------------------
    # Location risk placeholder
    # -----------------------------
    zones["location_risk_score_pre_prediction"] = 0.0

    # -----------------------------
    # Final columns
    # -----------------------------
    result = zones[
        [
            "zone_id",
            "state_code",
            "atm_density",
            "distance_from_complaint_state_km",
            "historical_cashout_count_pre_prediction",
            "historical_cashout_amount_pre_prediction",
            "recent_cashout_24h_pre_prediction",
            "location_risk_score_pre_prediction",
        ]
    ].copy()

    return result


if __name__ == "__main__":

    CASE_ID = "CASE_007001"

    result = build_zone_features(CASE_ID)

    print("=" * 70)
    print("ZONE FEATURE BUILDER")
    print("=" * 70)

    print(f"Case: {CASE_ID}")
    print(f"Candidate zones: {len(result)}")
    print()

    print(result.head(20).to_string(index=False))