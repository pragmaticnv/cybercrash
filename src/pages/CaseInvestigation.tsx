import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Common/Header';
import { CaseHeader } from '../components/Investigation/CaseHeader';
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

export const CaseInvestigation: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { activeMode, setSelectedCaseId } = useInvestigationStore();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [primaryMule, setPrimaryMule] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [historicalCases, setHistoricalCases] = useState<HistoricalCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkspace() {
      if (!caseId) return;
      setLoading(true);
      setSelectedCaseId(caseId);

      const [cData, predData, muleData, txData, histData] = await Promise.all([
        fetchCaseById(caseId),
        fetchPredictionForCase(caseId),
        fetchAccountById('ACC_013041'),
        fetchTransactionsForCase(caseId),
        fetchHistoricalCases('ACC_013041'),
      ]);

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
  }, [caseId, navigate, setSelectedCaseId]);

  if (loading || !caseData || !prediction || !primaryMule) {
    return (
      <div className="min-h-screen bg-[#02060D] text-white flex flex-col font-sans">
        <Header />
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

      {/* 2. Top Case Bar */}
      <CaseHeader caseData={caseData} />

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
                <MoneyFlowGraph caseData={caseData} transactions={transactions} />
              </div>
            </div>

            {/* Right (4 cols): CASE INTELLIGENCE DOSSIER */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <CaseSummary caseData={caseData} />
              <PrimaryMuleCard account={primaryMule} />
              <PredictionCard prediction={prediction} />
              <PredictionEvidence evidence={prediction.evidence} />
              <HistoricalLinksCard cases={historicalCases} />
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
            <MoneyFlowGraph caseData={caseData} transactions={transactions} />
          </div>
        )}

        {/* VIEW MODE 3: NETWORK (Mule syndicate topology) */}
        {activeMode === 'network' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <MoneyFlowGraph caseData={caseData} transactions={transactions} />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4">
              <PrimaryMuleCard account={primaryMule} />
              <HistoricalLinksCard cases={historicalCases} />
            </div>
          </div>
        )}

        {/* VIEW MODE 4: HISTORY (Historical case breakdown) */}
        {activeMode === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <HistoricalLinksCard cases={historicalCases} />
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
