import React from 'react';
import { ArrowRight } from '@/lib/icons';
import { motion, AnimatePresence } from 'motion/react';

interface FollowUpPanelProps {
  isOpen: boolean;
  questions: string[];
  onSelect: (question: string) => void;
  onClose: () => void;
}

export const FollowUpPanel: React.FC<FollowUpPanelProps> = ({
  isOpen,
  questions,
  onSelect,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 z-20 cursor-pointer"
            style={{ backgroundColor: 'var(--backdrop)' }}
          />

          {/* Floating Panel */}
          <motion.div
            id="followup-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="absolute left-2.5 right-2.5 bottom-[calc(var(--sab)+10px)] z-30 rounded-[18px] border shadow-2xl overflow-hidden backdrop-blur-md"
            style={{
              backgroundColor: 'var(--panel-bg)',
              borderColor: 'var(--panel-border)',
            }}
          >
            <div className="p-2 flex flex-col gap-1.5 max-h-[260px] overflow-y-auto no-scrollbar">
              {questions.map((q) => (
                <motion.button
                  key={q}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(q)}
                  className="flex items-center gap-2.5 p-3 rounded-[12px] text-[13.5px] font-medium leading-[1.4] text-left transition-colors cursor-pointer border min-h-[48px] active:bg-black/5"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    color: 'var(--text-1)',
                  }}
                >
                  <ArrowRight
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: 'var(--accent)' }}
                  />
                  <span className="flex-1">{q}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
