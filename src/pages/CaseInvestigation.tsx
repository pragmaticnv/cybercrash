import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Common/Header';
import { ActiveCaseBanner } from '../components/Common/ActiveCaseBanner';
import { CaseHeader } from '../components/Investigation/CaseHeader';
import { CaseIntakeBar, CaseIntakePayload } from '../components/Investigation/CaseIntakeBar';
import { MapInvestigation } from '../components/Map/MapInvestigation';
import { CaseSummary } from '../components/Intelligence/CaseSummary';
import { PrimaryMuleCard } from '../components/Intelligence/PrimaryMuleCard';
import { PredictionCard } from '../components/Intelligence/PredictionCard';
import { PredictionEvidence } from '../components/Intelligence/PredictionEvidence';
import { HistoricalLinksCard } from '../components/Intelligence/HistoricalLinksCard';
import { MoneyFlowGraph } from '../components/MoneyFlow/MoneyFlowGraph';
import { AccountDrawer } from '../components/Drawers/AccountDrawer';
import { TransactionDrawer } from '../components/Drawers/TransactionDrawer';
import { HistoricalCaseModal } from '../components/Drawers/HistoricalCaseModal';
import { TechnicalDetailsDrawer } from '../components/Drawers/TechnicalDetailsDrawer';
import { fetchCaseById } from '../api/cases';
import { fetchPredictionForCase } from '../api/predictions';
import { fetchAccountById } from '../api/accounts';
import { fetchTransactionsForCase } from '../api/transactions';
import { fetchHistoricalCases } from '../api/history';
import { Case, HistoricalCase } from '../types/case';
import { Prediction } from '../types/prediction';
import { Account } from '../types/account';
import { Transaction } from '../types/transaction';
import { useInvestigationStore } from '../store/useInvestigationStore';
import { useActiveCaseStore } from '../store/useActiveCaseStore';

