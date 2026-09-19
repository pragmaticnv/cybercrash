import React from 'react';
import { Zap, Users, Share2, AlertTriangle, Network, ShieldCheck } from 'lucide-react';

export const RiskSignalsSummary: React.FC = () => {
  const signals = [
    {
      icon: Zap,
      title: 'Rapid Fund Movement',
      metric: '0.141 Velocity Index',
      detail: '8 outbound relays executed within 90 mins of credit',
      status: 'HIGH ALERT',
      color: 'text-red-400 border-red-500/30 bg-red-500/10'
    },
    {
      icon: Users,
      title: 'Unusual Receiver Expansion',
      metric: '8 Unique Beneficiaries',
      detail: '800% increase over 30-day baseline account behavior',
      status: 'HIGH RISK',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    },
    {
      icon: Share2,
      title: 'Multi-Channel Dispersion',
      metric: '4 Payment Rails',
      detail: 'Simultaneous dispersion via UPI, IMPS, RTGS & Wallets',
      status: 'CRITICAL',
      color: 'text-red-400 border-red-500/30 bg-red-500/10'
    },
    {
      icon: Network,
      title: 'High Network Connectivity',
      metric: '13 Connected Nodes',
      detail: 'Graph centrality matches known mule aggregator patterns',
      status: 'ELEVATED',
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
    },
    {
      icon: AlertTriangle,
      title: 'Prior Suspicious Activity',
      metric: '1 Bank Alert + 1 Case Link',
      detail: 'Directly linked to active LEA case dossier CASE_007001',
      status: 'CONFIRMED LINK',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
    }
  ];

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              CORE RISK SIGNALS
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Algorithmic behavioural vectors identifying potential mule behaviour
            </div>
          </div>
        </div>
      </div>

      {/* Signals List */}
      <div className="space-y-2">
        {signals.map((sig, idx) => {
          const Icon = sig.icon;
          return (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-[#070F1E] border border-white/[0.06] flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded border ${sig.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{sig.title}</div>
                  <div className="text-[11px] text-slate-400 font-sans">{sig.detail}</div>
                </div>
              </div>

              <div className="text-right font-mono flex-shrink-0">
                <div className="text-xs font-bold text-amber-300">{sig.metric}</div>
                <div className="text-[9px] font-bold text-red-400">{sig.status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
