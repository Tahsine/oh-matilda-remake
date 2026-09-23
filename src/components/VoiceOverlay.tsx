import React, { useEffect, useRef, useState } from 'react';
import { X, Mic } from '@/lib/icons';
import { motion, AnimatePresence } from 'motion/react';
import { DICTATION_WORDS } from '@/constants/prompts';

interface VoiceOverlayProps {
  isOpen: boolean;
  onCancel: () => void;
  onComplete: (transcript: string) => void;
}

const NUM_BARS = 32;

export const VoiceOverlay: React.FC<VoiceOverlayProps> = ({
  isOpen,
  onCancel,
  onComplete,
}) => {
  const [status, setStatus] = useState<string>('Listening…');
  const [transcript, setTranscript] = useState<string>('');
  const [simulatedDb, setSimulatedDb] = useState<number>(-42);
  const [micActiveState, setMicActiveState] = useState<'speaking' | 'pause' | 'processing'>('speaking');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const energyRef = useRef<number>(0.2);
  const targetEnergyRef = useRef<number>(0.2);
  const barHeightsRef = useRef<number[]>(new Array(NUM_BARS).fill(6));
  const peakHeightsRef = useRef<number[]>(new Array(NUM_BARS).fill(6));

  useEffect(() => {
    if (!isOpen) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      setStatus('Listening…');
      setTranscript('');
      setSimulatedDb(-42);
      setMicActiveState('speaking');
      energyRef.current = 0.2;
      targetEnergyRef.current = 0.2;
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;
    let time = 0;

    const renderWaveform = () => {
      time += 0.04;
      energyRef.current += (targetEnergyRef.current - energyRef.current) * 0.18;
      const energy = energyRef.current;
      const curDb = Math.round(-46 + energy * 34);
      setSimulatedDb(curDb);

      if (canvas && ctx) {
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
          canvas.width = width * dpr;
          canvas.height = height * dpr;
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const barSpacing = width / NUM_BARS;
        const barWidth = Math.max(3, barSpacing - 3);
        const centerY = height / 2;

        for (let i = 0; i < NUM_BARS; i++) {
          const normIdx = i / (NUM_BARS - 1);
          const vocalFormant = Math.sin(normIdx * Math.PI) ** 1.35;
          const jitter = Math.sin(time * 9 + i * 0.7) * 0.3 + Math.cos(time * 14 + i * 1.3) * 0.2;
          const harmonic = (0.55 + 0.45 * Math.sin(time * 4 + i * 0.5)) * vocalFormant;
          const maxPossibleHeight = height * 0.88;
          const baseHeight = 5;
          const speechHeight = energy * vocalFormant * maxPossibleHeight * (0.65 + 0.35 * harmonic + jitter * 0.15);
          const targetH = Math.max(baseHeight, speechHeight);

          barHeightsRef.current[i] += (targetH - barHeightsRef.current[i]) * 0.22;
          const currentH = barHeightsRef.current[i];

          if (currentH > peakHeightsRef.current[i]) {
            peakHeightsRef.current[i] = currentH;
          } else {
            peakHeightsRef.current[i] = Math.max(baseHeight, peakHeightsRef.current[i] - 1.2);
          }

          const x = i * barSpacing + (barSpacing - barWidth) / 2;
          const y = centerY - currentH / 2;
          const radius = Math.min(barWidth / 2, currentH / 2);

          const gradient = ctx.createLinearGradient(0, centerY - currentH / 2, 0, centerY + currentH / 2);
          const alpha = 0.45 + energy * 0.55;
          gradient.addColorStop(0, `rgba(90, 212, 139, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(30, 158, 83, ${alpha * 0.95})`);
          gradient.addColorStop(1, `rgba(46, 204, 113, ${alpha * 0.8})`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, currentH, [radius]);
          ctx.fill();

          const peakY = centerY - peakHeightsRef.current[i] / 2 - 2;
          if (peakHeightsRef.current[i] > baseHeight + 3) {
            ctx.fillStyle = `rgba(168, 245, 196, ${Math.min(1, alpha * 1.1)})`;
            ctx.beginPath();
            ctx.arc(x + barWidth / 2, peakY, barWidth / 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(renderWaveform);
    };

    animFrameIdRef.current = requestAnimationFrame(renderWaveform);

    let wordIndex = 0;
    let pauseInterval: number | null = null;
    let wordStreamTimer = 0;

    const streamNextWord = () => {
      if (wordIndex < DICTATION_WORDS.length) {
        targetEnergyRef.current = 0.72 + Math.random() * 0.28;
        setMicActiveState('speaking');
        setTranscript((prev) => (prev ? prev + ' ' : '') + DICTATION_WORDS[wordIndex]);
        wordIndex++;

        pauseInterval = window.setTimeout(() => {
          targetEnergyRef.current = 0.2 + Math.random() * 0.15;
          setMicActiveState('pause');
        }, 120);
      } else {
        window.clearInterval(wordStreamTimer);
        if (pauseInterval) window.clearTimeout(pauseInterval);

        setStatus('Interpreting…');
        setMicActiveState('processing');
        targetEnergyRef.current = 0.12;

        window.setTimeout(() => {
          onComplete(DICTATION_WORDS.join(' '));
        }, 850);
      }
    };

    wordStreamTimer = window.setInterval(streamNextWord, 230);

    return () => {
      window.clearInterval(wordStreamTimer);
      if (pauseInterval) window.clearTimeout(pauseInterval);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="voice-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-[55] flex flex-col items-center justify-between p-7 select-none overflow-hidden"
          style={{ backgroundColor: 'var(--screen-bg)' }}
        >
          {/* Top Info Bar */}
          <div className="w-full flex flex-col items-center gap-2 pt-[calc(var(--sat)+16px)]">
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold tracking-widest uppercase shadow-xs"
              style={{
                borderColor: 'var(--card-border)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--accent)',
              }}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  micActiveState === 'speaking'
                    ? 'bg-[var(--accent)] animate-ping'
                    : micActiveState === 'pause'
                    ? 'bg-[var(--accent)] opacity-60'
                    : 'bg-amber-400 animate-pulse'
                }`}
              />
              <span>{status}</span>
            </motion.div>

            <div
              className="flex items-center gap-1.5 text-[10.5px] font-medium transition-colors"
              style={{ color: 'var(--text-3)' }}
            >
              <Mic className="w-3 h-3" style={{ color: 'var(--accent)' }} />
              <span>Simulated Mic Input:</span>
              <span
                className="font-semibold transition-all duration-150"
                style={{
                  color: simulatedDb > -25 ? 'var(--accent)' : 'var(--text-2)',
                }}
              >
                {simulatedDb} dB
              </span>
              <span className="opacity-40">·</span>
              <span className="text-[10px]">
                {micActiveState === 'speaking' ? 'Voice detected' : micActiveState === 'pause' ? 'In pause' : 'Analyzing'}
              </span>
            </div>
          </div>

          {/* Center: Dynamic Waveform Canvas with pulsing ambient glow */}
          <div className="relative w-full max-w-[310px] flex flex-col items-center justify-center my-auto">
            <motion.div
              animate={{
                scale: [1, 1 + energyRef.current * 0.45, 1],
                opacity: [0.15, 0.25 + energyRef.current * 0.35, 0.15],
              }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="absolute w-[180px] h-[100px] rounded-full blur-2xl pointer-events-none"
              style={{ backgroundColor: 'var(--accent)' }}
            />

            <div className="relative w-full h-[88px] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                style={{ filter: 'drop-shadow(0 4px 12px var(--accent-soft))' }}
              />
            </div>

            <div className="w-24 h-[1px] rounded-full mt-1 opacity-20 bg-[var(--text-3)]" />
          </div>

          {/* Transcript display */}
          <div className="w-full flex flex-col items-center gap-4 pb-[calc(var(--sab)+8px)]">
            <motion.div
              key={transcript}
              initial={{ opacity: 0.85, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[14.5px] font-semibold text-center px-4 min-h-[56px] max-h-[72px] overflow-y-auto leading-[1.5] max-w-[290px]"
              style={{ color: 'var(--text-1)' }}
            >
              {transcript || (
                <span className="text-[13px] font-normal italic" style={{ color: 'var(--text-3)' }}>
                  Speak now...
                </span>
              )}
            </motion.div>

            <button
              onClick={onCancel}
              className="flex items-center gap-2 border rounded-full px-5 py-2.5 text-[12px] font-semibold transition-all active:bg-black/5 active:scale-95 cursor-pointer shadow-xs"
              style={{
                borderColor: 'var(--card-border)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-2)',
              }}
            >
              <X className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Cancel Voice</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
