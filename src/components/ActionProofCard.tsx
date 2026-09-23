import React, { useState } from 'react';
import { MousePointerClick, Check, RotateCw, Loader2 } from '@/lib/icons';
import { motion, AnimatePresence } from 'motion/react';
import type { ActionProof } from '@/types';

interface ActionProofCardProps {
  action: ActionProof;
  onToast: (msg: string) => void;
}

export const ActionProofCard: React.FC<ActionProofCardProps> = ({
  action,
  onToast,
}) => {
  const [status, setStatus] = useState<'pending' | 'executing' | 'done' | 'cancelled'>('pending');

  const handleCancel = () => {
    setStatus('cancelled');
    onToast('Cancelled');
  };

  const handleConfirm = () => {
    setStatus('executing');
    setTimeout(() => {
      setStatus('done');
      onToast('Executed via Accessibility (simulated)');
    }, 650);
  };

  const handleReplay = () => {
    setStatus('executing');
    onToast('Replaying tap (simulated)');
    setTimeout(() => {
      setStatus('done');
      onToast('Done — tap replayed');
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-3 rounded-[13px] border shadow-xs"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
      }}
    >
      <div
        className="flex items-center gap-2 text-[12.5px] font-semibold"
        style={{ color: 'var(--text-1)' }}
      >
        <MousePointerClick className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
        <span>
          {action.desc} — {action.app}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {status === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p
              className="text-[11.5px] mt-1 mb-2.5 pl-6"
              style={{ color: 'var(--text-2)' }}
            >
              Requires your confirmation before I act.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 min-h-[40px] rounded-[10px] text-[12.5px] font-semibold text-center transition-transform active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: 'var(--hover)',
                  color: 'var(--text-1)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 min-h-[40px] rounded-[10px] text-[12.5px] font-semibold text-center text-white transition-transform active:scale-95 cursor-pointer"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        )}

        {status === 'cancelled' && (
          <motion.p
            key="cancelled"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11.5px] italic pl-6 mt-1"
            style={{ color: 'var(--text-3)' }}
          >
            Action cancelled — nothing was done.
          </motion.p>
        )}

        {status === 'executing' && (
          <motion.div
            key="executing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-[12px] pl-6 mt-2 py-1"
            style={{ color: 'var(--text-3)' }}
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--accent)' }} />
            <span>Executing via Accessibility…</span>
          </motion.div>
        )}

        {status === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2.5"
          >
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <img
                  src={action.before}
                  alt="Before action"
                  className="w-full rounded-[10px] border block"
                  style={{ borderColor: 'var(--card-border)' }}
                />
                <span
                  className="text-[10px] font-bold text-center uppercase tracking-wider"
                  style={{ color: 'var(--text-3)' }}
                >
                  Before
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <img
                  src={action.after}
                  alt="After action"
                  className="w-full rounded-[10px] border block"
                  style={{ borderColor: 'var(--card-border)' }}
                />
                <span
                  className="text-[10px] font-bold text-center uppercase tracking-wider"
                  style={{ color: 'var(--text-3)' }}
                >
                  After
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11.5px] mt-2.5 pt-1">
              <div
                className="flex items-center gap-1.5 font-medium"
                style={{ color: 'var(--text-2)' }}
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" style={{ color: 'var(--accent)' }} />
                <span>Done — tap executed</span>
              </div>
              <button
                onClick={handleReplay}
                className="flex items-center gap-1 min-h-[40px] px-2 font-bold text-xs cursor-pointer active:opacity-70"
                style={{ color: 'var(--accent)' }}
              >
                <RotateCw className="w-3 h-3" />
                <span>Replay</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
