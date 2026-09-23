import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          id="toast-notification"
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute top-[calc(var(--sat)+12px)] left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full text-[11.5px] font-medium shadow-lg pointer-events-none whitespace-nowrap border"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
