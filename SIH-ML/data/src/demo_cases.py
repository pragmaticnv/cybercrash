DEMO_CASES = {
    "LIVE_DEMO_001": {
        "case_id": "LIVE_DEMO_001",
        "fraud_type": "Investment Scam",
        "reported_amount": 150000,
        "complaint_state": "GA",
        "primary_account": "ACC_013041",
        "transactions": [
            {
                "source_account": "ACC_013041",
                "destination_account": "ACC_010028",
                "amount": 80000,
                "timestamp": "2026-09-19T18:15:00"
            },
            {
                "source_account": "ACC_010028",
                "destination_account": "ACC_012795",
                "amount": 50000,
                "timestamp": "2026-09-19T18:35:00"
            },
            {
                "source_account": "ACC_012795",
                "destination_account": "ACC_006625",
                "amount": 30000,
                "timestamp": "2026-09-19T18:50:00"
            }
        ]
    },

    "LIVE_DEMO_002": {
        "case_id": "LIVE_DEMO_002",
        "fraud_type": "UPI Fraud",
        "reported_amount": 275000,
        "complaint_state": "PB",
        "primary_account": "NEW_MULE_001",
        "transactions": [
            {
                "source_account": "NEW_MULE_001",
                "destination_account": "ACC_010028",
                "amount": 100000,
                "timestamp": "2026-09-19T17:30:00"
            },
            {
                "source_account": "ACC_010028",
                "destination_account": "NEW_ACC_001",
                "amount": 70000,
                "timestamp": "2026-09-19T17:55:00"
            },
            {
                "source_account": "NEW_ACC_001",
                "destination_account": "ACC_012795",
                "amount": 50000,
                "timestamp": "2026-09-19T18:20:00"
            },
            {
                "source_account": "NEW_ACC_001",
                "destination_account": "NEW_ACC_002",
                "amount": 30000,
                "timestamp": "2026-09-19T18:40:00"
            }
        ]
    },

    "LIVE_DEMO_003": {
        "case_id": "LIVE_DEMO_003",
        "fraud_type": "Marketplace Fraud",
        "reported_amount": 250000,
        "complaint_state": "TN",
        "primary_account": "NEW_MULE_002",
        "transactions": [
            {
                "source_account": "NEW_MULE_002",
                "destination_account": "NEW_ACC_101",
                "amount": 90000,
                "timestamp": "2026-09-19T16:10:00"
            },
            {
                "source_account": "NEW_ACC_101",
                "destination_account": "NEW_ACC_102",
                "amount": 60000,
                "timestamp": "2026-09-19T16:45:00"
            },
            {
                "source_account": "NEW_ACC_102",
                "destination_account": "NEW_ACC_103",
                "amount": 40000,
                "timestamp": "2026-09-19T17:15:00"
            },
            {
                "source_account": "NEW_ACC_101",
                "destination_account": "NEW_ACC_104",
                "amount": 20000,
                "timestamp": "2026-09-19T17:35:00"
            }
        ]
    }
}

# Compatibility aliases
DEMO_CASES["1"] = DEMO_CASES["LIVE_DEMO_001"]
DEMO_CASES["2"] = DEMO_CASES["LIVE_DEMO_002"]
DEMO_CASES["3"] = DEMO_CASES["LIVE_DEMO_003"]
DEMO_CASES["DEMO_EXISTING_001"] = DEMO_CASES["LIVE_DEMO_001"]
DEMO_CASES["DEMO_MIXED_001"] = DEMO_CASES["LIVE_DEMO_002"]
DEMO_CASES["DEMO_NEW_001"] = DEMO_CASES["LIVE_DEMO_003"]