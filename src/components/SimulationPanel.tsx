"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PlayCircle,
  StopCircle,
  Clock,
  Trophy,
  Lightning,
  ArrowsLeftRight,
  Receipt,
  Swap,
  Fire,
  Eye,
} from "@phosphor-icons/react";

import type { BotConfig } from "./BotCreator";

// ─── Types ───
interface BotScore {
  id: string;
  name: string;
  strategy: string;
  capital: number;
  score: number;
  wins: number;
  rank: number;
}

interface TxLog {
  time: string;
  bot: string;
  action: string;
  profit: string;
  type: "sandwich" | "arbitrage" | "liquidation" | "flash" | "snipe";
}

// ─── Mock Data ───
const MOCK_BOTS: BotScore[] = [
  { id: "1", name: "FlashGorilla", strategy: "Arbitrage", capital: 3.5, score: 0, wins: 4, rank: 1 },
  { id: "2", name: "SandwichKing", strategy: "Sandwich", capital: 5.0, score: 0, wins: 7, rank: 2 },
  { id: "3", name: "LiqBot9000", strategy: "Liquidation", capital: 8.0, score: 0, wins: 2, rank: 3 },
  { id: "4", name: "SnipeLord", strategy: "Sniper", capital: 2.0, score: 0, wins: 1, rank: 4 },
  { id: "5", name: "FlashDrain", strategy: "Flash Loan", capital: 6.0, score: 0, wins: 3, rank: 5 },
];

const ACTIONS = [
  "MEV sandwich executed on Uniswap V3",
  "Arbitrage opportunity detected ETH/USDC",
  "Liquidation alert: position at risk",
  "Flash loan initiated: 500 ETH",
  "Snipe target acquired on new pool",
  "Front-run detected: inserting tx",
  "Back-run executed: slippage capture",
  "Cross-DEX arbitrage completed",
];

const PROFITS = ["+0.42 ETH", "+1.15 ETH", "+0.08 ETH", "+2.30 ETH", "+0.67 ETH", "-0.12 ETH", "+0.95 ETH", "+0.33 ETH"];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  sandwich: <ArrowsLeftRight size={12} />,
  arbitrage: <Swap size={12} />,
  liquidation: <Fire size={12} />,
  flash: <Lightning size={12} />,
  snipe: <Eye size={12} />,
};

