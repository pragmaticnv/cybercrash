from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = (
    BASE_DIR
    / "09_location_prediction_ml_dataset.csv"
)


# ============================================================
# CASE-LEVEL FEATURES
# These are available before prediction.
# ============================================================

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
]

CATEGORICAL_FEATURES = [
    "fraud_type"
]


USECOLS = [
    "case_id",
    "zone_id",
    "fraud_type",
    *NUMERIC_FEATURES,
    "actual_cashout_in_zone",
]


# ============================================================
# SIMILAR CASE ENGINE
# ============================================================

class SimilarCaseEngine:

    def __init__(self):

        self.case_profiles = None
        self.scaler = None

        self._load_dataset()


    # --------------------------------------------------------
    # LOAD HISTORICAL CASES
    # --------------------------------------------------------

    def _load_dataset(self):

        print("Loading historical case profiles...")

        df = pd.read_csv(
            DATA_PATH,
            usecols=USECOLS
        )

        print(
            f"Loaded {len(df):,} historical zone records."
        )

        # ----------------------------------------------------
        # ONE ROW PER CASE
        # ----------------------------------------------------

        profiles = (
            df[
                [
                    "case_id",
                    *NUMERIC_FEATURES,
                    *CATEGORICAL_FEATURES
                ]
            ]
            .drop_duplicates(
                subset=["case_id"]
            )
            .reset_index(drop=True)
        )

        # ----------------------------------------------------
        # FIND ACTUAL CASHOUT ZONES
        # ----------------------------------------------------

        actual_cashouts = df[
            df["actual_cashout_in_zone"] == 1
        ]

        actual_zones = (
            actual_cashouts
            .groupby("case_id")["zone_id"]
            .agg(list)
            .to_dict()
        )

        profiles["actual_cashout_zones"] = (
            profiles["case_id"]
            .map(
                lambda case_id:
                    actual_zones.get(
                        case_id,
                        []
                    )
            )
        )

        self.case_profiles = profiles

        # ----------------------------------------------------
        # STANDARDIZE NUMERIC FEATURES
        # ----------------------------------------------------

        numeric_matrix = (
            profiles[NUMERIC_FEATURES]
            .fillna(0)
            .astype(float)
        )

        self.scaler = StandardScaler()

        self.scaler.fit(
            numeric_matrix
        )

        print(
            f"Historical cases available: "
            f"{len(profiles):,}"
        )


    # --------------------------------------------------------
    # FIND SIMILAR CASES
    # --------------------------------------------------------

    def find_similar_cases(
        self,
        case_features,
        top_k=5
    ):

        if self.case_profiles.empty:

            return []


        top_k = max(
            1,
            min(
                int(top_k),
                20
            )
        )


        # ----------------------------------------------------
        # NEW CASE VECTOR
        # ----------------------------------------------------

        query = pd.DataFrame(
            [
                {
                    feature:
                    float(
                        case_features.get(
                            feature,
                            0
                        )
                    )

                    for feature
                    in NUMERIC_FEATURES
                }
            ]
        )


        query_scaled = (
            self.scaler
            .transform(query)[0]
        )


        # ----------------------------------------------------
        # HISTORICAL CASE VECTORS
        # ----------------------------------------------------

        historical_matrix = (
            self.scaler
            .transform(
                self.case_profiles[
                    NUMERIC_FEATURES
                ]
                .fillna(0)
                .astype(float)
            )
        )


        # ----------------------------------------------------
        # NUMERIC DISTANCE
        # ----------------------------------------------------

        distance = np.mean(
            np.abs(
                historical_matrix
                - query_scaled
            ),
            axis=1
        )


        numeric_similarity = (
            1
            /
            (1 + distance)
        )


        # ----------------------------------------------------
        # FRAUD TYPE SIMILARITY
        # ----------------------------------------------------

        query_fraud = str(
            case_features.get(
                "fraud_type",
                ""
            )
        ).strip().lower()


        historical_fraud = (
            self.case_profiles[
                "fraud_type"
            ]
            .fillna("")
            .astype(str)
            .str.strip()
            .str.lower()
        )


        fraud_match = (
            historical_fraud
            == query_fraud
        ).astype(float).to_numpy()


        # ----------------------------------------------------
        # FINAL SIMILARITY
        #
        # 80% behavioural similarity
        # 20% fraud-type similarity
        # ----------------------------------------------------

        similarity = (
            0.80 * numeric_similarity
            +
            0.20 * fraud_match
        )


        result = (
            self.case_profiles
            .copy()
        )

        result["similarity"] = (
            similarity
        )


        # ----------------------------------------------------
        # RANK
        # ----------------------------------------------------

        result = (
            result
            .sort_values(
                [
                    "similarity",
                    "case_id"
                ],
                ascending=[
                    False,
                    True
                ]
            )
            .head(top_k)
        )


        # ----------------------------------------------------
        # API RESPONSE
        # ----------------------------------------------------

        output = []


        for _, row in result.iterrows():

            output.append(

                {
                    "case_id":
                        row["case_id"],

                    "similarity_score":
                        round(
                            float(
                                row[
                                    "similarity"
                                ]
                            ) * 100,
                            2
                        ),

                    "fraud_type":
                        row[
                            "fraud_type"
                        ],

                    "reported_amount":
                        float(
                            row[
                                "reported_amount"
                            ]
                        ),

                    "case_tx_count":
                        int(
                            row[
                                "case_tx_count_pre_prediction"
                            ]
                        ),

                    "case_tx_amount":
                        float(
                            row[
                                "case_tx_amount_pre_prediction"
                            ]
                        ),

                    "network_degree":
                        float(
                            row[
                                "network_degree"
                            ]
                        ),

                    "network_risk_score":
                        round(
                            float(
                                row[
                                    "network_risk_score"
                                ]
                            ),
                            4
                        ),

                    "actual_cashout_zones":
                        row[
                            "actual_cashout_zones"
                        ],

                    "historical_outcome_available":
                        bool(
                            len(
                                row[
                                    "actual_cashout_zones"
                                ]
                            ) > 0
                        )
                }

            )


        return output


# ============================================================
# SINGLE ENGINE INSTANCE
# ============================================================

ENGINE = SimilarCaseEngine()


# ============================================================
# PUBLIC FUNCTION
# ============================================================

def find_similar_cases(
    case_features,
    top_k=5
):

    return ENGINE.find_similar_cases(
        case_features,
        top_k=top_k
    )