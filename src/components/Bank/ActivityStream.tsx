import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { useBankStore } from '../../store/useBankStore';

export const ActivityStream: React.FC = () => {
  const { setSelectedTransaction, openDrawer } = useBankStore();

  const events = [
    { time: '00:20:28', tx: 'TXN_0066249', desc: 'Outbound UPI to HDFC Mule Hub', amount: '₹9,819', channel: 'UPI' },
    { time: '00:35:10', tx: 'TXN_0097457', desc: 'Wallet load & layering transfer', amount: '₹12,751', channel: 'WALLET' },
    { time: '00:48:42', tx: 'TXN_0106171', desc: 'RTGS split to Porvorim beneficiary', amount: '₹3,427', channel: 'RTGS' },
    { time: '01:05:08', tx: 'TXN_0110591', desc: 'High-speed IMPS relay to ICICI', amount: '₹18,070', channel: 'IMPS' },
    { time: '01:22:36', tx: 'TXN_0113519', desc: 'Micro-IMPS settlement to Kotak', amount: '₹3,704', channel: 'IMPS' }
  ];

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-3.5 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            CHRONOLOGICAL ACTIVITY STREAM
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>INTERCEPT LOG</span>
        </span>
      </div>

      <div className="space-y-1.5">
        {events.map((ev, idx) => (
          <div
            key={idx}
            className="px-2.5 py-1.5 rounded bg-[#070F1E] border border-white/[0.04] flex items-center justify-between text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10.5px]">{ev.time}</span>
              <span className="text-amber-300 font-bold text-[11px]">{ev.tx}</span>
              <span className="text-slate-300 text-[11px] hidden sm:inline">{ev.desc}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-white/[0.05] text-slate-400 font-bold">
                {ev.channel}
              </span>
              <span className="text-red-400 font-bold text-[11px]">{ev.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
