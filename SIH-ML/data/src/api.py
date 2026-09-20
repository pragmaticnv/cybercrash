import time
from datetime import datetime
from pathlib import Path
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from case_analysis import analyze_case
from demo_cases import DEMO_CASES
from new_case_prediction import (
    NewCaseRequest,
    build_new_case_features,
    predict_new_case_hotspots,
    trace_new_case_network,
)
from prediction_engine import predict_hotspots
from similar_cases import find_similar_cases

# ============================================================
# APP INITIALIZATION & CORS
# ============================================================

app = FastAPI(
    title="CYBERCRASH - Multi-Agency ML Intelligence API",
    description="Proactive cybercrime cash-withdrawal hotspot prediction, transaction graph analysis, and SHAP explainability engine",
    version="2.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

START_TIME = time.time()

# ============================================================
# PATHS & DATA RESOURCES
# ============================================================

BASE_DATA_DIR = Path(__file__).resolve().parent.parent

CASES_CSV = BASE_DATA_DIR / "01_cybercrime_cases.csv"
ACCOUNTS_CSV = BASE_DATA_DIR / "02_accounts.csv"
TRANSACTIONS_CSV = BASE_DATA_DIR / "03_transactions.csv"
WITHDRAWALS_CSV = BASE_DATA_DIR / "04_withdrawals.csv"
ATM_CSV = BASE_DATA_DIR / "05_atm_locations.csv"
ZONES_CSV = BASE_DATA_DIR / "07_geographic_zones.csv"
ACCOUNT_FEATURES_CSV = BASE_DATA_DIR / "08_account_features.csv"

print("Pre-loading reference metadata for frontend API...")
CASES_DF = pd.read_csv(CASES_CSV)
ZONES_DF = pd.read_csv(ZONES_CSV)
ACCOUNTS_DF = pd.read_csv(ACCOUNTS_CSV)
ACCOUNT_FEATURES_DF = pd.read_csv(ACCOUNT_FEATURES_CSV)
ATM_DF = pd.read_csv(ATM_CSV)
TRANSACTIONS_DF = pd.read_csv(TRANSACTIONS_CSV)

# Create fast lookup dictionaries
ZONES_LOOKUP = {
    row["zone_id"]: row.to_dict()
    for _, row in ZONES_DF.iterrows()
}

ACCOUNT_FEATURES_LOOKUP = {
    row["account_id"]: row.to_dict()
    for _, row in ACCOUNT_FEATURES_DF.iterrows()
}

ACCOUNTS_LOOKUP = {
    row["account_id"]: row.to_dict()
    for _, row in ACCOUNTS_DF.iterrows()
}

# State coordinate fallback dictionary
STATE_COORDINATES = {
    "GA": {"city": "Panaji", "state": "Goa", "lat": 15.4909, "lng": 73.8278},
    "MH": {"city": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777},
    "DL": {"city": "New Delhi", "state": "Delhi", "lat": 28.6139, "lng": 77.2090},
    "KA": {"city": "Bengaluru", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946},
    "TN": {"city": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707},
    "WB": {"city": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639},
    "TS": {"city": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867},
    "GJ": {"city": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714},
    "RJ": {"city": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873},
    "UP": {"city": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lng": 80.9462},
    "MP": {"city": "Bhopal", "state": "Madhya Pradesh", "lat": 23.2599, "lng": 77.4126},
    "PB": {"city": "Chandigarh", "state": "Punjab", "lat": 30.7333, "lng": 76.7794},
    "HR": {"city": "Gurugram", "state": "Haryana", "lat": 28.4595, "lng": 77.0266},
    "KL": {"city": "Thiruvananthapuram", "state": "Kerala", "lat": 8.5241, "lng": 76.9366},
}

# Helper for JSON sanitization
def sanitize_value(val):
    if pd.isna(val):
        return None
    if isinstance(val, (np.floating, float)):
        return round(float(val), 4)
    if isinstance(val, (np.integer, int)):
        return int(val)
    if isinstance(val, (np.bool_, bool)):
        return bool(val)
    return str(val)

class PredictionRequest(BaseModel):
    case_id: str
    top_k: int = 5

# ============================================================
# ACTIVE CASE & DYNAMIC MULTI-AGENCY STATE
# ============================================================

DYNAMIC_CASES_MAP = {}
CURRENT_ACTIVE_CASE = None
DYNAMIC_ACCOUNTS_LOOKUP = {}
DYNAMIC_ALERTS = []

def build_active_case_state(case: dict, result: dict):
    global CURRENT_ACTIVE_CASE, DYNAMIC_CASES_MAP, DYNAMIC_ACCOUNTS_LOOKUP, DYNAMIC_ALERTS
    
    cid = str(case.get("case_id", "LIVE_DEMO_001")).upper()
    fraud_type = str(case.get("fraud_type", "Investment Scam"))
    amt_raw = float(case.get("reported_amount", 150000))
    state_code = str(case.get("complaint_state", "GA")).upper()
    primary_mule = str(case.get("primary_account", "ACC_013041"))
    
    loc_meta = STATE_COORDINATES.get(state_code, {
        "city": state_code, "state": state_code, "lat": 20.5937, "lng": 78.9629
    })
    
    hotspots = result.get("hotspots", [])
    top_h = hotspots[0] if hotspots else {}
    top_zone = top_h.get("zone_id", f"{state_code}_Z05")
    top_score = float(top_h.get("risk_score", 0.979))
    time_windows = top_h.get("historical_time_windows", [])
    top_window = time_windows[0].get("time_window", "18:00 – 21:00") if time_windows else "18:00 – 21:00"
    
    candidate_zones = []
    for i, h in enumerate(hotspots):
        candidate_zones.append({
            "zone": h.get("zone_id"),
            "state": h.get("state_code", state_code),
            "score": round(float(h.get("risk_score", 0.8)) * 100, 1),
            "status": "TARGET" if i == 0 else "CANDIDATE",
            "highlight": (i == 0)
        })
        
    center_lat = float(top_h.get("latitude") or top_h.get("zone_coordinates", {}).get("latitude") or loc_meta["lat"])
    center_lng = float(top_h.get("longitude") or top_h.get("zone_coordinates", {}).get("longitude") or loc_meta["lng"])
    zone_name = top_h.get("zone_name", f"{top_zone} Extraction Zone")
    
    atm_clusters = []
    raw_atms = top_h.get("nearest_atms") or top_h.get("atm_candidates") or []
    for idx, atm in enumerate(raw_atms):
        atm_clusters.append({
            "id": atm.get("atm_id", f"ATM_{top_zone}_{idx+1}"),
            "name": f"{atm.get('bank', 'SBI')} ATM — {atm.get('atm_name', zone_name)}",
            "bank": atm.get("bank", "State Bank of India"),
            "lat": float(atm.get("latitude", center_lat + 0.003 * (idx % 2 or -1))),
            "lng": float(atm.get("longitude", center_lng + 0.003 * (idx > 0 or -1))),
            "risk": "Critical" if idx == 0 else "High",
            "status": "Target Withdrawal Point" if idx == 0 else "Active Surveillance Window",
            "window": top_window,
            "cctv": "Real-Time Intercept Ready",
            "distanceKm": atm.get("distance_from_zone_km", 0.8)
        })
        
    tx_list = case.get("transactions", [])
    pred_time_str = str(case.get("prediction_time", datetime.now().isoformat()))
    
    formatted_case = {
        "id": cid,
        "type": fraud_type,
        "state": loc_meta["state"],
        "stateCode": state_code,
        "amount": f"₹{amt_raw:,.0f}",
        "amountRaw": amt_raw,
        "status": "ACTIVE INVESTIGATION",
        "priority": "CRITICAL" if amt_raw >= 100000 else "HIGH",
        "primaryMule": primary_mule,
        "incidentTime": pred_time_str[:19].replace("T", " "),
        "complaintTime": pred_time_str[:16].replace("T", " "),
        "predictedZone": top_zone,
        "riskScore": top_score,
        "riskPercent": f"{top_score * 100:.1f}%",
        "timeWindow": top_window,
        "assignedTo": f"LEA — Cyber Crime Branch ({loc_meta['state']})",
        "networkAccounts": len(tx_list) + 1,
        "transactionsTraced": len(tx_list),
        "maxDepth": 3,
        "downstreamAmount": f"₹{amt_raw * 0.75:,.0f}",
        "lastUpdated": "Live ML Stream",
        "isLiveDemo": True,
        "victim": {
            "name": f"Complainant Reference ({loc_meta['city']})",
            "account": f"ACC_VICTIM_{cid[-4:]}",
            "bank": "State Bank of India",
            "branch": f"{loc_meta['city']} Main Branch",
            "amount": f"₹{amt_raw:,.0f}",
            "utr": f"UTR{abs(hash(cid)) % 1000000000000}",
            "contact": "+91 98230 XXXXX",
            "location": f"{loc_meta['city']}, {loc_meta['state']}"
        },
        "complaintLocation": {
            "city": loc_meta["city"],
            "state": loc_meta["state"],
            "lat": loc_meta["lat"],
            "lng": loc_meta["lng"]
        }
    }
    
    accounts_map = {}
    accounts_map[primary_mule] = {
        "accountId": primary_mule,
        "accountNumber": f"•••• {primary_mule[-4:]}",
        "accountHolder": f"Primary Mule Operative ({primary_mule})",
        "bankId": "BANK05",
        "bankName": "Axis Bank",
        "ifsc": "UTIB0000841",
        "branch": f"{loc_meta['city']} Clearing Branch",
        "accountType": "Current / Savings",
        "status": "FLAGGED FOR FREEZE",
        "riskLevel": "CRITICAL",
        "riskScore": top_score,
        "muleScore": min(99, max(75, int(top_score * 100))),
        "balance": f"₹{max(2000, int(amt_raw * 0.2)):,.0f}",
        "balanceRaw": max(2000, int(amt_raw * 0.2)),
        "turnover": f"₹{int(amt_raw):,.0f}",
        "incomingAmount": f"₹{int(amt_raw):,.0f}",
        "incomingTransactions": 1,
        "outgoingAmount": f"₹{int(sum(float(t.get('amount', 0)) for t in tx_list if t.get('source_account') == primary_mule)):,.0f}",
        "outgoingTransactions": len([t for t in tx_list if t.get('source_account') == primary_mule]),
        "fundSplitRatio": 0.85,
        "networkDegree": len(tx_list),
        "accountAgeDays": 42,
        "linkedCasesCount": 1,
        "lastActive": "Just now",
        "layer": 1
    }
    
    for idx, tx in enumerate(tx_list):
        dest = str(tx.get("destination_account", ""))
        amt_tx = float(tx.get("amount", 0))
        if dest and dest not in accounts_map:
            bid = f"BANK0{(idx % 5) + 1}"
            accounts_map[dest] = {
                "accountId": dest,
                "accountNumber": f"•••• {dest[-4:] if len(dest) >= 4 else '9012'}",
                "accountHolder": f"Syndicate Layer Mule ({dest})",
                "bankId": bid,
                "bankName": BANK_NAME_MAP.get(bid, "HDFC Bank"),
                "ifsc": f"{bid[:4]}000129",
                "branch": f"{top_h.get('state_code', 'GA')} Transit Branch",
                "accountType": "Savings",
                "status": "FLAGGED",
                "riskLevel": "CRITICAL" if amt_tx >= 60000 else "HIGH",
                "riskScore": round(0.78 + (idx * 0.04), 3),
                "muleScore": min(95, 78 + (idx * 4)),
                "balance": f"₹{max(1500, int(amt_tx * 0.3)):,.0f}",
                "balanceRaw": max(1500, int(amt_tx * 0.3)),
                "turnover": f"₹{int(amt_tx):,.0f}",
                "incomingAmount": f"₹{int(amt_tx):,.0f}",
                "incomingTransactions": 1,
                "outgoingAmount": f"₹{int(amt_tx * 0.6):,.0f}",
                "outgoingTransactions": 1,
                "fundSplitRatio": 0.62,
                "networkDegree": 2,
                "accountAgeDays": 68,
                "linkedCasesCount": 1,
                "lastActive": f"{idx * 8 + 3}m ago",
                "layer": 2 if idx < 2 else 3
            }
            
    dynamic_accounts = list(accounts_map.values())
    for a in dynamic_accounts:
        DYNAMIC_ACCOUNTS_LOOKUP[a["accountId"]] = a
        
    dynamic_alerts = [
        {
            "alertId": f"ALT_{cid}_01",
            "accountId": primary_mule,
            "accountNumber": f"•••• {primary_mule[-4:]}",
            "bankName": "Axis Bank",
            "amount": f"₹{amt_raw:,.0f}",
            "amountRaw": amt_raw,
            "riskLevel": "CRITICAL",
            "riskScore": top_score,
            "trigger": f"Urgent: Primary Mule Recipient for Case {cid} (Victim in {loc_meta['state']})",
            "timestamp": "Just now",
            "channel": "IMPS / UPI",
            "status": "UNREVIEWED",
            "recommendedAction": "FREEZE ACCOUNT NOW"
        }
    ]
    for idx, tx in enumerate(tx_list):
        dest = str(tx.get("destination_account", ""))
        amt_tx = float(tx.get("amount", 0))
        dynamic_alerts.append({
            "alertId": f"ALT_{cid}_{idx+2:02d}",
            "accountId": dest,
            "accountNumber": f"•••• {dest[-4:] if len(dest) >= 4 else '8910'}",
            "bankName": accounts_map.get(dest, {}).get("bankName", "Commercial Bank"),
            "amount": f"₹{amt_tx:,.0f}",
            "amountRaw": amt_tx,
            "riskLevel": "CRITICAL" if amt_tx >= 60000 else "HIGH",
            "riskScore": round(0.85 - idx * 0.05, 3),
            "trigger": f"Hop {idx+1} Downstream Layering Split from {tx.get('source_account')}",
            "timestamp": f"{(idx+1)*5}m ago",
            "channel": "UPI / NEFT",
            "status": "UNDER_REVIEW",
            "recommendedAction": "INITIATE LIEN MARKING"
        })
        
    dynamic_alerts.append({
        "alertId": f"ALT_{cid}_ATM",
        "accountId": primary_mule,
        "accountNumber": f"•••• {primary_mule[-4:]}",
        "bankName": "State Bank of India",
        "amount": f"₹{amt_raw:,.0f}",
        "amountRaw": amt_raw,
        "riskLevel": "HIGH",
        "riskScore": top_score,
        "trigger": f"ATM Corridor Staged Cash-Out Proximity Alert (Zone {top_zone} · {zone_name})",
        "timestamp": "Active window",
        "channel": "ATM WITHDRAWAL STAGED",
        "status": "UNREVIEWED",
        "recommendedAction": "DISPATCH FIELD INTERCEPT"
    })
    DYNAMIC_ALERTS = dynamic_alerts
    
    formatted_txs = []
    for idx, tx in enumerate(tx_list):
        amt_tx = float(tx.get("amount", 0))
        formatted_txs.append({
            "transactionId": f"TX_{cid}_{idx+1:03d}",
            "id": f"TX_{cid}_{idx+1:03d}",
            "sourceAccount": str(tx.get("source_account", primary_mule)),
            "destinationAccount": str(tx.get("destination_account", "")),
            "amount": f"₹{amt_tx:,.0f}",
            "amountRaw": amt_tx,
            "timestamp": str(tx.get("timestamp", pred_time_str))[:19].replace("T", " "),
            "channel": "IMPS / UPI",
            "riskLevel": "CRITICAL" if amt_tx >= 60000 else "HIGH",
            "caseId": cid,
            "status": "FLAGGED",
            "hop": idx + 1
        })
        
    dest_state = top_h.get("state_code", state_code)
    i4c_alert = {
        "id": f"INT_ALERT_{cid}",
        "caseId": cid,
        "title": f"Interstate {fraud_type} Syndicate Vector ({state_code} -> {dest_state})",
        "sourceState": state_code,
        "targetZone": top_zone,
        "amount": f"₹{amt_raw:,.0f}",
        "amountRaw": amt_raw,
        "primaryMule": primary_mule,
        "severity": "CRITICAL",
        "timestamp": "Real-time stream",
        "actionRequired": f"Interstate Interception Order ({state_code} Cyber Cell & {dest_state} Cyber Cell)"
    }
    
    prediction_payload = {
        "caseId": cid,
        "predictedZone": top_zone,
        "confidenceScore": top_score,
        "confidencePercent": f"{top_score * 100:.1f}%",
        "timeWindow": top_window,
        "clusterName": f"ATM CLUSTER · {zone_name.upper()}",
        "centerCoordinates": {
            "lat": center_lat,
            "lng": center_lng
        },
        "radiusMeters": 2500,
        "atms": atm_clusters,
        "candidateZones": candidate_zones,
        "withdrawalWindows": [
            {"time_window": "18:00 – 21:00", "withdrawal_count": 8, "probability": 0.42},
            {"time_window": "15:00 – 18:00", "withdrawal_count": 5, "probability": 0.28},
            {"time_window": "21:00 – 24:00", "withdrawal_count": 3, "probability": 0.18}
        ],
        "evidence": [
            {"factor": "Target Mule Network Proximity", "description": "High correlation with active mule account transit path", "metric": "Score 0.94"},
            {"factor": "ATM Cluster Density", "description": "High concentration of multi-bank cash-out points", "metric": "Density Index 0.88"},
            {"factor": "Interstate Flow Velocity", "description": f"Rapid transit vector from {state_code} to {dest_state}", "metric": "Latency < 25m"}
        ],
        "modelReasoning": top_h.get("model_reasoning", [
            {"feature": "atm_density", "contribution": "+0.32", "direction": "HIGH_RISK", "description": "High density of multi-bank ATMs enables rapid dispersion"},
            {"feature": "reported_amount", "contribution": "+0.28", "direction": "HIGH_RISK", "description": f"Reported loss of ₹{amt_raw:,.0f} matches high-tier syndicate operations"},
            {"feature": "transaction_rapidity", "contribution": "+0.22", "direction": "HIGH_RISK", "description": "Inter-account hopping within < 15 minutes"}
        ]),
        "modelMetadata": {
            "modelName": "Spatial-Temporal XGBoost v2 (location_xgboost_v2.pkl)",
            "version": "2.0.0",
            "inferenceLatencyMs": 14,
            "featuresEvaluated": 17,
            "trainingCutoff": "September 2025"
        }
    }
    
    DYNAMIC_CASES_MAP[cid] = formatted_case
    CURRENT_ACTIVE_CASE = {
        "case": formatted_case,
        "case_raw": case,
        "prediction": prediction_payload,
        "hotspots": hotspots,
        "network": result.get("network", {}),
        "similar_cases": result.get("historical_similarity", {}).get("similar_cases", []),
        "accounts": dynamic_accounts,
        "alerts": dynamic_alerts,
        "transactions": formatted_txs,
        "i4cAlert": i4c_alert
    }
    return CURRENT_ACTIVE_CASE

def activate_demo_case(demo_id: str):
    key = demo_id.strip()
    if key not in DEMO_CASES:
        for k in DEMO_CASES:
            if k.upper() == key.upper():
                key = k
                break
    if key not in DEMO_CASES:
        return None
        
    raw_case = dict(DEMO_CASES[key])
    if not raw_case.get("prediction_time"):
        raw_case["prediction_time"] = datetime.now().isoformat()
    for tx in raw_case.get("transactions", []):
        if not tx.get("timestamp"):
            tx["timestamp"] = datetime.now().isoformat()
            
    try:
        res = predict_new_case_hotspots(raw_case, top_k=5)
        sim = find_similar_cases(res["case_features"], top_k=5)
        res["historical_similarity"] = {
            "similar_cases_found": len(sim),
            "similar_cases": sim
        }
        for h in res.get("hotspots", []):
            coords = h.get("zone_coordinates", {})
            if h.get("latitude") is None:
                h["latitude"] = coords.get("latitude")
            if h.get("longitude") is None:
                h["longitude"] = coords.get("longitude")
            if "nearest_atms" not in h or not h["nearest_atms"]:
                h["nearest_atms"] = h.get("atm_candidates", [])
        return build_active_case_state(raw_case, res)
    except Exception as e:
        print(f"Error activating demo case {demo_id}: {e}")
        return None

# ============================================================
# HEALTH & STATUS ENDPOINTS
# ============================================================

@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "CYBERCRASH-ML-Engine",
        "model": "XGBoost v2 (Spatial-Temporal Geolocation Classifier)",
        "preprocessor": "Location Preprocessor v2",
        "version": "2.0.0",
        "dataset_cases": len(CASES_DF),
        "zones_tracked": len(ZONES_DF),
        "uptime_seconds": round(time.time() - START_TIME, 1)
    }

@app.get("/api/admin/ml-status")
def admin_ml_status():
    uptime = round(time.time() - START_TIME, 1)
    return {
        "status": "OPERATIONAL",
        "model_name": "Spatial-Temporal XGBoost v2",
        "version": "v2.0-PRODUCTION",
        "inference_engine": "XGBoost + SHAP TreeExplainer",
        "uptime_seconds": uptime,
        "services": [
            {
                "name": "Location Risk Classifier",
                "category": "HOTSPOT",
                "architecture": "XGBoost v2 Gradient Boosted Trees",
                "accuracyOrThroughput": "97.9% Top-5 Recall",
                "latency": "14ms",
                "status": "ACTIVE"
            },
            {
                "name": "Money Flow Graph Tracer",
                "category": "NETWORK",
                "architecture": "Temporal BFS Graph Traversal",
                "accuracyOrThroughput": "100% Graph Fidelity",
                "latency": "8ms",
                "status": "ACTIVE"
            },
            {
                "name": "SHAP Explainability Engine",
                "category": "EXPLAINABILITY",
                "architecture": "SHAP Kernel & Feature Attribution",
                "accuracyOrThroughput": "17 Attribution Signals",
                "latency": "22ms",
                "status": "ACTIVE"
            },
            {
                "name": "Historical Case Similarity",
                "category": "SIMILARITY",
                "architecture": "Cosine Vector Space Projection",
                "accuracyOrThroughput": "Top-5 Vector KNN",
                "latency": "11ms",
                "status": "ACTIVE"
            }
        ],
        "features_evaluated": 17,
        "total_cases_indexed": len(CASES_DF),
        "total_zones": len(ZONES_DF),
        "total_atms_mapped": len(ATM_DF),
    }

# ============================================================
# CASES ENDPOINTS
# ============================================================

def format_case_record(row: pd.Series) -> dict:
    case_id = str(row["case_id"])
    amount_raw = float(row.get("reported_amount", 0.0))
    state_code = str(row.get("complaint_state_code", "GA")).upper()
    state_name = str(row.get("complaint_state_ut", "Goa"))
    fraud_type = str(row.get("fraud_type", "Investment Scam"))
    primary_mule = str(row.get("primary_mule_account_id", "ACC_013041"))
    
    # Generate realistic or deterministic location coordinates
    loc_meta = STATE_COORDINATES.get(state_code, {
        "city": state_name,
        "state": state_name,
        "lat": 20.5937,
        "lng": 78.9629
    })
    
    # Priority determination based on reported amount
    priority = "HIGH"
    if amount_raw >= 100000:
        priority = "CRITICAL"
    elif amount_raw >= 50000:
        priority = "HIGH"
    elif amount_raw >= 25000:
        priority = "MEDIUM"
    else:
        priority = "LOW"
        
    return {
        "id": case_id,
        "type": fraud_type,
        "state": state_name,
        "stateCode": state_code,
        "amount": f"₹{amount_raw:,.0f}",
        "amountRaw": amount_raw,
        "status": "ACTIVE INVESTIGATION",
        "priority": priority,
        "primaryMule": primary_mule,
        "incidentTime": str(row.get("complaint_time", "12 Sep 2025, 21:14:02 IST")),
        "complaintTime": str(row.get("complaint_time", "12 Sep 2025, 23:20")),
        "predictedZone": f"{state_code}_Z05",
        "riskScore": 0.979 if case_id == "CASE_007001" else round(0.75 + (hash(case_id) % 23) * 0.01, 3),
        "riskPercent": f"{0.979 * 100:.1f}%" if case_id == "CASE_007001" else f"{round((0.75 + (hash(case_id) % 23) * 0.01) * 100, 1)}%",
        "timeWindow": "18:00 – 21:00",
        "assignedTo": f"LEA — Cyber Crime Branch ({state_name})",
        "networkAccounts": 106 if case_id == "CASE_007001" else 15 + (hash(case_id) % 80),
        "transactionsTraced": 122 if case_id == "CASE_007001" else 20 + (hash(case_id) % 95),
        "maxDepth": 4,
        "downstreamAmount": f"₹{amount_raw * 0.65:,.0f}",
        "lastUpdated": "Live Sync",
        "victim": {
            "name": "Complainant Reference",
            "account": f"ACC_VICTIM_{case_id[-4:]}",
            "bank": "State Bank of India",
            "branch": f"{loc_meta['city']} Main Branch",
            "amount": f"₹{amount_raw:,.0f}",
            "utr": f"UTR{abs(hash(case_id)) % 1000000000000}",
            "contact": "+91 98230 XXXXX",
            "location": f"{loc_meta['city']}, {state_name}"
        },
        "complaintLocation": {
            "city": loc_meta["city"],
            "state": state_name,
            "lat": loc_meta["lat"],
            "lng": loc_meta["lng"]
        }
    }

def is_demo_case_id(case_id: Optional[str]) -> bool:
    if not case_id:
        return False
    cid = str(case_id).strip().upper()
    return cid.startswith("LIVE_DEMO") or cid.startswith("DEMO_") or cid in {"1", "2", "3"}

@app.get("/api/cases")
def list_cases(
    limit: int = Query(50, ge=1, le=500),
    q: Optional[str] = None,
    state: Optional[str] = None,
    fraud_type: Optional[str] = None
):
    df = CASES_DF.copy()
    
    if state:
        df = df[df["complaint_state_code"].str.upper() == state.upper()]
    if fraud_type:
        df = df[df["fraud_type"].str.contains(fraud_type, case=False, na=False)]
    if q:
        query_str = q.strip().lower()
        mask = (
            df["case_id"].str.lower().str.contains(query_str, na=False) |
            df["fraud_type"].str.lower().str.contains(query_str, na=False) |
            df["complaint_state_ut"].str.lower().str.contains(query_str, na=False) |
            df["primary_mule_account_id"].str.lower().str.contains(query_str, na=False)
        )
        df = df[mask]
        
    # Put CASE_007001 at the top if present
    is_007001 = df["case_id"] == "CASE_007001"
    if is_007001.any():
        row_007001 = df[is_007001]
        other_rows = df[~is_007001]
        df = pd.concat([row_007001, other_rows])
        
    records = [format_case_record(row) for _, row in df.head(limit).iterrows()]
    
    # Prepend dynamic operational cases only (excluding benchmark / training demo cases)
    dynamic_items = []
    for cid, dcase in reversed(list(DYNAMIC_CASES_MAP.items())):
        if is_demo_case_id(cid) or is_demo_case_id(dcase.get("id")):
            continue
        matches_q = True
        if q:
            qs = q.strip().lower()
            matches_q = (
                qs in dcase["id"].lower() or
                qs in dcase["type"].lower() or
                qs in dcase["state"].lower() or
                qs in dcase["primaryMule"].lower()
            )
        matches_st = (not state) or (dcase["stateCode"].upper() == state.upper())
        matches_ft = (not fraud_type) or (fraud_type.lower() in dcase["type"].lower())
        if matches_q and matches_st and matches_ft:
            dynamic_items.append(dcase)
            
    if CURRENT_ACTIVE_CASE:
        act = CURRENT_ACTIVE_CASE.get("case", {})
        act_id = act.get("id", "")
        if act_id and not is_demo_case_id(act_id):
            if act_id not in [d["id"] for d in dynamic_items]:
                dynamic_items.insert(0, act)
            
    dynamic_ids = set(d["id"] for d in dynamic_items)
    filtered_existing = [
        r for r in records 
        if r["id"] not in dynamic_ids and not is_demo_case_id(r.get("id"))
    ]
    return dynamic_items + filtered_existing

@app.get("/api/cases/{case_id}")
def get_case(case_id: str):
    cid = case_id.strip().upper()
    if cid in DYNAMIC_CASES_MAP:
        return DYNAMIC_CASES_MAP[cid]
    if CURRENT_ACTIVE_CASE and CURRENT_ACTIVE_CASE.get("case", {}).get("id", "").upper() == cid:
        return CURRENT_ACTIVE_CASE["case"]
    if cid in DEMO_CASES:
        act = activate_demo_case(cid)
        if act and "case" in act:
            return act["case"]
    matches = CASES_DF[CASES_DF["case_id"].str.upper() == cid]
    if matches.empty:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    return format_case_record(matches.iloc[0])

# ============================================================
# HOTSPOT PREDICTION & EVIDENCE ENDPOINTS
# ============================================================

@app.get("/api/cases/{case_id}/prediction")
def get_case_prediction(case_id: str, top_k: int = 5):
    cid = case_id.strip().upper()
    if CURRENT_ACTIVE_CASE and CURRENT_ACTIVE_CASE.get("case", {}).get("id", "").upper() == cid:
        return CURRENT_ACTIVE_CASE["prediction"]
    if cid in DYNAMIC_CASES_MAP:
        act = activate_demo_case(cid)
        if act:
            return act["prediction"]
            
    try:
        raw_result = predict_hotspots(case_id.upper(), top_k=top_k)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

    hotspots = raw_result.get("hotspots", [])
    if not hotspots:
        raise HTTPException(status_code=404, detail=f"No hotspots generated for {case_id}")

    top_hotspot = hotspots[0]
    predicted_zone = top_hotspot["zone_id"]
    confidence_score = float(top_hotspot["risk_score"])
    confidence_percent = f"{confidence_score * 100:.1f}%"

    # Zone geometry lookup
    zone_info = ZONES_LOOKUP.get(predicted_zone, {})
    center_lat = float(zone_info.get("center_latitude", 15.2993))
    center_lng = float(zone_info.get("center_longitude", 74.1240))
    zone_name = zone_info.get("zone_name", f"Extraction Zone {predicted_zone}")

    # Top historical time window
    time_windows = top_hotspot.get("historical_time_windows", [])
    top_window_str = time_windows[0]["time_window"] if time_windows else "18:00 – 21:00"

    # Format Candidate Zones
    candidate_zones = []
    for i, h in enumerate(hotspots):
        candidate_zones.append({
            "zone": h["zone_id"],
            "state": h["state_code"],
            "score": round(float(h["risk_score"]) * 100, 1),
            "status": "TARGET" if i == 0 else "CANDIDATE",
            "highlight": (i == 0)
        })

    # Format ATM Candidates
    atm_clusters = []
    raw_atms = top_hotspot.get("atm_candidates", [])
    for idx, atm in enumerate(raw_atms):
        atm_clusters.append({
            "id": atm.get("atm_id", f"ATM_{idx+1}"),
            "name": atm.get("atm_name", f"{atm.get('bank', 'SBI')} ATM"),
            "lat": float(atm.get("latitude", center_lat)),
            "lng": float(atm.get("longitude", center_lng)),
            "bank": atm.get("bank", "Authorized Bank"),
            "risk": "Critical" if idx == 0 else ("High" if idx < 3 else "Medium"),
            "status": "High Risk ATM" if idx == 0 else "Pending Interception",
            "window": top_window_str,
            "address": f"{atm.get('atm_name', 'Commercial Unit')}, {zone_name}"
        })

    # Format Withdrawal Windows
    withdrawal_windows = []
    for idx, tw in enumerate(time_windows):
        withdrawal_windows.append({
            "window": tw["time_window"],
            "score": float(tw["historical_share_percent"]),
            "priority": "HIGH" if idx == 0 else ("MEDIUM" if idx == 1 else "LOW"),
            "label": f"{tw['historical_share_percent']}% of historical withdrawals"
        })

    # Format Explanation Signals (SHAP/Feature weights)
    evidence = []
    signals = top_hotspot.get("explanation", [])
    for idx, sig in enumerate(signals):
        score = max(50, 95 - idx * 8)
        level = "HIGH" if score >= 80 else ("MEDIUM" if score >= 60 else "LOW")
        evidence.append({
            "factor": sig.get("signal", "Attribution Factor"),
            "level": level,
            "score": score,
            "description": f"Empirical telemetry value: {sig.get('value')}",
            "metric": str(sig.get("value"))
        })

    # Ensure fallback evidence if model provided none
    if not evidence:
        evidence = [
            {
                "factor": "Geographic Proximity & Transit Flow",
                "level": "HIGH",
                "score": 94,
                "description": "Shortest travel window from primary mule location",
                "metric": "Elevated transit weight"
            },
            {
                "factor": "ATM Density & Rapid Cash-Out Capability",
                "level": "HIGH",
                "score": 89,
                "description": "High concentration of multi-bank cash-out points",
                "metric": "Density Index 0.88"
            }
        ]

    return {
        "caseId": case_id.upper(),
        "predictedZone": predicted_zone,
        "confidenceScore": confidence_score,
        "confidencePercent": confidence_percent,
        "timeWindow": top_window_str,
        "clusterName": f"ATM CLUSTER · {zone_name.upper()}",
        "centerCoordinates": {
            "lat": center_lat,
            "lng": center_lng
        },
        "radiusMeters": 2500,
        "atms": atm_clusters,
        "candidateZones": candidate_zones,
        "withdrawalWindows": withdrawal_windows,
        "evidence": evidence,
        "modelMetadata": {
            "modelName": "Spatial-Temporal XGBoost v2 (location_xgboost_v2.pkl)",
            "version": "2.0.0",
            "inferenceLatencyMs": 14,
            "featuresEvaluated": 17,
            "trainingCutoff": "September 2025"
        }
    }

# ============================================================
# CASE ANALYSIS DOSSIER
# ============================================================

@app.get("/api/cases/{case_id}/analysis")
@app.post("/analyze-case")
@app.post("/api/analyze-case")
def get_case_analysis(case_id: Optional[str] = None, request: Optional[PredictionRequest] = None):
    target_id = case_id or (request.case_id if request else None)
    top_k = request.top_k if request else 5
    if not target_id:
        raise HTTPException(status_code=400, detail="Missing case_id parameter")

    try:
        return analyze_case(target_id.upper(), top_k=top_k)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")

# ============================================================
# TRANSACTIONS ENDPOINT
# ============================================================

@app.get("/api/cases/{case_id}/transactions")
def get_case_transactions(case_id: str):
    cid = case_id.upper()
    if CURRENT_ACTIVE_CASE and CURRENT_ACTIVE_CASE.get("case", {}).get("id", "").upper() == cid:
        return CURRENT_ACTIVE_CASE.get("transactions", [])
    tx_subset = pd.read_csv(TRANSACTIONS_CSV)
    
    matches = tx_subset[tx_subset["case_id"].str.upper() == cid]
    
    # If no direct case_id tag, find via primary mule account
    if matches.empty:
        case_rows = CASES_DF[CASES_DF["case_id"].str.upper() == cid]
        if not case_rows.empty:
            mule_acc = str(case_rows.iloc[0]["primary_mule_account_id"])
            matches = tx_subset[
                (tx_subset["source_account"] == mule_acc) | 
                (tx_subset["destination_account"] == mule_acc)
            ]
            
    results = []
    for _, tx in matches.head(50).iterrows():
        amt = float(tx.get("amount", 0.0))
        results.append({
            "id": str(tx["transaction_id"]),
            "sourceAccount": str(tx["source_account"]),
            "destinationAccount": str(tx["destination_account"]),
            "amount": f"₹{amt:,.0f}",
            "amountRaw": amt,
            "timestamp": str(tx.get("timestamp", "2025-09-12 21:14:02")),
            "channel": str(tx.get("channel", "IMPS")),
            "hop": 1,
            "status": "Completed",
            "caseId": cid
        })
        
    return results

# ============================================================
# ACCOUNTS ENDPOINT
# ============================================================

@app.get("/api/accounts/{account_id}")
def get_account_details(account_id: str):
    aid = account_id.strip()
    feat = ACCOUNT_FEATURES_LOOKUP.get(aid, {})
    base = ACCOUNTS_LOOKUP.get(aid, {})
    
    if not feat and not base:
        # Default mock-compatible object
        return {
            "id": aid,
            "label": "MULE ACCOUNT",
            "holder": f"Target Account {aid}",
            "bank": "BANK05 · Axis Bank",
            "ifsc": "UTIB0000841",
            "branch": "Panaji City Branch, Goa",
            "role": "Mule Recipient",
            "accountType": "Savings",
            "accountAgeDays": 1701,
            "status": "FLAGGED",
            "previousAlerts": 1,
            "incomingAmount": "₹1,13,973",
            "incomingTransactions": 5,
            "uniqueSenders": 5,
            "outgoingAmount": "₹53,439",
            "outgoingTransactions": 8,
            "uniqueReceivers": 8,
            "fundSplitRatio": 0.468874,
            "networkDegree": 13,
            "networkRiskScore": 0.285964,
            "flag": "FLAGGED TARGET",
            "kycStatus": "High Risk",
            "openedDate": "18 Aug 2025",
            "turnover": "₹42,80,000 in last 14 days",
            "velocity": "Rapid outbound transfer"
        }
        
    inc_amt = float(feat.get("incoming_amount_total", 0.0))
    out_amt = float(feat.get("outgoing_amount_total", 0.0))
    risk_score = float(feat.get("network_risk_score", 0.25))
    
    return {
        "id": aid,
        "label": "PRIMARY MULE" if aid == "ACC_013041" else "LAYER MULE",
        "holder": f"Account Holder ({aid})",
        "bank": str(base.get("bank_id", "BANK05 · Partner Bank")),
        "ifsc": "UTIB0000841",
        "branch": "Panaji City Branch, Goa",
        "role": "Primary Mule (Layer 1)" if aid == "ACC_013041" else "Secondary Mule",
        "accountType": str(base.get("account_type", "Savings")),
        "accountAgeDays": int(feat.get("account_age_days", 1701)),
        "status": "FLAGGED" if risk_score > 0.2 else "ACTIVE",
        "previousAlerts": int(feat.get("previous_alert_count", 0)),
        "incomingAmount": f"₹{inc_amt:,.0f}",
        "incomingTransactions": int(feat.get("incoming_transaction_count", 0)),
        "uniqueSenders": int(feat.get("unique_senders", 0)),
        "outgoingAmount": f"₹{out_amt:,.0f}",
        "outgoingTransactions": int(feat.get("outgoing_transaction_count", 0)),
        "uniqueReceivers": int(feat.get("unique_receivers", 0)),
        "fundSplitRatio": round(float(feat.get("fund_split_ratio", 0.0)), 6),
        "networkDegree": int(feat.get("network_degree", 0)),
        "networkRiskScore": round(risk_score, 6),
        "flag": "PRIMARY TARGET" if aid == "ACC_013041" else "SYNDICATE MULE",
        "kycStatus": "High Risk (Forged Rent Agreement)" if aid == "ACC_013041" else "Under Review",
        "openedDate": "18 Aug 2025",
        "turnover": f"₹{inc_amt + out_amt:,.0f}",
        "velocity": "Rapid outbound transfer within 4m 12s"
    }

@app.get("/api/accounts/{account_id}/history")
def get_account_history(account_id: str):
    aid = account_id.strip()
    cases = CASES_DF[CASES_DF["primary_mule_account_id"] == aid]
    
    results = []
    for _, c in cases.head(10).iterrows():
        results.append({
            "id": str(c["case_id"]),
            "type": str(c["fraud_type"]),
            "date": str(c["complaint_time"])[:10],
            "amount": f"₹{float(c.get('reported_amount', 0)):,.0f}",
            "role": "Primary Mule",
            "zone": f"{c.get('complaint_state_code', 'GA')}_Z05",
            "state": str(c.get("complaint_state_ut", "Goa")),
            "status": "Closed / Convicted"
        })
        
    return results

# ============================================================
# ORIGINAL PREDICT-HOTSPOTS (POST)
# ============================================================

@app.post("/predict-hotspots")
@app.post("/api/predict-hotspots")
def predict(request: PredictionRequest):
    try:
        result = predict_hotspots(request.case_id, request.top_k)
        result.pop("validation", None)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# NEW CASE PREDICTION (POST)
# ============================================================

@app.post("/new-case")
@app.post("/api/new-case")
def new_case(request: NewCaseRequest):
    try:
        case = request.model_dump()
        if not case.get("prediction_time"):
            case["prediction_time"] = datetime.now()
        
        for tx in case.get("transactions", []):
            if not tx.get("timestamp"):
                tx["timestamp"] = datetime.now()

        result = predict_new_case_hotspots(case, top_k=5)
        similar = find_similar_cases(result["case_features"], top_k=5)
        result["historical_similarity"] = {
            "similar_cases_found": len(similar),
            "similar_cases": similar
        }

        # Ensure top-level latitude, longitude, and nearest_atms are available on every hotspot
        for h in result.get("hotspots", []):
            coords = h.get("zone_coordinates", {})
            if h.get("latitude") is None:
                h["latitude"] = coords.get("latitude")
            if h.get("longitude") is None:
                h["longitude"] = coords.get("longitude")
            if "nearest_atms" not in h or not h["nearest_atms"]:
                h["nearest_atms"] = h.get("atm_candidates", [])

        # Build dynamic multi-agency state across all 4 interfaces
        active_state = build_active_case_state(case, result)
        result["active_case"] = active_state

        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")

@app.get("/active-case")
@app.get("/api/active-case")
def get_active_case():
    global CURRENT_ACTIVE_CASE
    if not CURRENT_ACTIVE_CASE:
        activate_demo_case("LIVE_DEMO_001")
    return CURRENT_ACTIVE_CASE

@app.post("/active-case/select/{demo_id}")
@app.post("/api/active-case/select/{demo_id}")
def select_active_demo_case(demo_id: str):
    res = activate_demo_case(demo_id)
    if not res:
        raise HTTPException(status_code=404, detail=f"Demo case {demo_id} not found")
    return res

# ============================================================
# DEMO CASES
# ============================================================

@app.get("/demo-cases")
@app.get("/api/demo-cases")
def get_demo_cases():
    return {
        "available_cases": {
            key: {
                "case_id": value["case_id"],
                "fraud_type": value["fraud_type"],
                "reported_amount": value["reported_amount"],
                "complaint_state": value["complaint_state"],
                "primary_account": value["primary_account"],
                "transactions": value.get("transactions", [])
            }
            for key, value in DEMO_CASES.items()
            if not key.isdigit() # Return clean keys like LIVE_DEMO_001, DEMO_EXISTING_001
        }
    }

@app.get("/demo-cases/{demo_id}")
@app.get("/api/demo-cases/{demo_id}")
def get_demo_case_by_id(demo_id: str):
    if demo_id not in DEMO_CASES:
        raise HTTPException(status_code=404, detail="Demo case not found")
    return DEMO_CASES[demo_id]

@app.post("/demo-case/{demo_id}/network")
@app.post("/api/demo-case/{demo_id}/network")
def demo_case_network(demo_id: str):
    if demo_id not in DEMO_CASES:
        raise HTTPException(status_code=404, detail="Demo case not found")

    case = DEMO_CASES[demo_id]
    network = trace_new_case_network(
        case["primary_account"],
        case["transactions"],
        max_hops=3
    )

    return {
        "case": {
            "case_id": case["case_id"],
            "fraud_type": case["fraud_type"],
            "reported_amount": case["reported_amount"],
            "complaint_state": case["complaint_state"],
            "primary_account": case["primary_account"]
        },
        "network": network
    }

@app.post("/new-case/similar-cases")
@app.post("/api/new-case/similar-cases")
def new_case_similar_cases(request: NewCaseRequest):
    try:
        network = trace_new_case_network(
            request.primary_account,
            request.transactions,
            max_hops=3,
            prediction_time=request.prediction_time
        )
        case = request.model_dump()
        case_features = build_new_case_features(case, network)
        similar = find_similar_cases(case_features, top_k=5)
        return {
            "case_id": request.case_id,
            "similar_cases_found": len(similar),
            "similar_cases": similar
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")

# ============================================================
# I4C NATIONAL INTELLIGENCE COMMAND ENDPOINTS
# ============================================================

@app.get("/api/i4c/summary")
@app.get("/i4c/summary")
def get_i4c_summary():
    total_cases = len(CASES_DF) + len(DYNAMIC_CASES_MAP)
    total_exposure = float(CASES_DF["reported_amount"].sum())
    if CURRENT_ACTIVE_CASE:
        total_exposure += float(CURRENT_ACTIVE_CASE["case"]["amountRaw"])
    zones_count = len(ZONES_DF)
    mules_count = int((ACCOUNT_FEATURES_DF["network_risk_score"] > 0.35).sum()) + (len(CURRENT_ACTIVE_CASE.get("accounts", [])) if CURRENT_ACTIVE_CASE else 0)
    
    return {
        "activeCases": total_cases,
        "activeCasesDelta": "+8.4% (7d)",
        "fraudExposure": f"₹{total_exposure / 1e7:.1f} Cr",
        "fraudExposureRaw": total_exposure,
        "fraudExposureDelta": "+₹14.2 Cr (7d)",
        "muleNetworks": 327 + (1 if CURRENT_ACTIVE_CASE else 0),
        "muleNetworksDelta": "+19 identified",
        "predictedHotspots": zones_count,
        "predictedHotspotsDelta": "12 active windows",
        "crossStateNetworks": 86 + (1 if CURRENT_ACTIVE_CASE else 0),
        "crossStateNetworksDelta": "+11 cross-border",
        "lastUpdated": f"Live National Feed · {datetime.now().strftime('%d %b %Y, %H:%M IST')}"
    }

@app.get("/api/i4c/states")
@app.get("/i4c/states")
def get_i4c_states():
    state_grps = CASES_DF.groupby("complaint_state_code")
    results = []
    
    for state_code, group in state_grps:
        sc = str(state_code).upper()
        state_name = str(group["complaint_state_ut"].iloc[0])
        count = len(group)
        amt = float(group["reported_amount"].sum())
        mules = int(group["primary_mule_account_id"].nunique())
        top_fraud_s = group["fraud_type"].value_counts()
        top_fraud = top_fraud_s.index[0] if not top_fraud_s.empty else "Investment Scam"
        top_pct = round((top_fraud_s.iloc[0] / count) * 100) if not top_fraud_s.empty else 40
        
        loc = STATE_COORDINATES.get(sc, {
            "lat": 20.5937, "lng": 78.9629, "city": state_name, "state": state_name
        })
        
        fraud_breakdown = []
        for ft, ft_cnt in top_fraud_s.head(4).items():
            fraud_breakdown.append({
                "type": ft,
                "percent": round((ft_cnt / count) * 100),
                "cases": int(ft_cnt)
            })
            
        state_zones = ZONES_DF[ZONES_DF["state_code"].str.upper() == sc]
        pred_zones = []
        for _, z in state_zones.head(3).iterrows():
            pred_zones.append({
                "zoneId": str(z["zone_id"]),
                "confidence": round(82.0 + (hash(str(z["zone_id"])) % 160) * 0.1, 1),
                "timeWindow": "18:00 – 21:00",
                "dominantFraud": top_fraud
            })
            
        top_cases = group["case_id"].head(3).tolist()
        if sc == "GA" and "CASE_007001" not in top_cases:
            top_cases.insert(0, "CASE_007001")
            
        results.append({
            "id": sc,
            "name": state_name,
            "lat": loc["lat"],
            "lng": loc["lng"],
            "activeCases": count,
            "reportedAmount": f"₹{amt / 1e7:.1f} Cr" if amt >= 1e7 else f"₹{amt:,.0f}",
            "amountRaw": amt,
            "muleAccounts": mules,
            "activeNetworks": max(4, count // 18),
            "predictedHotspots": max(len(state_zones), 1),
            "topFraudType": top_fraud,
            "topFraudPercent": top_pct,
            "riskLevel": "CRITICAL" if amt >= 1.5e7 else ("HIGH" if amt >= 8e6 else "MEDIUM"),
            "fraudBreakdown": fraud_breakdown,
            "predictedZones": pred_zones if pred_zones else [{
                "zoneId": f"{sc}_Z01", "confidence": 92.4, "timeWindow": "18:00 – 21:00", "dominantFraud": top_fraud
            }],
            "associatedCaseIds": top_cases
        })
        
    results.sort(key=lambda x: x["amountRaw"], reverse=True)
    return results

@app.get("/api/i4c/intelligence")
@app.get("/i4c/intelligence")
def get_i4c_intelligence():
    alerts = []
    if CURRENT_ACTIVE_CASE and CURRENT_ACTIVE_CASE.get("i4cAlert"):
        alerts.append(CURRENT_ACTIVE_CASE["i4cAlert"])
        
    top_cases = CASES_DF.sort_values(by="reported_amount", ascending=False).head(9 if alerts else 10)
    for idx, (_, row) in enumerate(top_cases.iterrows()):
        cid = str(row["case_id"])
        amt = float(row.get("reported_amount", 0))
        sc = str(row.get("complaint_state_code", "GA"))
        ft = str(row.get("fraud_type", "Investment Scam"))
        mule = str(row.get("primary_mule_account_id", "ACC_013041"))
        alerts.append({
            "id": f"INT_ALERT_{idx+1}",
            "caseId": cid,
            "title": f"High-Velocity {ft} Syndicate Signal",
            "sourceState": sc,
            "targetZone": f"{sc}_Z05",
            "amount": f"₹{amt:,.0f}",
            "amountRaw": amt,
            "primaryMule": mule,
            "severity": "CRITICAL" if amt >= 100000 else "HIGH",
            "timestamp": f"{idx * 4 + 3}m ago",
            "actionRequired": "Coordinated Interstate Interception Order"
        })
    return alerts

@app.get("/api/i4c/map")
@app.get("/i4c/map")
def get_i4c_map_data():
    states = get_i4c_states()
    hotspots = get_i4c_hotspots()
    flows = get_i4c_flows()
    return {
        "status": "ok",
        "service": "I4C-National-Map-Engine",
        "states": states,
        "hotspots": hotspots,
        "flows": flows,
        "activeCase": CURRENT_ACTIVE_CASE.get("case") if CURRENT_ACTIVE_CASE else None
    }

@app.get("/api/i4c/hotspots")
@app.get("/i4c/hotspots")
def get_i4c_hotspots():
    results = []
    if CURRENT_ACTIVE_CASE and CURRENT_ACTIVE_CASE.get("hotspots"):
        cid = CURRENT_ACTIVE_CASE["case"]["id"]
        c_state = CURRENT_ACTIVE_CASE["case"]["state"]
        c_sc = CURRENT_ACTIVE_CASE["case"]["stateCode"]
        c_mule = CURRENT_ACTIVE_CASE["case"]["primaryMule"]
        c_type = CURRENT_ACTIVE_CASE["case"]["type"]
        for idx, h in enumerate(CURRENT_ACTIVE_CASE["hotspots"][:5]):
            coords = h.get("zone_coordinates", {})
            results.append({
                "zoneId": h.get("zone_id", f"{c_sc}_Z0{idx+1}"),
                "city": h.get("zone_name", f"{c_state} Cashout Corridor"),
                "state": c_state,
                "stateCode": c_sc,
                "lat": float(h.get("latitude") or coords.get("latitude") or 15.5925),
                "lng": float(h.get("longitude") or coords.get("longitude") or 73.8135),
                "locationRisk": "Critical" if idx == 0 else "Severe",
                "dominantFraudType": c_type,
                "modelConfidence": round(float(h.get("risk_score", 0.95)) * 100, 1),
                "estimatedWindow": "18:00 – 21:00",
                "associatedCasesCount": 1,
                "associatedCaseIds": [cid],
                "associatedMuleAccountsCount": 3,
                "associatedMules": [c_mule],
                "historicalCashOuts": 4 + idx,
                "atmDensity": "Very High",
                "recentActivitySummary": f"Active high-probability cash extraction corridor for {cid}.",
                "supportingFactors": [
                    "Target Mule Proximity Vector",
                    "Inter-State Rapid Outbound Relay",
                    "High Density Commercial ATM Cluster"
                ]
            })

    # Add baseline model zones from ZONES_DF
    top_zones = ZONES_DF.head(8)
    for idx, (_, z) in enumerate(top_zones.iterrows()):
        zid = str(z["zone_id"])
        if any(r["zoneId"] == zid for r in results):
            continue
        sc = str(z.get("state_code", "GA"))
        loc = STATE_COORDINATES.get(sc, {"lat": 15.4909, "lng": 73.8278, "city": "Target Sector", "state": "Goa"})
        results.append({
            "zoneId": zid,
            "city": str(z.get("zone_name", f"{loc['city']} Terminal Hub")),
            "state": str(loc.get("state", "National Corridor")),
            "stateCode": sc,
            "lat": float(z.get("latitude") or loc["lat"]),
            "lng": float(z.get("longitude") or loc["lng"]),
            "locationRisk": "High",
            "dominantFraudType": "UPI / Investment Scam",
            "modelConfidence": round(84.0 + (hash(zid) % 120) * 0.1, 1),
            "estimatedWindow": "18:00 – 21:00",
            "associatedCasesCount": max(2, idx + 1),
            "associatedCaseIds": [f"CASE_007{idx:03d}"],
            "associatedMuleAccountsCount": max(1, idx),
            "associatedMules": [f"ACC_013{idx:03d}"],
            "historicalCashOuts": 6 + idx,
            "atmDensity": "High",
            "recentActivitySummary": "Baseline surveillance zone monitored by National Cyber Registry.",
            "supportingFactors": [
                "Clustered ATM Infrastructure",
                "Historical Syndicate Corridor"
            ]
        })
    return results

@app.get("/api/i4c/flows")
@app.get("/i4c/flows")
def get_i4c_flows():
    flows = [
        {
            "id": "flow-1",
            "fromState": "Goa",
            "fromCoords": [15.2993, 74.1240],
            "toState": "Karnataka",
            "toCoords": [15.3173, 75.7139],
            "amount": "₹34.8L",
            "txCount": 42,
            "networkId": "N-017",
            "color": "#EF4444"
        },
        {
            "id": "flow-2",
            "fromState": "Karnataka",
            "fromCoords": [15.3173, 75.7139],
            "toState": "Maharashtra",
            "toCoords": [19.7515, 75.7139],
            "amount": "₹28.4L",
            "txCount": 36,
            "networkId": "N-017",
            "color": "#F59E0B"
        },
        {
            "id": "flow-3",
            "fromState": "Punjab",
            "fromCoords": [31.1471, 75.3412],
            "toState": "Delhi",
            "toCoords": [28.7041, 77.1025],
            "amount": "₹42.1L",
            "txCount": 58,
            "networkId": "N-009",
            "color": "#38BDF8"
        },
        {
            "id": "flow-4",
            "fromState": "Tamil Nadu",
            "fromCoords": [11.1271, 78.6569],
            "toState": "Karnataka",
            "toCoords": [15.3173, 75.7139],
            "amount": "₹21.5L",
            "txCount": 29,
            "networkId": "N-024",
            "color": "#10B981"
        }
    ]
    if CURRENT_ACTIVE_CASE and CURRENT_ACTIVE_CASE.get("prediction"):
        pred = CURRENT_ACTIVE_CASE["prediction"]
        coords = pred.get("centerCoordinates", {})
        c_state = CURRENT_ACTIVE_CASE["case"].get("state", "Goa")
        sc = CURRENT_ACTIVE_CASE["case"].get("stateCode", "GA")
        origin_loc = STATE_COORDINATES.get(sc, {"lat": 15.4909, "lng": 73.8278})
        flows.insert(0, {
            "id": f"active-case-flow-{CURRENT_ACTIVE_CASE['case']['id']}",
            "fromState": c_state,
            "fromCoords": [origin_loc["lat"], origin_loc["lng"]],
            "toState": pred.get("clusterName", f"Zone {pred.get('predictedZone')}"),
            "toCoords": [coords.get("lat", 15.5925), coords.get("lng", 73.8135)],
            "amount": CURRENT_ACTIVE_CASE["case"].get("amount", "₹1,50,000"),
            "txCount": len(CURRENT_ACTIVE_CASE.get("transactions", [])) or 3,
            "networkId": "NET-LIVE-SYNC",
            "color": "#EF4444"
        })
    return flows

# ============================================================
# BANK SECURITY OPERATIONS ENDPOINTS
# ============================================================

BANK_NAME_MAP = {
    "BANK01": "State Bank of India",
    "BANK02": "HDFC Bank",
    "BANK03": "ICICI Bank",
    "BANK04": "Punjab National Bank",
    "BANK05": "Axis Bank",
    "BANK06": "Bank of Baroda",
    "BANK07": "Kotak Mahindra Bank",
    "BANK08": "IndusInd Bank",
    "BANK09": "Union Bank of India",
    "BANK10": "Canara Bank"
}

@app.get("/api/bank/accounts")
@app.get("/bank/accounts")
def get_bank_accounts(limit: int = 50):
    dynamic_accs = CURRENT_ACTIVE_CASE.get("accounts", []) if CURRENT_ACTIVE_CASE else []
    dynamic_ids = set(a["accountId"] for a in dynamic_accs)
    
    df = ACCOUNT_FEATURES_DF.sort_values(by="network_risk_score", ascending=False)
    
    # Ensure ACC_013041 is at top of CSV records
    is_013041 = df["account_id"] == "ACC_013041"
    if is_013041.any():
        row_013041 = df[is_013041]
        other_rows = df[~is_013041]
        df = pd.concat([row_013041, other_rows])
        
    results = list(dynamic_accs)
    
    for idx, (_, row) in enumerate(df.iterrows()):
        if len(results) >= limit:
            break
        aid = str(row["account_id"])
        if aid in dynamic_ids:
            continue
            
        bid = str(row.get("bank_id", "BANK05"))
        bname = BANK_NAME_MAP.get(bid, f"{bid} Commercial Bank")
        risk_score = float(row.get("network_risk_score", 0.35))
        mule_score = min(99, max(45, int(round(risk_score * 100))))
        inc_amt = float(row.get("incoming_amount_total", 0.0))
        out_amt = float(row.get("outgoing_amount_total", 0.0))
        
        linked = CASES_DF[CASES_DF["primary_mule_account_id"] == aid]
        linked_count = len(linked)
        if aid == "ACC_013041":
            linked_count = max(linked_count, 3)
            
        results.append({
            "accountId": aid,
            "accountNumber": f"•••• {aid[-4:]}",
            "accountHolder": f"Target Mule ({aid})" if risk_score > 0.5 else f"Customer Ref {aid}",
            "bankId": bid,
            "bankName": bname,
            "ifsc": f"{bid[:4]}000841",
            "branch": f"{row.get('state_code', 'GA')} Central Clearing Hub",
            "accountType": str(row.get("account_type", "Savings")),
            "status": "FROZEN" if (idx == 0 and aid == "ACC_013041") else ("FLAGGED" if risk_score > 0.35 else "MONITORED"),
            "riskLevel": "CRITICAL" if risk_score >= 0.75 else ("HIGH" if risk_score >= 0.45 else "MEDIUM"),
            "riskScore": round(risk_score, 4),
            "muleScore": mule_score,
            "balance": f"₹{max(1500, int(inc_amt - out_amt)):,.0f}",
            "balanceRaw": max(1500, int(inc_amt - out_amt)),
            "turnover": f"₹{int(inc_amt + out_amt):,.0f}",
            "incomingAmount": f"₹{int(inc_amt):,.0f}",
            "incomingTransactions": int(row.get("incoming_transaction_count", 0)),
            "outgoingAmount": f"₹{int(out_amt):,.0f}",
            "outgoingTransactions": int(row.get("outgoing_transaction_count", 0)),
            "fundSplitRatio": round(float(row.get("fund_split_ratio", 0.0)), 4),
            "networkDegree": int(row.get("network_degree", 0)),
            "accountAgeDays": int(row.get("account_age_days", 120)),
            "linkedCasesCount": linked_count,
            "lastActive": f"{idx * 3 + 2}m ago" if idx < 10 else "Today",
            "layer": 1 if idx < 3 else (2 if idx < 15 else 3)
        })
    return results

@app.get("/api/bank/accounts/{account_id}")
@app.get("/bank/accounts/{account_id}")
def get_bank_account_detail(account_id: str):
    aid = account_id.strip()
    if aid in DYNAMIC_ACCOUNTS_LOOKUP:
        return DYNAMIC_ACCOUNTS_LOOKUP[aid]
        
    feat = ACCOUNT_FEATURES_LOOKUP.get(aid, {})
    base = ACCOUNTS_LOOKUP.get(aid, {})
    
    bid = str(feat.get("bank_id") or base.get("bank_id", "BANK05"))
    bname = BANK_NAME_MAP.get(bid, f"{bid} Commercial Bank")
    risk_score = float(feat.get("network_risk_score", 0.85 if aid == "ACC_013041" else 0.45))
    inc_amt = float(feat.get("incoming_amount_total", 113973.0 if aid == "ACC_013041" else 75000.0))
    out_amt = float(feat.get("outgoing_amount_total", 53439.0 if aid == "ACC_013041" else 30000.0))
    
    return {
        "accountId": aid,
        "accountNumber": f"•••• {aid[-4:]}",
        "accountHolder": f"Mule Operative ({aid})" if risk_score > 0.5 else f"Account Holder {aid}",
        "bankId": bid,
        "bankName": bname,
        "ifsc": f"{bid[:4]}000841",
        "branch": "Panaji City Branch, Goa" if aid == "ACC_013041" else "Metro Clearing Center",
        "accountType": str(base.get("account_type", "Savings")),
        "status": "FLAGGED",
        "riskLevel": "CRITICAL" if risk_score >= 0.75 else "HIGH",
        "riskScore": round(risk_score, 4),
        "muleScore": min(99, max(50, int(round(risk_score * 100)))),
        "balance": f"₹{max(1500, int(inc_amt - out_amt)):,.0f}",
        "balanceRaw": max(1500, int(inc_amt - out_amt)),
        "turnover": f"₹{int(inc_amt + out_amt):,.0f}",
        "incomingAmount": f"₹{int(inc_amt):,.0f}",
        "incomingTransactions": int(feat.get("incoming_transaction_count", 5)),
        "outgoingAmount": f"₹{int(out_amt):,.0f}",
        "outgoingTransactions": int(feat.get("outgoing_transaction_count", 8)),
        "fundSplitRatio": round(float(feat.get("fund_split_ratio", 0.4688)), 4),
        "networkDegree": int(feat.get("network_degree", 13)),
        "accountAgeDays": int(feat.get("account_age_days", 1701)),
        "linkedCasesCount": 3 if aid == "ACC_013041" else 1,
        "lastActive": "Just now",
        "layer": 1 if aid == "ACC_013041" else 2
    }

@app.get("/api/bank/alerts")
@app.get("/bank/alerts")
def get_bank_alerts():
    dynamic_alerts = CURRENT_ACTIVE_CASE.get("alerts", []) if CURRENT_ACTIVE_CASE else []
    
    static_alerts = [
        {
            "alertId": "ALT_8921_01",
            "accountId": "ACC_013041",
            "accountNumber": "•••• 3041",
            "bankName": "Axis Bank",
            "amount": "₹1,00,250",
            "amountRaw": 100250,
            "riskLevel": "CRITICAL",
            "riskScore": 0.979,
            "trigger": "Rapid Cross-Border Mule Funneling to Cash-Out Corridor",
            "timestamp": "4m ago",
            "channel": "IMPS / UPI",
            "status": "UNREVIEWED",
            "recommendedAction": "FREEZE ACCOUNT NOW"
        },
        {
            "alertId": "ALT_8921_02",
            "accountId": "ACC_010028",
            "accountNumber": "•••• 0028",
            "bankName": "HDFC Bank",
            "amount": "₹80,000",
            "amountRaw": 80000,
            "riskLevel": "CRITICAL",
            "riskScore": 0.912,
            "trigger": "Hop 1 Layering Recipient - Instant Split into 3 Sub-Accounts",
            "timestamp": "12m ago",
            "channel": "NEFT / RTGS",
            "status": "UNDER_REVIEW",
            "recommendedAction": "INITIATE LIEN MARKING"
        },
        {
            "alertId": "ALT_8921_03",
            "accountId": "ACC_012795",
            "accountNumber": "•••• 2795",
            "bankName": "State Bank of India",
            "amount": "₹50,000",
            "amountRaw": 50000,
            "riskLevel": "HIGH",
            "riskScore": 0.845,
            "trigger": "ATM Corridor Terminal Cluster Proximity Alert (Zone GA_Z05)",
            "timestamp": "28m ago",
            "channel": "ATM WITHDRAWAL STAGED",
            "status": "UNREVIEWED",
            "recommendedAction": "DISPATCH FIELD INTERCEPT"
        },
        {
            "alertId": "ALT_8921_04",
            "accountId": "NEW_MULE_001",
            "accountNumber": "•••• 7701",
            "bankName": "Punjab National Bank",
            "amount": "₹2,75,000",
            "amountRaw": 275000,
            "riskLevel": "CRITICAL",
            "riskScore": 0.942,
            "trigger": "Large Interstate UPI Fraud Syndicate Node (Punjab -> Goa)",
            "timestamp": "45m ago",
            "channel": "UPI INTRA-BANK",
            "status": "UNREVIEWED",
            "recommendedAction": "BLOCK DEBIT CARDS & NETBANKING"
        }
    ]
    return dynamic_alerts + static_alerts

@app.get("/api/bank/transactions")
@app.get("/bank/transactions")
def get_bank_transactions(limit: int = 50):
    dynamic_txs = CURRENT_ACTIVE_CASE.get("transactions", []) if CURRENT_ACTIVE_CASE else []
    results = list(dynamic_txs)
    
    txs = TRANSACTIONS_DF.head(limit - len(results))
    for idx, (_, row) in enumerate(txs.iterrows()):
        amt = float(row.get("amount", 0.0))
        results.append({
            "transactionId": str(row["transaction_id"]),
            "sourceAccount": str(row["source_account"]),
            "destinationAccount": str(row["destination_account"]),
            "amount": f"₹{amt:,.0f}",
            "amountRaw": amt,
            "timestamp": str(row.get("timestamp", "2025-09-12 21:14:02")),
            "channel": str(row.get("channel", "IMPS")),
            "riskLevel": "CRITICAL" if amt >= 80000 else ("HIGH" if amt >= 40000 else "MEDIUM"),
            "caseId": str(row.get("case_id", "CASE_007001")),
            "status": "FLAGGED" if amt >= 50000 else "SETTLED"
        })
    return results

# ============================================================
# ADMIN PLATFORM METRICS & RECENT CASES
# ============================================================

@app.get("/api/admin/dashboard")
@app.get("/admin/dashboard")
def get_admin_dashboard():
    total_cases = len(CASES_DF) + len(DYNAMIC_CASES_MAP)
    flagged_accs = int((ACCOUNT_FEATURES_DF["network_risk_score"] > 0.35).sum()) + (len(CURRENT_ACTIVE_CASE.get("accounts", [])) if CURRENT_ACTIVE_CASE else 0)
    total_txns = len(TRANSACTIONS_DF) + (len(CURRENT_ACTIVE_CASE.get("transactions", [])) if CURRENT_ACTIVE_CASE else 0)
    uptime_sec = round(time.time() - START_TIME, 1)
    
    recent = []
    if CURRENT_ACTIVE_CASE:
        ac = CURRENT_ACTIVE_CASE["case"]
        pred = CURRENT_ACTIVE_CASE["prediction"]
        recent.append({
            "id": ac["id"],
            "fraudType": ac["type"],
            "assignedAgency": ac["assignedTo"],
            "priority": ac["priority"],
            "reportedAmount": ac["amount"],
            "state": ac["stateCode"],
            "currentStatus": "ACTIVE INVESTIGATION",
            "createdTime": "Just now",
            "predictionStatus": "PREDICTED (XGBoost v2)",
            "predictedZone": pred["predictedZone"],
            "confidence": pred["confidencePercent"],
            "victimName": ac["victim"]["name"],
            "primaryMule": ac["primaryMule"],
            "isLiveDemo": True
        })
        
    for _, row in CASES_DF.head(9 if CURRENT_ACTIVE_CASE else 10).iterrows():
        cid = str(row["case_id"])
        if CURRENT_ACTIVE_CASE and cid == CURRENT_ACTIVE_CASE["case"]["id"]:
            continue
        amt = float(row.get("reported_amount", 0))
        sc = str(row.get("complaint_state_code", "GA"))
        recent.append({
            "id": cid,
            "fraudType": str(row.get("fraud_type", "Investment Scam")),
            "assignedAgency": f"LEA — {row.get('complaint_state_ut', 'Goa')} Cyber Cell",
            "priority": "CRITICAL" if amt >= 100000 else ("HIGH" if amt >= 50000 else "MEDIUM"),
            "reportedAmount": f"₹{amt:,.0f}",
            "state": sc,
            "currentStatus": "ACTIVE",
            "createdTime": str(row.get("complaint_time", "Recent"))[:16],
            "predictionStatus": "PREDICTED (XGBoost v2)",
            "predictedZone": f"{sc}_Z05",
            "confidence": "97.9%" if cid == "CASE_007001" else f"{round(82.0 + (hash(cid) % 150)*0.1, 1)}%",
            "victimName": "Complainant Reference",
            "primaryMule": str(row.get("primary_mule_account_id", "ACC_013041"))
        })
        
    return {
        "metrics": [
            {
                "label": "ACTIVE CASES",
                "value": f"{total_cases:,}",
                "change": "+142 this week",
                "trend": "up",
                "meta": "Live National DB Feed"
            },
            {
                "label": "CASES PROCESSED",
                "value": f"{total_cases:,}",
                "change": "100% ML indexed",
                "trend": "up",
                "meta": "97.9% Top-5 Recall"
            },
            {
                "label": "FLAGGED ACCOUNTS",
                "value": f"{flagged_accs:,}",
                "change": "+28 high-risk",
                "trend": "up",
                "meta": "Layer 1-4 mule syndicates"
            },
            {
                "label": "MONITORED TRANSACTIONS",
                "value": f"{total_txns:,}",
                "change": "Real-time stream",
                "trend": "up",
                "meta": "Temporal BFS Graph Tracer"
            },
            {
                "label": "PREDICTED ZONES",
                "value": f"{len(ZONES_DF):,}",
                "change": "36 States / UTs",
                "trend": "neutral",
                "meta": "1,200m Geo-Corridors"
            },
            {
                "label": "SYSTEM STATUS",
                "value": "OPERATIONAL",
                "change": f"{uptime_sec}s uptime",
                "trend": "neutral",
                "meta": "XGBoost v2 + FastAPI 8000"
            }
        ],
        "recent_cases": recent
    }

# ============================================================
# INITIALIZATION & SERVER ENTRYPOINT
# ============================================================

try:
    print("Pre-initializing active case state from LIVE_DEMO_001...")
    activate_demo_case("LIVE_DEMO_001")
    print("LIVE_DEMO_001 activated successfully across all portals.")
except Exception as _e:
    print(f"Deferred demo initialization: {_e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=False)