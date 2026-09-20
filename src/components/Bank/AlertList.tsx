import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, ArrowRight, CheckCircle, Activity, CreditCard } from 'lucide-react';
import { useBankStore } from '../../store/useBankStore';
import { useActiveCaseStore } from '../../store/useActiveCaseStore';
import { BANK_ALERTS } from '../../data/bank/bankAlerts';
import { BankAlert } from '../../types/bank';

export const AlertList: React.FC = () => {
  const navigate = useNavigate();
  const { severityFilter, statusFilter, setSelectedAccountId, setSelectedAlert } = useBankStore();
  const { activeCase, bankAlerts } = useActiveCaseStore();

  const combinedAlerts = React.useMemo(() => {
    const dynamicIds = new Set((bankAlerts || []).map((a) => a.alertId));
    return [...(bankAlerts || []), ...BANK_ALERTS.filter((a) => !dynamicIds.has(a.alertId))];
  }, [bankAlerts]);

  const filteredAlerts = combinedAlerts.filter((alert) => {
    if (severityFilter !== 'ALL' && alert.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && alert.status !== statusFilter) return false;
    return true;
  });

  const handleInvestigate = (alert: BankAlert) => {
    setSelectedAlert(alert);
    setSelectedAccountId(alert.accountId);
    navigate(`/bank/account/${alert.accountId}`);
  };

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              PRIORITY FRAUD ALERTS
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Immediate operational intervention stream for suspicious account activity
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-bold">
          {filteredAlerts.length} ACTIONABLE ALERTS
        </span>
      </div>

      {/* Alert Stream */}
      <div className="space-y-2.5">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';
          const isActiveMule = alert.accountId === activeCase?.primaryMule ||
                               alert.alertId.includes(activeCase?.id || '---');

          return (
            <div
              key={alert.alertId}
              className={`p-3.5 rounded-lg border transition-all select-none ${
                isActiveMule
                  ? 'border-red-500/80 bg-[#160608] ring-1 ring-red-500/40 hover:bg-[#1f090c]'
                  : isCritical
                  ? 'bg-[#0E0608] border-red-500/40 hover:border-red-500/70 hover:bg-[#14080B]'
                  : isHigh
                  ? 'bg-[#0E0C06] border-amber-500/40 hover:border-amber-500/70 hover:bg-[#141008]'
                  : 'bg-[#060D1A] border-white/[0.08] hover:border-cyan-500/40'
              }`}
            >
              {/* Row 1: Severity Badge, Account ID, Timestamp */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isCritical
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    }`}
                  >
                    {alert.severity} RISK
                  </span>
                  {isActiveMule && (
                    <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse">
                      ACTIVE CASE TARGET
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold text-white tracking-wider">
                    {alert.accountId}
                  </span>
                  <span className="text-[11px] text-slate-400">({alert.accountHolder})</span>
                </div>

                <span className="text-[10.5px] font-mono text-slate-400">{alert.timestamp}</span>
              </div>

              {/* Row 2: Reason & Outbound Exposure */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <div className="text-xs font-semibold text-white leading-snug">
                    {alert.reason}
                  </div>
                  {alert.amount && (
                    <div className="text-[11px] font-mono text-red-400 font-bold mt-0.5">
                      Outbound Volume: ₹{alert.amount.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Network Risk Indicator */}
                <div className="text-right flex-shrink-0 font-mono">
                  <div className="text-[9.5px] text-slate-400">NETWORK RISK</div>
                  <div className="text-xs font-bold text-amber-400">
                    {alert.networkRiskScore.toFixed(3)}
                  </div>
                </div>
              </div>

              {/* Row 3: Observed Signals Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06] mb-3">
                {alert.signals.map((sig, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono text-slate-300 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded"
                  >
                    {sig}
                  </span>
                ))}
              </div>

              {/* Action Button: INVESTIGATE */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-[10.5px] font-mono text-slate-400">
                  <span>Channels: </span>
                  <span className="text-cyan-300 font-semibold">{alert.paymentChannels.join(', ')}</span>
                </div>

                <button
                  onClick={() => handleInvestigate(alert)}
                  className="py-1.5 px-3 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>INVESTIGATE ACCOUNT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