const STRATEGY_TYPES = ["Sandwich", "Arbitrage", "Liquidation", "Flash Loan", "Sniper"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTypeKey(action: string): TxLog["type"] {
  if (action.includes("sandwich")) return "sandwich";
  if (action.includes("Arbitrage")) return "arbitrage";
  if (action.includes("Liquidation")) return "liquidation";
  if (action.includes("flash")) return "flash";
  if (action.includes("Snipe") || action.includes("Front-run") || action.includes("Back-run")) return "snipe";
  return "arbitrage";
}

// ─── Props ───
interface Props {
  deployedBots?: BotConfig[];
}

export default function SimulationPanel({ deployedBots = [] }: Props) {
  const [bots, setBots] = useState<BotScore[]>(MOCK_BOTS);
  const [roundActive, setRoundActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [roundNum, setRoundNum] = useState(1);
  const [logs, setLogs] = useState<TxLog[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null!);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Add deployed bots to the roster
  useEffect(() => {
    if (deployedBots.length === 0) return;
    setBots((prev) => {
      const existing = new Set(prev.map((b) => b.name));
      const newBots = deployedBots
        .filter((b) => !existing.has(b.name))
        .map((b, i) => ({
          id: `deploy-${Date.now()}-${i}`,
          name: b.name,
          strategy: b.strategy,
          capital: b.capital,
          score: 0,
          wins: 0,
          rank: prev.length + i + 1,
        }));
      return [...prev, ...newBots];
    });
  }, [deployedBots]);

  // Round timer
  const startRound = useCallback(() => {
    if (roundActive) return;
    setRoundActive(true);
    setTimeLeft(30);
    setLogs([]);

    let t = 30;
    intervalRef.current = setInterval(() => {
      t -= 1;
      setTimeLeft(t);

      // Add score updates and logs during round
      setBots((prev) =>
        prev.map((b) => ({
          ...b,
          score: b.score + (Math.random() > 0.6 ? Math.round(Math.random() * 50) : 0),
        }))
      );

      // Add transaction log
      const bot = randomItem(bots.filter((b) => b.score > 0) || bots);
      const action = randomItem(ACTIONS);
      const profit = randomItem(PROFITS);
      const type = getTypeKey(action);
      setLogs((prev) => [
        ...prev,
        {
          time: `${(30 - t).toString().padStart(2, "0")}:${Math.floor(Math.random() * 60)
            .toString()
            .padStart(2, "0")}`,
          bot: bot?.name || "System",
          action,
          profit,
          type,
        },
      ]);

      if (t <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setRoundActive(false);

        // Calculate final scores and update wins
        setBots((prev) => {
          const sorted = [...prev].sort((a, b) => b.score - a.score);
          return sorted.map((b, i) => ({
            ...b,
            rank: i + 1,
            wins: i === 0 ? b.wins + 1 : b.wins,
          }));
        });

        // Add round summary log
        setLogs((prev) => [
          ...prev,
          {
            time: "00:00",
            bot: "System",
            action: `Round ${roundNum} complete! Winner: ${
              [...bots].sort((a, b) => b.score - a.score)[0]?.name || "N/A"
            }`,
            profit: "",
            type: "arbitrage",
          },
        ]);

        setRoundNum((n) => n + 1);
      }
    }, 1000);
  }, [roundActive, bots, roundNum]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Sort bots by score descending
  const sortedBots = [...bots].sort((a, b) => {
    if (roundActive) return b.score - a.score;
    return a.rank - b.rank;
  });

  const top3 = sortedBots.slice(0, 3);

  function getRankBadge(rank: number) {
    if (rank === 1)
      return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold text-[10px] font-bold">
          1
        </span>
      );
    if (rank === 2)
      return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-300/20 text-zinc-300 text-[10px] font-bold">
          2
        </span>
      );
    if (rank === 3)
      return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-700/20 text-amber-600 text-[10px] font-bold">
          3
        </span>
      );
    return null;
  }

  function getRankBg(rank: number) {
    if (rank === 1) return "bg-gold/5 border-gold/20";
    if (rank === 2) return "bg-zinc-300/5 border-zinc-300/10";
    if (rank === 3) return "bg-amber-700/5 border-amber-700/15";
    return "border-border/40";
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
            <Trophy size={14} weight="fill" className="text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Round #{roundNum}
            </h3>
            <p className="text-[10px] text-zinc-500">
              {roundActive ? "In Progress" : "Ready"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          {roundActive && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-mono font-bold text-accent"
            >
              <Clock size={12} weight="fill" />
              {timeLeft}s
            </motion.div>
          )}

          {/* Start / Stop */}
          <motion.button
            onClick={startRound}
            disabled={roundActive}
            whileTap={roundActive ? {} : { scale: 0.97 }}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
              roundActive
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-accent text-white hover:bg-accent/90 glow-accent-sm"
            }`}
          >
            {roundActive ? (
              <>
                <StopCircle size={14} weight="fill" />
                Running
              </>
            ) : (
              <>
                <PlayCircle size={14} weight="fill" />
                Start Round
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Bot Rankings */}
      <div className="px-4 py-3 sm:px-5">
        <div className="mb-2 grid grid-cols-[28px_1fr_70px_50px] gap-1 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          <span />
          <span>Bot</span>
          <span className="text-right">Score</span>
          <span className="text-right">Wins</span>
        </div>

        <AnimatePresence mode="popLayout">
          {sortedBots.map((bot) => {
            const isTop3 = bot.rank <= 3;
            return (
              <motion.div
                key={bot.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className={`mb-1 grid grid-cols-[28px_1fr_70px_50px] items-center gap-1 rounded-lg border px-2.5 py-2 text-xs transition-all ${
                  isTop3 ? getRankBg(bot.rank) : "border-transparent"
                }`}
              >
                {/* Rank */}
                <div className="flex justify-center">
                  {getRankBadge(bot.rank) || (
                    <span className="text-[10px] text-zinc-600">
                      {bot.rank}
                    </span>
                  )}
                </div>

                {/* Name + Strategy */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="truncate font-medium text-white">
                    {bot.name}
                  </span>
                  <span className="shrink-0 rounded bg-border/60 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500 uppercase tracking-wider">
                    {bot.strategy.slice(0, 4)}
                  </span>
                </div>

                {/* Score */}
                <div className="text-right font-mono text-sm font-bold text-white tabular-nums">
                  <AnimatedScore value={bot.score} />
                </div>

                {/* Wins */}
                <div className="text-right font-mono text-xs text-zinc-400">
                  {bot.wins}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Transaction Log */}
      <div className="border-t border-border/60">
        <div className="flex items-center gap-2 px-4 py-2 sm:px-5">
          <Receipt size={12} className="text-zinc-500" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Transaction Log
          </span>
        </div>
        <div className="max-h-[180px] overflow-y-auto px-4 pb-3 sm:px-5">
          {logs.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-600">
              No transactions yet. Start a round to see MEV activity.
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className="flex items-start gap-2 py-1.5 text-[11px] border-b border-border/30 last:border-0"
              >
                <span className="shrink-0 font-mono text-zinc-600 w-10">
                  {log.time}
                </span>
                <span className="shrink-0 mt-0.5">
                  {TYPE_ICONS[log.type] || <Lightning size={12} />}
                </span>
                <span className="flex-1 text-zinc-400 leading-tight">
                  <span className="font-medium text-white">{log.bot}</span>{" "}
                  {log.action}
                </span>
                {log.profit && (
                  <span
                    className={`shrink-0 font-mono font-semibold ${
                      log.profit.startsWith("+")
                        ? "text-green"
                        : log.profit.startsWith("-")
                          ? "text-accent"
                          : "text-zinc-500"
                    }`}
                  >
                    {log.profit}
                  </span>
                )}
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}

// ─── Animated Score Counter ───
function AnimatedScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const diff = value - display;
    if (diff === 0) return;

    const steps = Math.min(Math.abs(diff), 20);
    const increment = diff / steps;
    let current = display;
    let step = 0;

    const t = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplay(value);
        clearInterval(t);
      } else {
        setDisplay(Math.round(current));
      }
    }, 40);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display}</>;
}
