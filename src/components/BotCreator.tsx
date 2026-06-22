"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import {
  Robot,
  CoinVertical,
  CaretDown,
  FloppyDisk,
  CheckCircle,
} from "@phosphor-icons/react";

const STRATEGIES = [
  "Sandwich",
  "Arbitrage",
  "Liquidation",
  "Flash Loan",
  "Sniper",
] as const;

export type StrategyType = (typeof STRATEGIES)[number];

export interface BotConfig {
  name: string;
  strategy: StrategyType;
  capital: number;
}

interface Props {
  onDeploy?: (config: BotConfig) => void;
}

export default function BotCreator({ onDeploy }: Props) {
  const [name, setName] = useState("");
  const [strategy, setStrategy] = useState<StrategyType>("Arbitrage");
  const [capital, setCapital] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [strategyOpen, setStrategyOpen] = useState(false);

  const handleDeploy = useCallback(() => {
    if (!name.trim()) return;
    setLoading(true);

    // Simulate deployment delay
    setTimeout(() => {
      setLoading(false);
      setDeployed(true);
      onDeploy?.({ name: name.trim(), strategy, capital });

      // Reset after 2 seconds
      setTimeout(() => {
        setDeployed(false);
        setName("");
        setCapital(1);
        setStrategy("Arbitrage");
      }, 2000);
    }, 1500);
  }, [name, strategy, capital, onDeploy]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm p-5 sm:p-6">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <Robot size={16} weight="fill" className="text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Deploy Bot</h3>
            <p className="text-[11px] text-zinc-500">
              Configure your MEV strategy
            </p>
          </div>
        </div>

        {/* Bot Name */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Bot Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. FlashGorilla"
            className="w-full rounded-lg border border-border/80 bg-surface/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-accent/50 focus:shadow-[0_0_12px_rgba(240,68,68,0.1)]"
            disabled={loading || deployed}
          />
        </div>

        {/* Strategy Type */}
        <div className="mb-4 relative">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Strategy Type
          </label>
          <button
            onClick={() => setStrategyOpen(!strategyOpen)}
            disabled={loading || deployed}
            className="flex w-full items-center justify-between rounded-lg border border-border/80 bg-surface/50 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-200 hover:border-accent/30"
          >
            <span>{strategy}</span>
            <CaretDown
              size={14}
              className={`text-zinc-500 transition-transform duration-200 ${
                strategyOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {strategyOpen && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
              {STRATEGIES.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStrategy(s);
                    setStrategyOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-accent/10 hover:text-white ${
                    strategy === s
                      ? "bg-accent/10 text-accent"
                      : "text-zinc-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Initial Capital */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Initial Capital
            </label>
            <span className="flex items-center gap-1 text-sm font-semibold text-white">
              <CoinVertical size={14} className="text-accent" />
              {capital.toFixed(1)} ETH
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={10}
            step={0.1}
            value={capital}
            onChange={(e) => setCapital(parseFloat(e.target.value))}
            disabled={loading || deployed}
            className="w-full h-1.5 appearance-none rounded-full bg-border outline-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-accent
              [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(240,68,68,0.4)]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-accent
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(240,68,68,0.4)]"
          />
          <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
            <span>0.1 ETH</span>
            <span>10 ETH</span>
          </div>
        </div>

        {/* Deploy Button */}
        <motion.button
          onClick={handleDeploy}
          disabled={loading || deployed || !name.trim()}
          whileTap={{ scale: 0.97 }}
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${
            deployed
              ? "bg-green/20 text-green border border-green/30"
              : loading
                ? "bg-accent/20 text-accent border border-accent/30 cursor-wait"
                : "bg-accent text-white hover:bg-accent/90 glow-accent hover:shadow-[0_0_20px_rgba(240,68,68,0.3)]"
          } ${!name.trim() && !loading && !deployed ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {deployed ? (
            <>
              <CheckCircle size={16} weight="fill" />
              Deployed Successfully
            </>
          ) : loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Deploying...
            </>
          ) : (
            <>
              <FloppyDisk size={16} weight="fill" />
              Deploy Bot
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
