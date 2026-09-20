import React, { useEffect, useState } from 'react';
import { checkBackendHealth, BackendStatus } from '../../api/apiClient';
import { Cpu, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const BackendStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<BackendStatus>({ connected: false });
  const [loading, setLoading] = useState(true);

  const verifyHealth = async () => {
    const s = await checkBackendHealth();
    setStatus(s);
    setLoading(false);
  };

  useEffect(() => {
    verifyHealth();
    const interval = setInterval(verifyHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-[10.5px] font-mono">
        <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
        <span>PROBING ML ENGINE...</span>
      </div>
    );
  }

  if (status.connected) {
    return (
      <div 
        className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all cursor-help"
        title={`SIH-ML Backend Active: ${status.model || 'XGBoost v2'}\nCases Indexed: ${status.datasetCases || 10000}\nFastAPI Host: 127.0.0.1:8000`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold tracking-wider">
          ML ENGINE ONLINE · XGBOOST V2
        </span>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10.5px] font-mono cursor-pointer hover:bg-amber-500/20 transition-all"
      onClick={verifyHealth}
      title="Backend offline. Click to retry connecting to http://127.0.0.1:8000"
    >
      <AlertCircle className="w-3 h-3 text-amber-400" />
      <span>STANDALONE MODE (CLICK TO RECONNECT)</span>
    </div>
  );
};