export const CaseInvestigation: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { activeMode, setSelectedCaseId } = useInvestigationStore();
  const { activeCase, prediction: activePrediction, bankTransactions } = useActiveCaseStore();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [primaryMule, setPrimaryMule] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [historicalCases, setHistoricalCases] = useState<HistoricalCase[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic ML Engine & Model State (passed from CaseIntakeBar)
  const [networkData, setNetworkData] = useState<any | null>(null);
  const [allHotspots, setAllHotspots] = useState<any[] | null>(null);
  const [selectedHotspotIndex, setSelectedHotspotIndex] = useState<number>(0);
  const [similarCases, setSimilarCases] = useState<any[] | null>(null);
  const [modelReasoning, setModelReasoning] = useState<any | null>(null);

  useEffect(() => {
    async function loadWorkspace() {
      if (!caseId) return;
      setLoading(true);
      setSelectedCaseId(caseId);

      const isCurrentActive = activeCase && caseId.toUpperCase() === activeCase.id.toUpperCase();

      let cData: Case | null = null;
      let predData: Prediction | null = null;
      let muleData: Account | null = null;
      let txData: Transaction[] = [];
      let histData: HistoricalCase[] = [];

      if (isCurrentActive) {
        cData = activeCase;
        predData = activePrediction;
        muleData = {
          id: activeCase.primaryMule,
          label: 'PRIMARY MULE',
          accountHolder: `Target Mule (${activeCase.primaryMule})`,
          bank: 'Axis Bank',
          ifsc: 'UTIB0000841',
          branch: `${activeCase.state} Central Clearing Hub`,
          role: 'Primary Mule (Layer 1)',
          accountType: 'Savings',
          accountAgeDays: 45,
          status: 'FLAGGED',
          previousAlerts: 1,
          turnover: activeCase.amount,
          incomingAmount: activeCase.amount,
          incomingTransactions: 1,
          outgoingAmount: activeCase.downstreamAmount,
          outgoingTransactions: activeCase.transactionsTraced,
          fundSplitRatio: 0.85,
          networkDegree: activeCase.networkAccounts,
          networkRiskScore: activeCase.riskScore,
          muleScore: Math.min(99, Math.round(activeCase.riskScore * 100)),
          riskLevel: 'CRITICAL',
          flag: 'TARGET MULE',
          totalLayeredAmount: activeCase.amount,
          rapidExfiltration: true,
          velocityRisk: 'Critical Outbound Dispersion'
        } as any;

        txData = (bankTransactions || []).map((t: any) => ({
          id: t.id || t.transactionId,
          sourceId: t.sourceAccount,
          targetId: t.destinationAccount,
          sourceLabel: t.sourceAccount,
          targetLabel: t.destinationAccount,
          amount: typeof t.amount === 'number' ? `₹${t.amount.toLocaleString()}` : (t.amount || '₹50,000'),
          amountRaw: typeof t.amount === 'number' ? t.amount : (t.amountRaw || 50000),
          timestamp: t.timestamp || 'Just now',
          channel: t.channel || 'IMPS',
          direction: 'outbound' as const,
          hopLevel: `Hop ${t.hop || 1}`,
          status: 'PENDING' as const,
          caseId: activeCase.id
        }));

        histData = await fetchHistoricalCases(activeCase.primaryMule);
      } else {
        const [c, p, m, t, h] = await Promise.all([
          fetchCaseById(caseId),
          fetchPredictionForCase(caseId),
          fetchAccountById('ACC_013041'),
          fetchTransactionsForCase(caseId),
          fetchHistoricalCases('ACC_013041'),
        ]);
        cData = c;
        predData = p;
        muleData = m;
        txData = t;
        histData = h;
      }

      if (!cData) {
        navigate('/investigation/CASE_007001', { replace: true });
        return;
      }

      setCaseData(cData);
      setPrediction(predData);
      setPrimaryMule(muleData);
      setTransactions(txData);
      setHistoricalCases(histData);
      setLoading(false);
    }

    loadWorkspace();
  }, [caseId, navigate, setSelectedCaseId, activeCase, activePrediction, bankTransactions]);

  // Handle switching between predicted hotspots (#1 to #5)
  const handleSelectHotspotIndex = (index: number) => {
    setSelectedHotspotIndex(index);
    if (allHotspots && allHotspots[index]) {
      const h = allHotspots[index];
      setModelReasoning(h.model_reasoning || null);

      const lat = Number(h.latitude || h.zone_coordinates?.latitude || 15.5925);
      const lng = Number(h.longitude || h.zone_coordinates?.longitude || 73.8135);

      const dynamicAtms = (h.nearest_atms || []).map((atm: any, i: number) => ({
        id: atm.id || `ATM_${h.zone_id}_${i + 1}`,
        name: atm.name || `${atm.bank || 'SBI'} ATM - ${h.zone_name}`,
        bank: atm.bank || 'National Bank',
        lat: Number(atm.lat || lat + (i % 2 === 0 ? 0.003 : -0.003)),
        lng: Number(atm.lng || lng + (i > 1 ? 0.003 : -0.003)),
        risk: i === 0 ? ('Critical' as const) : ('High' as const),
        status: 'High Surveillance Alert',
        window: 'Active Alert Window',
        cctv: 'CCTV Camera Stream Online'
      }));

      setPrediction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          predictedZone: h.zone_id,
          clusterName: `${h.zone_name} (${h.state_code})`,
          confidencePercent: `${(Number(h.risk_score || 0) * 100).toFixed(1)}%`,
          centerCoordinates: { lat, lng },
          atms: dynamicAtms.length > 0 ? dynamicAtms : prev.atms
        };
      });
    }
  };

  // Called when investigator submits a case for prediction
  const handleAnalyzeStart = () => {
    // Keep current screen intact while processing
  };

  // Called when POST /new-case succeeds with ML predictions
  const handleAnalyzeSuccess = (result: any, casePayload: CaseIntakePayload) => {
    const returnedHotspots = result.hotspots || [];
    setAllHotspots(returnedHotspots);
    setSelectedHotspotIndex(0);
    setNetworkData(result.network || null);
    setSimilarCases(result.historical_similarity?.similar_cases || []);

    const firstHotspot = returnedHotspots[0];
    if (firstHotspot) {
      setModelReasoning(firstHotspot.model_reasoning || null);
      const lat = Number(firstHotspot.latitude || firstHotspot.zone_coordinates?.latitude || 15.5925);
      const lng = Number(firstHotspot.longitude || firstHotspot.zone_coordinates?.longitude || 73.8135);

      const dynamicAtms = (firstHotspot.nearest_atms || []).map((atm: any, i: number) => ({
        id: atm.id || `ATM_${firstHotspot.zone_id}_${i + 1}`,
        name: atm.name || `${atm.bank || 'SBI'} ATM - ${firstHotspot.zone_name}`,
        bank: atm.bank || 'National Bank',
        lat: Number(atm.lat || lat + (i % 2 === 0 ? 0.003 : -0.003)),
        lng: Number(atm.lng || lng + (i > 1 ? 0.003 : -0.003)),
        risk: i === 0 ? ('Critical' as const) : ('High' as const),
        status: 'High Surveillance Alert',
        window: 'Active Alert Window',
        cctv: 'CCTV Camera Stream Online'
      }));

      setPrediction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          predictedZone: firstHotspot.zone_id,
          clusterName: `${firstHotspot.zone_name} (${firstHotspot.state_code})`,
          confidencePercent: `${(Number(firstHotspot.risk_score || 0) * 100).toFixed(1)}%`,
          centerCoordinates: { lat, lng },
          atms: dynamicAtms.length > 0 ? dynamicAtms : prev.atms
        };
      });
    }

    // Update case header & victim info with the new case intake
    setCaseData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        id: casePayload.case_id,
        amount: `₹${Number(casePayload.reported_amount).toLocaleString()}`,
        status: 'ACTIVE INVESTIGATION',
        complaintTime: casePayload.prediction_time
          ? new Date(casePayload.prediction_time).toLocaleString()
          : prev.complaintTime,
        primaryMule: casePayload.primary_account,
        victim: {
          ...prev.victim,
          name: `Complainant (${casePayload.complaint_state})`,
          bank: 'State Clearing Gateway'
        }
      };
    });

    // Update primary mule card with the new primary account
    setPrimaryMule((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        id: casePayload.primary_account,
        accountNumber: `•••• ${casePayload.primary_account.slice(-4) || '9012'}`,
        muleScore: Math.min(99, Math.max(70, Math.round((result.case_features?.network_risk_score || 0.85) * 100))),
        riskLevel: 'CRITICAL',
        totalLayeredAmount: `₹${Number(casePayload.reported_amount).toLocaleString()}`
      };
    });
    // Synchronize to global multi-agency store so I4C, Bank, and Admin immediately update
    useActiveCaseStore.getState().setActiveCaseFromMLResult(casePayload, result);
  };

  const handleAnalyzeError = (errorMsg: string) => {
    console.error('Case analysis failed:', errorMsg);
  };

  // Reset to original active CASE_007001
  const handleResetToCase7001 = async () => {
    setNetworkData(null);
    setAllHotspots(null);
    setSelectedHotspotIndex(0);
    setSimilarCases(null);
    setModelReasoning(null);

    setLoading(true);
    const [cData, predData, muleData, txData, histData] = await Promise.all([
      fetchCaseById('CASE_007001'),
      fetchPredictionForCase('CASE_007001'),
      fetchAccountById('ACC_013041'),
      fetchTransactionsForCase('CASE_007001'),
      fetchHistoricalCases('ACC_013041'),
    ]);

    if (cData) setCaseData(cData);
    if (predData) setPrediction(predData);
    if (muleData) setPrimaryMule(muleData);
    if (txData) setTransactions(txData);
    if (histData) setHistoricalCases(histData);
    setLoading(false);
  };

  if (loading || !caseData || !prediction || !primaryMule) {
    return (
      <div className="min-h-screen bg-[#02060D] text-white flex flex-col font-sans">
        <Header />
        <ActiveCaseBanner />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-mono text-xs text-slate-400 tracking-wider">
            LOADING CASE INVESTIGATION WORKSPACE · {caseId}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02060D] text-white flex flex-col font-sans pb-12">
      {/* 1. Global Header */}
      <Header />

      {/* 1.5 Active Case & Multi-Agency Synchronizer */}
      <ActiveCaseBanner />

      {/* 2. Top Case Bar */}
      <CaseHeader caseData={caseData} />

      {/* 2.5 Demo Case Selector & New Case Intake Bar */}
      <CaseIntakeBar
        onAnalyzeStart={handleAnalyzeStart}
        onAnalyzeSuccess={handleAnalyzeSuccess}
        onAnalyzeError={handleAnalyzeError}
        onResetToCase7001={handleResetToCase7001}
        currentCaseId={caseData.id}
      />

      {/* 3. Main Investigation Workspace */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 lg:px-8 py-5">
        
        {/* VIEW MODE 1: OVERVIEW (Extended Map + Vertical Money Flow directly below) */}
        {activeMode === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left / Center (8 cols): Extended Map View + Vertical Money Flow */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* 1. Extended Map View */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                      GEOSPATIAL THREAT & CASHOUT INTELLIGENCE
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Live Cartographic Correlation · {prediction.predictedZone}
                  </span>
                </div>

                {/* Extended Map View Height (560px) */}
                <div className="h-[560px] w-full">
                  <MapInvestigation prediction={prediction} caseData={caseData} />
                </div>
              </div>

              {/* 2. Vertical Money Flow Network - positioned just below the map view! */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                      MONEY-FLOW NETWORK & ACCOUNT TOPOLOGY
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Branching forensic money trail · Click nodes or edges to audit
                  </span>
                </div>

                {/* React Flow Canvas with Vertical Layout */}
                <MoneyFlowGraph
                  caseData={caseData}
                  transactions={transactions}
                  networkData={networkData || undefined}
                />
              </div>
            </div>

            {/* Right (4 cols): CASE INTELLIGENCE DOSSIER */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <CaseSummary caseData={caseData} />
              <PrimaryMuleCard account={primaryMule} />
              <PredictionCard
                prediction={prediction}
                hotspots={allHotspots || undefined}
                selectedHotspotIndex={selectedHotspotIndex}
                onSelectHotspotIndex={handleSelectHotspotIndex}
                onPredictionChange={setPrediction}
              />
              <PredictionEvidence
                evidence={prediction.evidence}
                modelReasoning={modelReasoning || undefined}
              />
              <HistoricalLinksCard
                cases={historicalCases}
                similarCases={similarCases || undefined}
              />
            </div>
          </div>
        )}

        {/* VIEW MODE 2: TRACE (Dedicated expanded trace) */}
        {activeMode === 'trace' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                PROGRESSIVE TRANSACTION TRACE & HOP VELOCITY
              </h2>
              <span className="text-[11px] font-mono text-cyan-400">
                Max Layering Depth: 4 Hops
              </span>
            </div>
            <MoneyFlowGraph
              caseData={caseData}
              transactions={transactions}
              networkData={networkData || undefined}
            />
          </div>
        )}

        {/* VIEW MODE 3: NETWORK (Mule syndicate topology) */}
        {activeMode === 'network' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <MoneyFlowGraph
                caseData={caseData}
                transactions={transactions}
                networkData={networkData || undefined}
              />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4">
              <PrimaryMuleCard account={primaryMule} />
              <HistoricalLinksCard
                cases={historicalCases}
                similarCases={similarCases || undefined}
              />
            </div>
          </div>
        )}

        {/* VIEW MODE 4: HISTORY (Historical case breakdown) */}
        {activeMode === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <HistoricalLinksCard
                cases={historicalCases}
                similarCases={similarCases || undefined}
              />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4">
              <CaseSummary caseData={caseData} />
              <PrimaryMuleCard account={primaryMule} />
            </div>
          </div>
        )}
      </main>

      {/* Slide-in Forensics Drawers & Modals */}
      <AccountDrawer />
      <TransactionDrawer />
      <HistoricalCaseModal />
      <TechnicalDetailsDrawer />
    </div>
  );
};
