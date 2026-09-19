import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileEdit, Check, Save } from 'lucide-react';
import { useBankStore } from '../../../store/useBankStore';

export const InvestigationNoteModal: React.FC = () => {
  const { selectedAccount, activeDrawer, closeDrawer, addInvestigationNote, investigationNotes } = useBankStore();
  const [noteText, setNoteText] = useState('');

  if (activeDrawer !== 'note' || !selectedAccount) return null;

  const notesList = investigationNotes[selectedAccount.accountId] || [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addInvestigationNote(selectedAccount.accountId, noteText.trim());
    setNoteText('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        {/* Backdrop */}
        <div
          onClick={closeDrawer}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        />

        {/* Modal / Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="absolute top-0 right-0 bottom-0 w-full max-w-[440px] bg-[#070E1A] border-l border-white/[0.12] shadow-2xl flex flex-col pointer-events-auto overflow-y-auto"
        >
          {/* Header */}
          <div className="p-4 bg-[#0B1424] border-b border-white/[0.1] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                INVESTIGATION NOTES · {selectedAccount.accountId}
              </h3>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4 flex-1">
            <form onSubmit={handleSave} className="space-y-3">
              <label className="text-[10.5px] font-mono text-slate-400 uppercase block">
                ADD INTERNAL FRAUD NOTE
              </label>
              <textarea
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Record compliance observation, STR rationale, or customer inquiry notes..."
                className="w-full bg-[#040914] border border-white/[0.12] rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 font-sans resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE NOTE TO DOSSIER</span>
              </button>
            </form>

            {/* Existing Notes */}
            <div className="pt-3 border-t border-white/[0.08]">
              <div className="text-[10.5px] font-mono text-slate-400 uppercase mb-2">
                EXISTING ANALYST NOTES ({notesList.length})
              </div>
              <div className="space-y-2">
                {notesList.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#040914] border border-white/[0.06] text-xs text-slate-300 font-sans leading-relaxed">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
