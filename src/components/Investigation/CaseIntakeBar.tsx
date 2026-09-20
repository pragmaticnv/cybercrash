import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Play, Plus, Trash2, ChevronDown, ChevronUp, AlertCircle, FolderCheck, RefreshCw, FileText, RotateCcw } from 'lucide-react';
import { apiFetch } from '../../api/apiClient';

export interface TransactionFormItem {
  source_account: string;
  destination_account: string;
  amount: number;
  timestamp: string;
}

export interface CaseIntakePayload {
  case_id: string;
  fraud_type: string;
  reported_amount: number;
  complaint_state: string;
  primary_account: string;
  prediction_time?: string;
  transactions: TransactionFormItem[];
}

interface CaseIntakeBarProps {
  onAnalyzeStart: () => void;
  onAnalyzeSuccess: (result: any, casePayload: CaseIntakePayload) => void;
  onAnalyzeError: (errorMsg: string) => void;
  onResetToCase7001: () => void;
  currentCaseId: string;
}

export const CaseIntakeBar: React.FC<CaseIntakeBarProps> = ({
  onAnalyzeStart,
  onAnalyzeSuccess,
  onAnalyzeError,
  onResetToCase7001,
  currentCaseId
}) => {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [demoCases, setDemoCases] = useState<Record<string, any>>({});
  const [selectedDemoKey, setSelectedDemoKey] = useState<string>('');
  const [loadingDemoCases, setLoadingDemoCases] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-open if redirected via New Case button (?newCase=true)
  useEffect(() => {
    if (searchParams.get('newCase') === 'true') {
      setIsOpen(true);
    }
  }, [searchParams]);

  // Form state
  const [caseId, setCaseId] = useState('LIVE_DEMO_001');
  const [fraudType, setFraudType] = useState('Investment Scam');
  const [reportedAmount, setReportedAmount] = useState<number>(150000);
  const [complaintState, setComplaintState] = useState('GA');
  const [primaryAccount, setPrimaryAccount] = useState('ACC_013041');
  const [predictionTime, setPredictionTime] = useState(new Date().toISOString().slice(0, 19));
  const [transactions, setTransactions] = useState<TransactionFormItem[]>([
    {
      source_account: 'ACC_013041',
      destination_account: 'ACC_010028',
      amount: 80000,
      timestamp: new Date().toISOString().slice(0, 19)
    },
    {
      source_account: 'ACC_010028',
      destination_account: 'ACC_012795',
      amount: 50000,
      timestamp: new Date().toISOString().slice(0, 19)
    }
  ]);

  // Load demo cases on mount from backend: GET http://127.0.0.1:8000/demo-cases
  useEffect(() => {
    async function loadDemoCases() {
      setLoadingDemoCases(true);
      try {
        const data = await apiFetch<any>('/demo-cases');
        if (data?.available_cases) {
          setDemoCases(data.available_cases);
        }
      } catch (err) {
        console.warn('Could not fetch demo cases from backend:', err);
      } finally {
        setLoadingDemoCases(false);
      }
    }
    loadDemoCases();
  }, []);

  // Handle demo case selection from dropdown
  const handleSelectDemoCase = (key: string) => {
    setSelectedDemoKey(key);
    setErrorMessage(null);

    if (key === 'CASE_007001') {
      onResetToCase7001();
      return;
    }

    const demo = demoCases[key];
    if (!demo) return;

    setCaseId(demo.case_id || key);
    setFraudType(demo.fraud_type || 'Investment Scam');
    setReportedAmount(Number(demo.reported_amount) || 100000);
    setComplaintState(demo.complaint_state || 'GA');
    setPrimaryAccount(demo.primary_account || 'ACC_013041');

    // Populate transactions if present
    if (Array.isArray(demo.transactions) && demo.transactions.length > 0) {
      const nowIso = new Date().toISOString().slice(0, 19);
      const mapped = demo.transactions.map((tx: any) => ({
        source_account: tx.source_account || '',
        destination_account: tx.destination_account || '',
        amount: Number(tx.amount) || 0,
        timestamp: tx.timestamp || nowIso
      }));
      setTransactions(mapped);
    }

    // Auto-open intake review
    setIsOpen(true);
  };

  const handleAddTransaction = () => {
    setTransactions((prev) => [
      ...prev,
      {
        source_account: primaryAccount || 'ACC_SOURCE',
        destination_account: `ACC_${Math.floor(10000 + Math.random() * 90000)}`,
        amount: 25000,
        timestamp: new Date().toISOString().slice(0, 19)
      }
    ]);
  };

  const handleRemoveTransaction = (index: number) => {
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTransactionChange = (index: number, field: keyof TransactionFormItem, value: any) => {
    setTransactions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Submit case to POST http://127.0.0.1:8000/new-case
  const handleAnalyzeCase = async () => {
    if (!caseId.trim()) {
      setErrorMessage('Please enter a valid Case ID');
      return;
    }

    setAnalyzing(true);
    setErrorMessage(null);
    onAnalyzeStart();

    const payload: CaseIntakePayload = {
      case_id: caseId.trim().toUpperCase(),
      fraud_type: fraudType.trim(),
      reported_amount: Number(reportedAmount) || 0,
      complaint_state: complaintState.trim().toUpperCase(),
      primary_account: primaryAccount.trim(),
      prediction_time: predictionTime || new Date().toISOString(),
      transactions: transactions.map((tx) => ({
        source_account: tx.source_account.trim(),
        destination_account: tx.destination_account.trim(),
        amount: Number(tx.amount) || 0,
        timestamp: tx.timestamp || new Date().toISOString()
      }))
    };

    try {
      const result = await apiFetch<any>('/new-case', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!result || !result.hotspots) {
        throw new Error('ML Engine returned an invalid response structure.');
      }

      onAnalyzeSuccess(result, payload);
    } catch (err: any) {
      const errMsg = 'Unable to connect to ML backend. Make sure FastAPI is running on port 8000.';
      setErrorMessage(errMsg);
      onAnalyzeError(errMsg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClearToBlank = () => {
    const randomCaseNum = Math.floor(1000 + Math.random() * 9000);
    const newMule = `ACC_MULE_${Math.floor(1000 + Math.random() * 9000)}`;
    const newDest = `ACC_DEST_${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString().slice(0, 19);

    setCaseId(`CASE_NEW_${randomCaseNum}`);
    setSelectedDemoKey('');
    setFraudType('Investment Scam');
    setReportedAmount(125000);
    setComplaintState('DL');
    setPrimaryAccount(newMule);
    setPredictionTime(nowIso);
    setTransactions([
      {
        source_account: newMule,
        destination_account: newDest,
        amount: 75000,
        timestamp: nowIso
      }
    ]);
  };

  const demoKeys = Object.keys(demoCases);

  return (
    <div className="w-full bg-[#050C18] border-b border-cyan-500/20 text-white select-none transition-all">
      {/* Top Bar Strip: Demo Selector + Intake Toggle + Analyze Button */}
      <div className="max-w-[1536px] mx-auto px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Demo Cases Dropdown */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FolderCheck className="w-3.5 h-3.5" />
              DEMO CASES:
            </span>

            <select
              value={selectedDemoKey}
              onChange={(e) => handleSelectDemoCase(e.target.value)}
              className="bg-[#0A162B] border border-cyan-500/40 text-cyan-200 font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer"
            >
              <option value="">-- Choose a Demo Case --</option>
              {/* Keep existing CASE_007001 */}
              <option value="CASE_007001">CASE_007001 (Existing Active Case · Goa)</option>
              {demoKeys.map((key) => {
                const c = demoCases[key];
                return (
                  <option key={key} value={key}>
                    {key} — {c.fraud_type} (₹{Number(c.reported_amount).toLocaleString()} · {c.complaint_state})
                  </option>
                );
              })}
            </select>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* New Case / Intake Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
              isOpen
                ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                : 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 hover:from-cyan-900 hover:to-blue-900 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400 stroke-[2.5]" />
            <span>+ NEW CASE INTAKE</span>
            <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded bg-cyan-900/70 text-cyan-300 border border-cyan-500/40">
              {transactions.length} TXNS
            </span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>
        </div>

        {/* Right: Primary "Analyze Case" Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAnalyzeCase}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>ANALYZING CASE...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>ANALYZE CASE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message Strip */}
      {errorMessage && (
        <div className="bg-red-950/60 border-t border-b border-red-500/40 px-4 lg:px-8 py-2 flex items-center justify-between text-red-200 text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white px-2 py-0.5 rounded text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Collapsible New Case Intake Workspace Panel */}
      {isOpen && (
        <div className="bg-[#030812] border-t border-white/[0.08] px-4 lg:px-8 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
            <div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                NEW CYBERCRIME CASE INTAKE SPECIFICATION
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                Enter case telemetry and transaction hops. All 17 behavioral & topological ML signals are computed in real-time by the XGBoost engine.
              </p>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleClearToBlank}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.1] text-[11px] font-mono transition-all cursor-pointer"
                title="Reset form to enter custom case"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Clear / Blank Form</span>
              </button>

              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-500/30">
                TARGET ENDPOINT: POST /new-case
              </span>
            </div>
          </div>

          {/* Primary Case Fields (Clean 5-column responsive grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-[10.5px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                CASE ID *
              </label>
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="e.g. LIVE_DEMO_001"
                className="w-full bg-[#071120] border border-white/[0.12] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                FRAUD TYPE *
              </label>
              <select
                value={fraudType}
                onChange={(e) => setFraudType(e.target.value)}
                className="w-full bg-[#071120] border border-white/[0.12] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Investment Scam">Investment Scam</option>
                <option value="UPI Fraud">UPI Fraud</option>
                <option value="Marketplace Fraud">Marketplace Fraud</option>
                <option value="Account Takeover">Account Takeover</option>
                <option value="Phishing">Phishing</option>
                <option value="Digital Arrest Scam">Digital Arrest Scam</option>
                <option value="Part-Time Job Fraud">Part-Time Job Fraud</option>
              </select>
            </div>

            <div>
              <label className="block text-[10.5px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                REPORTED AMOUNT (₹) *
              </label>
              <input
                type="number"
                value={reportedAmount}
                onChange={(e) => setReportedAmount(Number(e.target.value))}
                className="w-full bg-[#071120] border border-white/[0.12] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                COMPLAINT STATE *
              </label>
              <input
                type="text"
                value={complaintState}
                onChange={(e) => setComplaintState(e.target.value.toUpperCase())}
                placeholder="e.g. GA, PB, TN, MH"
                maxLength={3}
                className="w-full bg-[#071120] border border-white/[0.12] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 uppercase"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                PRIMARY MULE ACCOUNT *
              </label>
              <input
                type="text"
                value={primaryAccount}
                onChange={(e) => setPrimaryAccount(e.target.value)}
                placeholder="e.g. ACC_013041"
                className="w-full bg-[#071120] border border-white/[0.12] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                TRANSACTION HOPS ({transactions.length})
              </span>
              <button
                type="button"
                onClick={handleAddTransaction}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Transaction</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-[#071120] p-2 rounded border border-white/[0.06] text-xs font-mono"
                >
                  <div className="sm:col-span-1 text-[10px] text-slate-500 font-bold">
                    #{idx + 1}
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={tx.source_account}
                      onChange={(e) => handleTransactionChange(idx, 'source_account', e.target.value)}
                      placeholder="Source Account"
                      className="w-full bg-[#040914] border border-white/[0.08] rounded px-2 py-1 text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={tx.destination_account}
                      onChange={(e) => handleTransactionChange(idx, 'destination_account', e.target.value)}
                      placeholder="Destination Account"
                      className="w-full bg-[#040914] border border-white/[0.08] rounded px-2 py-1 text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      value={tx.amount}
                      onChange={(e) => handleTransactionChange(idx, 'amount', Number(e.target.value))}
                      placeholder="Amount (₹)"
                      className="w-full bg-[#040914] border border-white/[0.08] rounded px-2 py-1 text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={tx.timestamp}
                      onChange={(e) => handleTransactionChange(idx, 'timestamp', e.target.value)}
                      placeholder="YYYY-MM-DDTHH:MM:SS"
                      className="w-full bg-[#040914] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveTransaction(idx)}
                      disabled={transactions.length <= 1}
                      className="text-slate-500 hover:text-red-400 disabled:opacity-30 p-1 transition-colors"
                      title="Remove transaction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
