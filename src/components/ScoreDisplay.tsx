"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Coin,
  Trophy,
  Medal,
  ChartBar,
} from "@phosphor-icons/react";

// ─── Mock Prize Config ───
const PRIZE_POOL = 12.5; // ETH
const REWARDS = [
  { place: 1, label: "Gold", amount: 7.5, color: "text-gold", border: "border-gold/20", bg: "bg-gold/5" },
  { place: 2, label: "Silver", amount: 3.5, color: "text-zinc-300", border: "border-zinc-300/20", bg: "bg-zinc-300/5" },
  { place: 3, label: "Bronze", amount: 1.5, color: "text-amber-600", border: "border-amber-600/20", bg: "bg-amber-600/5" },
];

interface ScoreEntry {
  name: string;
  strategy: string;
  score: number;
  capital: number;
}

interface Props {
  scores?: ScoreEntry[];
  roundNumber?: number;
}

export default function ScoreDisplay({ scores, roundNumber = 1 }: Props) {
  const [animatedPool, setAnimatedPool] = useState(PRIZE_POOL);

  // Animate prize pool number
  useEffect(() => {
    const target = PRIZE_POOL;
    const duration = 1500;
    const start = performance.now();

    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPool(eased * target);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, []);

  const topScores = scores
    ? [...scores].sort((a, b) => b.score - a.score).slice(0, 3)
    : [];

  return (
    <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3 sm:px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
          <ChartBar size={14} weight="fill" className="text-accent" />
        </div>
        <h3 className="text-sm font-semibold text-white">Round #{roundNumber}</h3>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Prize Pool Display */}
        <div className="relative overflow-hidden rounded-xl border border-accent/15 bg-accent/[0.03] p-4 text-center">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/5 blur-2xl" />
          <div className="relative z-10">
            <div className="mb-1 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
              <Coin size={12} weight="fill" className="text-accent" />
              <span>Prize Pool</span>
            </div>
            <motion.div
              className="text-3xl font-bold tracking-tight text-white"
              key={Math.round(animatedPool)}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {animatedPool.toFixed(1)}
              </motion.span>
              <span className="ml-1 text-lg font-medium text-accent">ETH</span>
            </motion.div>
          </div>
        </div>

        {/* Top 3 Rewards Breakdown */}
        <div>
          <h4 className="mb-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            <Trophy size={12} weight="fill" />
            Rewards Breakdown
          </h4>

          <div className="space-y-2">
            {REWARDS.map((r) => (
              <motion.div
                key={r.place}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: r.place * 0.1, duration: 0.3 }}
                className={`flex items-center justify-between rounded-lg border ${r.border} ${r.bg} px-3 py-2.5`}
              >
                <div className="flex items-center gap-2.5">
                  {/* Place icon */}
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      r.place === 1
                        ? "bg-gold/20"
                        : r.place === 2
                          ? "bg-zinc-300/15"
                          : "bg-amber-600/15"
                    }`}
                  >
                    {r.place === 1 ? (
                      <Trophy size={14} weight="fill" className={r.color} />
                    ) : (
                      <Medal size={14} weight="fill" className={r.color} />
                    )}
                  </div>

                  <div>
                    <div className={`text-sm font-semibold ${r.color}`}>
                      {r.label}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {r.place === 1
                        ? "1st Place"
                        : r.place === 2
                          ? "2nd Place"
                          : "3rd Place"}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    {r.amount.toFixed(1)}{" "}
                    <span className="text-[10px] font-medium text-accent">
                      ETH
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {((r.amount / PRIZE_POOL) * 100).toFixed(0)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Top Scores (if provided) */}
        {topScores.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              <ChartBar size={12} weight="fill" />
              Current Standings
            </h4>
            <div className="space-y-1">
              {topScores.map((s, i) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-lg bg-surface/30 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-500 w-4">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-white">
                        {s.name}
                      </span>
                      <span className="ml-2 text-[10px] text-zinc-500 uppercase">
                        {s.strategy}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-white">
                    {s.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Round Info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
          <div className="rounded-lg border border-border/40 bg-surface/20 px-3 py-2">
            <span className="block text-[10px] uppercase tracking-wider text-zinc-600">
              Duration
            </span>
            <span className="font-mono font-medium text-white">30 seconds</span>
          </div>
          <div className="rounded-lg border border-border/40 bg-surface/20 px-3 py-2">
            <span className="block text-[10px] uppercase tracking-wider text-zinc-600">
              Gas Model
            </span>
            <span className="font-mono font-medium text-white">EIP-1559</span>
          </div>
        </div>
      </div>
    </div>
  );
}
