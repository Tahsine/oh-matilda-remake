import React, { useState } from 'react';
import { RotateCw } from '@/lib/icons';
import { motion } from 'motion/react';
import { PROMPT_POOL } from '@/constants/prompts';

interface HomeStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export const HomeState: React.FC<HomeStateProps> = ({ onSelectPrompt }) => {
  const [poolIdx, setPoolIdx] = useState<number>(0);
  const [spin, setSpin] = useState<number>(0);

  const hour = new Date().getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? 'Good morning,'
      : hour >= 12 && hour < 18
      ? 'Good afternoon,'
      : 'Good evening,';

  const visiblePrompts = [
    PROMPT_POOL[poolIdx % PROMPT_POOL.length],
    PROMPT_POOL[(poolIdx + 1) % PROMPT_POOL.length],
  ];

  const handleRefresh = () => {
    setSpin((s) => s + 360);
    setPoolIdx((prev) => prev + 2);
  };

  return (
    <motion.section
      id="home-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="pt-10 px-4 text-center"
    >
      <h1
        id="greet-heading"
        className="text-[20px] font-bold leading-[1.32] tracking-tight"
        style={{ color: 'var(--text-1)' }}
      >
        {greeting}
        <br />
        Can I help you with anything?
      </h1>

      <p
        className="text-[12px] mt-3 leading-[1.55] px-3.5"
        style={{ color: 'var(--text-2)' }}
      >
        Choose a prompt below or write your own to start chatting with Oh-Matilda.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3" id="prompt-grid">
        {visiblePrompts.map((promptText, i) => (
          <motion.button
            key={`${poolIdx}-${i}-${promptText}`}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectPrompt(promptText)}
            className="text-left text-[12.5px] font-semibold leading-[1.45] p-3.5 rounded-[14px] border min-h-[78px] transition-shadow shadow-xs cursor-pointer flex items-center"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-1)',
            }}
          >
            <span>{promptText}</span>
          </motion.button>
        ))}
      </div>

      <button
        id="btn-refresh-prompts"
        onClick={handleRefresh}
        className="mt-3.5 mx-auto flex items-center gap-1.5 text-[11.5px] font-medium py-1.5 px-3 rounded-full transition-colors active:bg-black/5 cursor-pointer active:scale-95"
        style={{ color: 'var(--text-2)' }}
      >
        <motion.span
          animate={{ rotate: spin }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="inline-flex"
        >
          <RotateCw className="w-3.5 h-3.5 stroke-[2.2]" />
        </motion.span>
        <span>Refresh prompts</span>
      </button>
    </motion.section>
  );
};
