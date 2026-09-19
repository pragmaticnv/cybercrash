# CYBERCRASH — Multi-Agency Cybercrime Intelligence Platform

> **TRACE · PREDICT · PREVENT**  
> Law Enforcement Agency (LEA) Digital Forensic Investigation Workstation for Mule-Account & Cyberfraud Analysis.

---

## 🛡️ Architecture & Core Investigation Flow

CYBERCRASH enforces a strict digital forensic investigation workflow:

```
LOGIN GATEWAY
      │
      ▼
LEA CASE COMMAND (/#/cases)
      │  • Clean intake table (No map, no money-flow graph)
      │  • Active Case queue, Search & Operational stats
      │
      ▼ (Officer selects case, e.g. CASE_007001)
CASE INVESTIGATION WORKSPACE (/#/investigation/:caseId)
      ├─ Top Case Bar (ID, Fraud Type, Loss, Priority, Primary Mule, 4 Investigation Modes)
      ├─ Map Intelligence (React-Leaflet, Complaint origin, Predicted Cash-out Zone GA_Z05 / 97.9%, ATM clusters)
      ├─ Case Intelligence Dossier (Summary, Primary Mule Telemetry, AI Prediction, Why this Location Evidence Bars, Historical Cases)
      └─ Money Flow (React Flow, compact metrics, Victim → Mule → Connected Accounts, clickable nodes & edges)
```

---

## ⚡ Tech Stack

- **Framework:** React 19 + TypeScript 5.7 + Vite 6
- **Routing:** React Router 7 (`HashRouter`)
- **State Management:** Zustand
- **Geographic Mapping:** Leaflet + React-Leaflet
- **Network / Money-Flow Graph:** React Flow (`@xyflow/react`)
- **Styling & Theme:** Tailwind CSS (Dark Cyber Digital Forensic System)
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Dev Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

### 3. Production Build
```bash
npm run build
```

---

## 🔒 Demo Credentials

- **User ID:** `lea_demo`
- **Password:** *(any string / one-click demo auth)*
- **Direct Workspace Link:** `/#/investigation/CASE_007001`
