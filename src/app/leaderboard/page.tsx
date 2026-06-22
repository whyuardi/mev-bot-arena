"use client";

import { useState, useMemo } from "react";
import {
  Trophy,
  Medal,
  MagnifyingGlass,
  CaretUp,
  CaretDown,
  ChartBar,
  Cube,
  Clock,
  Coin,
  Lightning,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ─── Types ─── */

type BotStrategy = "Sandwich" | "Arbitrage" | "Liquidation" | "Flash Loan" | "Sniper";
type SortKey = "rank" | "name" | "strategy" | "capital" | "score" | "wins" | "winRate" | "reward";
type SortDir = "asc" | "desc";

interface BotData {
  id: string;
  name: string;
  strategy: BotStrategy;
  capital: number;
  score: number;
  wins: number;
  totalRounds: number;
  reward: number;
}

interface SortState {
  key: SortKey;
  dir: SortDir;
}

/* ─── Constants ─── */

const STRATEGIES: BotStrategy[] = [
  "Sandwich",
  "Arbitrage",
  "Liquidation",
  "Flash Loan",
  "Sniper",
];

const STRATEGY_COLORS: Record<BotStrategy, string> = {
  Sandwich: "#f04444",
  Arbitrage: "#3b82f6",
  Liquidation: "#f97316",
  "Flash Loan": "#a855f7",
  Sniper: "#22c55e",
};

const STRATEGY_BG: Record<BotStrategy, string> = {
  Sandwich: "bg-red-500/10",
  Arbitrage: "bg-blue-500/10",
  Liquidation: "bg-orange-500/10",
  "Flash Loan": "bg-purple-500/10",
  Sniper: "bg-green-500/10",
};

const STRATEGY_TEXT: Record<BotStrategy, string> = {
  Sandwich: "text-red-400",
  Arbitrage: "text-blue-400",
  Liquidation: "text-orange-400",
  "Flash Loan": "text-purple-400",
  Sniper: "text-green-400",
};

const BOT_NAMES: string[] = [
  "MevMaster42",
  "SandwichKing",
  "ArbBot3000",
  "FlashLoaner",
  "LiquidatorPro",
  "SniperElite",
  "FrontRunBot",
  "ArbitrageKing",
  "MempoolHunter",
  "FlashBorrower",
  "LiquidationBot",
  "DeFiSniper",
  "RugPullAvoid",
  "DEXArbitrage",
  "DarkForestBot",
  "CEXArbitrage",
  "FlashMintBot",
  "BundleBot",
  "LiquidatorMax",
  "ProfitHunter",
  "MevWizard",
  "GasGuzzler",
  "BackRunKing",
  "JitoSearcher",
  "MempoolMaster",
];

const PER_PAGE = 10;
const MY_BOT_ID = "b4"; // FlashLoaner — designated "My Bot"

/* ─── Mock Data ─── */

function generateMockBots(): BotData[] {
  const strategies: BotStrategy[] = [
    "Sandwich",
    "Sandwich",
    "Arbitrage",
    "Flash Loan",
    "Liquidation",
    "Sniper",
    "Sandwich",
    "Arbitrage",
    "Sandwich",
    "Flash Loan",
    "Liquidation",
    "Sniper",
    "Liquidation",
    "Arbitrage",
    "Sniper",
    "Arbitrage",
    "Flash Loan",
    "Sandwich",
    "Liquidation",
    "Sniper",
  ];

  return BOT_NAMES.slice(0, 20).map((name, i) => {
    const capital = Math.floor(Math.random() * 140000) + 60000;
    const totalRounds = Math.floor(Math.random() * 250) + 150;
    const winRate = 0.4 + Math.random() * 0.45;
    const wins = Math.floor(totalRounds * winRate);
    const score = Math.floor(wins * (1 + Math.random() * 0.3) + capital / 1000);
    const reward = parseFloat((score * 0.0045 + Math.random() * 5).toFixed(1));

    return {
      id: `b${i + 1}`,
      name,
      strategy: strategies[i],
      capital,
      score,
      wins,
      totalRounds,
      reward,
    };
  });
}

/* ─── Helpers ─── */

function winRate(wins: number, total: number): string {
  return total > 0 ? ((wins / total) * 100).toFixed(1) + "%" : "0%";
}

function formatCapital(n: number): string {
  if (n >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return "$" + (n / 1000).toFixed(0) + "K";
  return "$" + n;
}

function formatReward(n: number): string {
  return n.toFixed(1) + " ETH";
}

/* ─── Main Component ─── */

export default function LeaderboardPage() {
  const bots = useMemo(() => generateMockBots(), []);
  const [sort, setSort] = useState<SortState>({ key: "score", dir: "desc" });
  const [search, setSearch] = useState("");
  const [filterStrategy, setFilterStrategy] = useState<BotStrategy | "All">("All");
  const [page, setPage] = useState(1);

  // ── Filtered + Sorted ──

  const filtered = useMemo(() => {
    let list = [...bots];

    // Strategy filter
    if (filterStrategy !== "All") {
      list = list.filter((b) => b.strategy === filterStrategy);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((b) => b.name.toLowerCase().includes(q));
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      switch (sort.key) {
        case "rank":
          cmp = bots.indexOf(a) - bots.indexOf(b);
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "strategy":
          cmp = a.strategy.localeCompare(b.strategy);
          break;
        case "capital":
          cmp = a.capital - b.capital;
          break;
        case "score":
          cmp = a.score - b.score;
          break;
        case "wins":
          cmp = a.wins - b.wins;
          break;
        case "winRate":
          cmp = a.wins / a.totalRounds - b.wins / b.totalRounds;
          break;
        case "reward":
          cmp = a.reward - b.reward;
          break;
      }
      return sort.dir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [bots, sort, search, filterStrategy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // ── Stats ──

  const totalBots = bots.length;
  const totalRounds = bots.reduce((s, b) => s + b.totalRounds, 0);
  const totalRewards = bots.reduce((s, b) => s + b.reward, 0);

  // ── Chart data (top 10 by score) ──

  const chartData = useMemo(() => {
    return [...bots]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((b) => ({
        name: b.name.length > 12 ? b.name.slice(0, 10) + "…" : b.name,
        score: b.score,
        fill: "#f04444",
      }));
  }, [bots]);

  // ── Sort toggle ──

  function toggleSort(key: SortKey) {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc",
    }));
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sort.key !== column) {
      return (
        <span className="ml-1 inline-flex flex-col leading-none opacity-20">
          <CaretUp size={8} weight="fill" />
          <CaretDown size={8} weight="fill" className="-mt-0.5" />
        </span>
      );
    }
    return (
      <span className="ml-1 inline-flex text-accent">
        {sort.dir === "asc" ? (
          <CaretUp size={12} weight="fill" />
        ) : (
          <CaretDown size={12} weight="fill" />
        )}
      </span>
    );
  }

  function SortableTh({
    label,
    column,
    className,
  }: {
    label: string;
    column: SortKey;
    className?: string;
  }) {
    return (
      <th
        className={`cursor-pointer select-none px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-300 ${className ?? ""}`}
        onClick={() => toggleSort(column)}
      >
        <span className="inline-flex items-center">
          {label}
          <SortIcon column={column} />
        </span>
      </th>
    );
  }

  // ── Rank badge ──

  function RankBadge({
    rank,
    isMobile,
  }: {
    rank: number;
    isMobile?: boolean;
  }) {
    if (rank === 1) {
      const el = (
        <div className="flex items-center justify-center">
          <Medal size={isMobile ? 20 : 18} weight="fill" className="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
        </div>
      );
      return el;
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center">
          <Medal size={isMobile ? 20 : 18} weight="fill" className="text-zinc-300 drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center">
          <Medal size={isMobile ? 20 : 18} weight="fill" className="text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]" />
        </div>
      );
    }
    return (
      <span className="text-xs font-semibold tabular-nums text-zinc-500">
        {rank}
      </span>
    );
  }

  // ── Strategy badge ──

  function StrategyBadge({ strategy }: { strategy: BotStrategy }) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STRATEGY_BG[strategy]} ${STRATEGY_TEXT[strategy]}`}
        style={{ borderColor: STRATEGY_COLORS[strategy] + "30" }}
      >
        {strategy === "Sandwich" && <Lightning size={10} weight="fill" />}
        {strategy === "Arbitrage" && <ChartBar size={10} weight="fill" />}
        {strategy === "Liquidation" && <Coin size={10} weight="fill" />}
        {strategy === "Flash Loan" && <Lightning size={10} weight="bold" />}
        {strategy === "Sniper" && <MagnifyingGlass size={10} weight="fill" />}
        {strategy}
      </span>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none fixed -left-80 top-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gold/5 blur-[150px]" />
      <div className="pointer-events-none fixed -right-80 bottom-1/4 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-gold/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/20 bg-gold/5">
              <Trophy size={22} weight="fill" className="text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <span className="text-gold">Leaderboard</span>
              </h1>
              <p className="text-sm text-zinc-500">Top MEV Bots Rankings</p>
            </div>
          </div>
        </motion.div>

        {/* ─── Stats Bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 grid grid-cols-3 gap-3 sm:gap-6"
        >
          <StatCard
            icon={<Cube size={12} weight="fill" className="text-gold" />}
            label="Total Bots"
            value={totalBots.toString()}
            delay={0.05}
          />
          <StatCard
            icon={<Clock size={12} weight="fill" className="text-gold" />}
            label="Total Rounds"
            value={totalRounds.toLocaleString()}
            delay={0.1}
          />
          <StatCard
            icon={<Coin size={12} weight="fill" className="text-gold" />}
            label="Rewards Distributed"
            value={totalRewards.toFixed(0) + " ETH"}
            delay={0.15}
          />
        </motion.div>

        {/* ─── Chart Section ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 overflow-hidden rounded-xl border border-border/60 bg-card/30 p-4 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <ChartBar size={16} weight="fill" className="text-gold" />
            <h2 className="text-sm font-semibold text-white">Top 10 Scores</h2>
          </div>
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,48,0.5)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(26,26,48,0.5)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(26,26,48,0.5)" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,20,0.95)",
                    border: "1px solid rgba(26,26,48,0.8)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#e4e4e7",
                  }}
                  cursor={{ fill: "rgba(240,68,68,0.08)" }}
                />
                <Bar
                  dataKey="score"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                  fill="#f04444"
                  opacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ─── Filters ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Strategy filter tabs */}
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...STRATEGIES] as const).map((strat) => (
              <button
                key={strat}
                onClick={() => {
                  setFilterStrategy(strat);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                  filterStrategy === strat
                    ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                    : "bg-surface/50 text-zinc-500 hover:bg-surface hover:text-zinc-300 ring-1 ring-border/50"
                }`}
              >
                {strat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <MagnifyingGlass
              size={14}
              weight="fill"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search bots…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-border/60 bg-surface/50 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-accent/30 focus:bg-surface focus:ring-1 focus:ring-accent/20"
            />
          </div>
        </motion.div>

        {/* ─── Desktop Table ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden overflow-hidden rounded-xl border border-border/60 bg-card/20 lg:block"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-surface/30">
                  <SortableTh label="Rank" column="rank" className="w-14 text-center" />
                  <SortableTh label="Bot Name" column="name" />
                  <SortableTh label="Strategy" column="strategy" />
                  <SortableTh label="Capital" column="capital" className="text-right" />
                  <SortableTh label="Score" column="score" className="text-right" />
                  <SortableTh label="Wins" column="wins" className="text-right" />
                  <SortableTh label="Win Rate" column="winRate" className="text-right" />
                  <SortableTh label="Reward" column="reward" className="text-right" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((bot, idx) => {
                  const absoluteRank = filtered.indexOf(bot) + 1;
                  const isTop3 = absoluteRank <= 3;
                  const isMyBot = bot.id === MY_BOT_ID;

                  return (
                    <tr
                      key={bot.id}
                      className={`group transition-all duration-200 ${
                        isMyBot
                          ? "bg-accent/5 ring-1 ring-inset ring-accent/40"
                          : idx % 2 === 0
                            ? "bg-card/10 hover:bg-card/30"
                            : "bg-transparent hover:bg-card/20"
                      } ${isTop3 ? "relative" : ""}`}
                    >
                      {/* Rank */}
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <RankBadge rank={absoluteRank} />
                        </div>
                      </td>

                      {/* Bot Name */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${
                              isMyBot ? "text-accent" : "text-white"
                            }`}
                          >
                            {bot.name}
                          </span>
                          {isMyBot && (
                            <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-accent">
                              You
                            </span>
                          )}
                          {isTop3 && (
                            <span className="text-[10px] text-zinc-500">
                              #{absoluteRank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Strategy */}
                      <td className="px-3 py-3">
                        <StrategyBadge strategy={bot.strategy} />
                      </td>

                      {/* Capital */}
                      <td className="px-3 py-3 text-right text-sm tabular-nums text-zinc-300">
                        {formatCapital(bot.capital)}
                      </td>

                      {/* Score */}
                      <td className="px-3 py-3 text-right">
                        <span
                          className={`text-sm font-bold tabular-nums ${
                            isTop3
                              ? "text-gold"
                              : "text-white"
                          }`}
                        >
                          {bot.score.toLocaleString()}
                        </span>
                      </td>

                      {/* Wins */}
                      <td className="px-3 py-3 text-right text-sm tabular-nums text-zinc-300">
                        {bot.wins.toLocaleString()}
                      </td>

                      {/* Win Rate */}
                      <td className="px-3 py-3 text-right text-sm tabular-nums text-zinc-300">
                        {winRate(bot.wins, bot.totalRounds)}
                      </td>

                      {/* Reward */}
                      <td className="px-3 py-3 text-right text-sm tabular-nums text-green-400">
                        {formatReward(bot.reward)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {paginated.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
              <MagnifyingGlass size={32} weight="fill" className="mb-3 text-zinc-600" />
              <p className="text-sm">No bots match your search.</p>
            </div>
          )}
        </motion.div>

        {/* ─── Mobile Card View ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 lg:hidden"
        >
          {paginated.map((bot, idx) => {
            const absoluteRank = filtered.indexOf(bot) + 1;
            const isTop3 = absoluteRank <= 3;
            const isMyBot = bot.id === MY_BOT_ID;

            return (
              <div
                key={bot.id}
                className={`relative overflow-hidden rounded-xl border transition-all duration-200 ${
                  isMyBot
                    ? "border-accent/40 bg-accent/5"
                    : isTop3
                      ? "border-gold/20 bg-card/40"
                      : "border-border/60 bg-card/20"
                }`}
              >
                {/* Top row: rank + name + badge */}
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <RankBadge rank={absoluteRank} isMobile />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isMyBot ? "text-accent" : "text-white"
                          }`}
                        >
                          {bot.name}
                        </span>
                        {isMyBot && (
                          <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-accent">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <StrategyBadge strategy={bot.strategy} />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 px-4 py-3 text-sm">
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      Score
                    </span>
                    <p
                      className={`text-base font-bold tabular-nums ${
                        isTop3 ? "text-gold" : "text-white"
                      }`}
                    >
                      {bot.score.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      Capital
                    </span>
                    <p className="text-base font-semibold tabular-nums text-zinc-200">
                      {formatCapital(bot.capital)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      Wins
                    </span>
                    <p className="text-base font-semibold tabular-nums text-zinc-200">
                      {bot.wins.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      Win Rate
                    </span>
                    <p className="text-base font-semibold tabular-nums text-zinc-200">
                      {winRate(bot.wins, bot.totalRounds)}
                    </p>
                  </div>
                </div>

                {/* Reward footer */}
                <div className="flex items-center justify-between border-t border-border/30 px-4 py-2.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                    Reward Earned
                  </span>
                  <span className="text-sm font-bold tabular-nums text-green-400">
                    {formatReward(bot.reward)}
                  </span>
                </div>
              </div>
            );
          })}

          {paginated.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
              <MagnifyingGlass size={32} weight="fill" className="mb-3 text-zinc-600" />
              <p className="text-sm">No bots match your search.</p>
            </div>
          )}
        </motion.div>

        {/* ─── Pagination ─── */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-surface/30 text-xs text-zinc-400 transition-all duration-200 hover:border-accent/30 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <CaretUp size={12} weight="bold" className="-rotate-90" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all duration-200 ${
                  p === safePage
                    ? "border-accent/40 bg-accent/15 text-accent"
                    : "border-border/60 bg-surface/30 text-zinc-500 hover:border-zinc-500/40 hover:text-zinc-300"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-surface/30 text-xs text-zinc-400 transition-all duration-200 hover:border-accent/30 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <CaretDown size={12} weight="bold" className="-rotate-90" />
            </button>
          </motion.div>
        )}

        {/* ─── Footer Note ─── */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-[11px] text-zinc-600">
            <ChartBar size={12} weight="fill" className="text-gold" />
            <span>Leaderboard updates every round</span>
            <ChartBar size={12} weight="fill" className="text-gold" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-Components ─── */

function StatCard({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card/30 px-4 py-3 sm:px-5 sm:py-4"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gold/5 blur-xl" />
      <div className="relative z-10">
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-2xl font-bold text-white sm:text-3xl">{value}</span>
      </div>
    </motion.div>
  );
}
