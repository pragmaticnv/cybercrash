import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Common/Header';
import { ActiveCaseBanner } from '../components/Common/ActiveCaseBanner';
import { StatsBar } from '../components/CaseCommand/StatsBar';
import { CaseList } from '../components/CaseCommand/CaseList';
import { fetchCases, isDemoCaseId } from '../api/cases';
import { Case } from '../types/case';
import { useInvestigationStore } from '../store/useInvestigationStore';
import { useActiveCaseStore } from '../store/useActiveCaseStore';
import { Shield, Filter, RefreshCw, FolderSearch, Plus } from 'lucide-react';
import { NewCaseButton } from '../components/Common/NewCaseButton';

export const LEACaseCommand: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { searchQuery, setSelectedCaseId } = useInvestigationStore();
  const { activeCase } = useActiveCaseStore();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchCases();
      setCases(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    navigate(`/investigation/${caseId}`);
  };

  // Exclude live demo cases from the active cybercrime cases list
  // as they are test cases checked for model training and benchmark evaluations.
  // Genuine newly created operational cases will still appear.
  const operationalCases = useMemo(() => {
    const list = cases.filter((c) => !isDemoCaseId(c.id));
    if (activeCase && !isDemoCaseId(activeCase.id)) {
      const existingIdx = list.findIndex((c) => c.id.toUpperCase() === activeCase.id.toUpperCase());
      if (existingIdx >= 0) {
        list.splice(existingIdx, 1);
      }
      list.unshift(activeCase);
    }
    return list;
  }, [cases, activeCase]);

  // Filter cases by search query (supports Case ID, Primary Mule, Account ID, Type, State)
  const filteredCases = useMemo(() => {
    if (!searchQuery.trim()) return operationalCases;
    const q = searchQuery.toLowerCase().trim();
    return operationalCases.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.primaryMule.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.victim.name.toLowerCase().includes(q) ||
        (c.victim.utr && c.victim.utr.toLowerCase().includes(q))
    );
  }, [operationalCases, searchQuery]);

  return (
    <div className="min-h-screen bg-[#02060D] text-white flex flex-col font-sans">
      {/* 1. Header */}
      <Header />

      {/* 1.5 Active Demo Case & Multi-Agency Synchronizer */}
      <ActiveCaseBanner />

      {/* 2. Main Case Command Workspace */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Title & Status Strip */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-semibold">
                LAW ENFORCEMENT AGENCY · CENTRAL COMMAND
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-white tracking-tight uppercase">
              CASE COMMAND
            </h1>
            <p className="text-xs text-[#8B98A5] mt-0.5">
              Active cybercrime investigations, intake queue, and mule syndication tracking
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <NewCaseButton variant="hero" label="INTAKE NEW CASE" />

            <span className="font-mono text-slate-400 text-[11px]">
              Showing <strong className="text-white">{filteredCases.length}</strong> active dossiers
            </span>
          </div>
        </div>

        {/* Operational Statistics Bar */}
        <StatsBar
          totalActive={operationalCases.length || 14}
          newCases={3}
          inProgress={8}
          criticalAttention={3}
        />

        {/* Case List Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderSearch className="w-4 h-4 text-cyan-400" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                ACTIVE CYBERCRIME CASES
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Select any case row to load dedicated digital forensic workspace
            </span>
          </div>

          {loading ? (
            <div className="w-full bg-[#071120] border border-white/[0.08] rounded-xl p-12 text-center text-slate-400">
              <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs font-mono">Synchronizing case dossiers from LEA Gov-Net...</p>
            </div>
          ) : (
            <CaseList cases={filteredCases} onSelectCase={handleSelectCase} />
          )}
        </section>
      </main>
    </div>
  );
};
