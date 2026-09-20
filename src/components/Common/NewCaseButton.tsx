import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, Sparkles, FolderCheck, FileEdit, ArrowRight, Zap } from 'lucide-react';
import { DEMO_CASE_PRESETS } from '../../data/demoCasesData';

interface NewCaseButtonProps {
  variant?: 'header' | 'hero' | 'compact';
  label?: string;
  className?: string;
}

export const NewCaseButton: React.FC<NewCaseButtonProps> = ({
  variant = 'header',
  label,
  className = ''
}) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectCase = (caseId: string) => {
    setDropdownOpen(false);
    navigate(`/investigation/CASE_007001?newCase=true&demo=${caseId}`);
  };

  const handleBlankIntake = () => {
    setDropdownOpen(false);
    navigate('/investigation/CASE_007001?newCase=true&demo=blank');
  };

  const demoList = Object.values(DEMO_CASE_PRESETS);

  // Button text based on variant / prop
  const buttonText = label || (variant === 'hero' ? 'INTAKE NEW CASE' : 'NEW CASE');

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {/* Trigger Button with Split-style or Integrated Dropdown Chevron */}
      <div className="inline-flex rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-cyan-400/50 ${
            variant === 'hero' ? 'px-3.5 py-2 text-xs' : ''
          }`}
          title="Open New Case & Demo Case Options"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{buttonText}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 ml-0.5 text-cyan-200 transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>
      </div>

      {/* Floating Demo Options Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-[380px] sm:w-[420px] max-w-[90vw] rounded-xl bg-[#030914] border border-cyan-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.25)] z-50 overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-950/80 via-[#061426] to-blue-950/80 px-4 py-3 border-b border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
                  NEW CASE INTAKE & DEMO COMPLAINTS
                </span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/30">
                REAL-TIME ML
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 mt-1 font-sans">
              Select a benchmark demo case to test live prediction & hotspot tracking, or open blank intake.
            </p>
          </div>

          <div className="p-2 space-y-1 max-h-[460px] overflow-y-auto">
            {/* Blank Intake Option */}
            <button
              onClick={handleBlankIntake}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#071324]/80 hover:bg-[#0c1f3b] border border-white/[0.08] hover:border-cyan-500/40 transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-slate-300 group-hover:text-cyan-300 group-hover:border-cyan-500/40">
                  <FileEdit className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white group-hover:text-cyan-200 flex items-center gap-1.5">
                    <span>BLANK CASE SPECIFICATION</span>
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-300">
                      MANUAL
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Enter custom case telemetry, victim state, and multi-hop transactions
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Benchmark Demo Cases Section Header */}
            <div className="px-2 pt-2.5 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                BENCHMARK DEMO CASES (6 PRESETS)
              </span>
              <span className="text-[9.5px] font-mono text-slate-500">1-CLICK LOAD</span>
            </div>

            {/* List of Demo Presets */}
            {demoList.map((demo) => (
              <button
                key={demo.case_id}
                onClick={() => handleSelectCase(demo.case_id)}
                className="w-full p-2.5 rounded-lg bg-[#071324]/60 hover:bg-[#0c1f3b] border border-cyan-500/15 hover:border-cyan-400/50 transition-all text-left cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FolderCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-mono text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                      {demo.case_id}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 uppercase">
                      {demo.badge}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    ₹{demo.reported_amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-slate-300">
                  <span className="font-medium text-white">{demo.fraud_type}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    State: <strong className="text-cyan-300">{demo.complaint_state}</strong> · {demo.transactions.length} hops
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 line-clamp-1 group-hover:text-slate-300">
                  {demo.description}
                </p>
              </button>
            ))}
          </div>

          {/* Footer info */}
          <div className="bg-[#02060e] px-3 py-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Real-time XGBoost ML Geolocation & Flow Analysis</span>
            <span className="text-cyan-400 font-semibold">17 Features Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
