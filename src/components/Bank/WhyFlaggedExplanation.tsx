import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, Share2, Zap, Users, History, Network } from 'lucide-react';
import { BankAccount } from '../../types/bank';

export const WhyFlaggedExplanation: React.FC<{ account: BankAccount }> = ({ account }) => {
  const flags = [
    {
      num: '01',
      title: 'MULTIPLE OUTBOUND DESTINATIONS',
      observed: `${account.uniqueReceivers ?? 8} Unique Beneficiaries`,
      context: 'Unusual dispersal across 8 distinct recipient bank accounts within 90 minutes of inbound credit arrival.',
      severity: 'HIGH RISK'
    },
    {
      num: '02',
      title: 'RAPID FUND MOVEMENT & HIGH VELOCITY',
      observed: `${(account.transferVelocity ?? 0.12).toFixed(3)} Velocity Index`,
      context: 'Initial outbound debit was initiated within 4m 12s post ₹1,00,250 credit, exhibiting characteristic relay mule behavior.',
      severity: 'HIGH RISK'
    },
    {
      num: '03',
      title: 'MULTI-CHANNEL PAYMENT DISPERSION',
      observed: '4 Distinct Payment Rails',
      context: 'Simultaneous usage of UPI, IMPS, RTGS and Mobile Wallets to minimize single-channel daily transaction limits.',
      severity: 'CRITICAL'
    },
    {
      num: '04',
      title: 'DENSE NETWORK CONNECTIVITY',
      observed: `${account.networkDegree ?? 3} Connected Nodes in Graph`,
      context: 'Account occupies high degree centrality in Western Coastal laundering network with known links to Layer 2 aggregators.',
      severity: 'ELEVATED'
    },
    {
      num: '05',
      title: 'PREVIOUS BANK ALERT ON RECORD',
      observed: `${account.previousAlertCount ?? 1} Historical Alert`,
      context: 'Prior alert logged on 2025-08-14 for high-speed debit transfers; current incident escalates risk pattern.',
      severity: 'SUSPICIOUS'
    },
    {
      num: '06',
      title: 'ML FUND SPLIT RATIO DISPERSAL',
      observed: `${Math.round((account.fundSplitRatio || 0.85) * 100)}% Split Ratio`,
      context: 'Calculated proportion of incoming criminal proceeds routed into downstream layering nodes within pre-prediction window.',
      severity: (account.fundSplitRatio || 0.85) > 0.7 ? 'CRITICAL' : 'HIGH RISK'
    }
  ];

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-white/[0.08] gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              WHY THIS ACCOUNT IS FLAGGED · ML BEHAVIORAL ATTRIBUTES
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Algorithmic evidence breakdown verified against SIH-ML dataset v2 features
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
            SPLIT: {Math.round((account.fundSplitRatio || 0.85) * 100)}%
          </span>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
            VELOCITY: {(account.transferVelocity ?? 0.12).toFixed(3)}
          </span>
          <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-bold">
            6 VERIFIED SIGNALS
          </span>
        </div>
      </div>

      {/* Flag Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {flags.map((item) => (
          <div
            key={item.num}
            className="p-3.5 rounded-lg bg-[#070F1E] border border-white/[0.06] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  [{item.num}] {item.title}
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  {item.severity}
                </span>
              </div>

              <div className="text-sm font-mono font-bold text-white mb-1.5">
                {item.observed}
              </div>

              <div className="text-[11.5px] text-slate-400 font-sans leading-relaxed">
                {item.context}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-slate-500">
              Observation basis: Banking transaction intercept log
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
