"use client";

import { useState, useCallback } from "react";
import { Lightning, Sword, Cube, Clock, Coin } from "@phosphor-icons/react";
import { motion } from "motion/react";

import BlockViz3D from "@/components/BlockViz3D";
import BotCreator from "@/components/BotCreator";
import SimulationPanel from "@/components/SimulationPanel";
import ScoreDisplay from "@/components/ScoreDisplay";
import type { BotConfig } from "@/components/BotCreator";

export default function ArenaPage() {
  const [deployedBots, setDeployedBots] = useState<BotConfig[]>([]);
  const [activeCount] = useState(5);
  const [currentRound] = useState(1);
  const [prizePool] = useState(12.5);

  const handleDeploy = useCallback((config: BotConfig) => {
    setDeployedBots((prev) => [...prev, config]);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none fixed -left-80 top-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/5 blur-[150px]" />
      <div className="pointer-events-none fixed -right-80 bottom-1/4 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-accent/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── Hero Heading ─── */}
        <div className="mb-8 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/5">
              <Sword size={22} weight="fill" className="text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                MEV <span className="text-accent">Arena</span>
              </h1>
              <p className="text-sm text-zinc-500">
                Deploy, compete, and dominate the mempool
              </p>
            </div>
          </div>
        </div>

        {/* ─── Stats Bar ─── */}
        <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="relative overflow-hidden rounded-xl border border-border/60 bg-card/30 px-4 py-3 sm:px-5 sm:py-4"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-accent/5 blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1">
                <Cube size={12} weight="fill" className="text-accent" />
                <span>Active Bots</span>
              </div>
              <span className="text-2xl font-bold text-white sm:text-3xl">
                {activeCount + deployedBots.length}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-xl border border-border/60 bg-card/30 px-4 py-3 sm:px-5 sm:py-4"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-accent/5 blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1">
                <Clock size={12} weight="fill" className="text-accent" />
                <span>Current Round</span>
              </div>
              <span className="text-2xl font-bold text-white sm:text-3xl">
                #{currentRound}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden rounded-xl border border-border/60 bg-card/30 px-4 py-3 sm:px-5 sm:py-4"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-accent/5 blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1">
                <Coin size={12} weight="fill" className="text-accent" />
                <span>Prize Pool</span>
              </div>
              <span className="text-2xl font-bold text-white sm:text-3xl">
                {prizePool}{" "}
                <span className="text-sm font-medium text-accent">ETH</span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* ─── Two-Column Layout ─── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: 3D Viz + Bot Creator */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <BlockViz3D />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <BotCreator onDeploy={handleDeploy} />
            </motion.div>
          </div>

          {/* Right Column: Simulation Panel + Score Display */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <SimulationPanel deployedBots={deployedBots} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <ScoreDisplay roundNumber={currentRound} />
            </motion.div>
          </div>
        </div>

        {/* ─── Footer Note ─── */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-[11px] text-zinc-600">
            <Lightning size={12} weight="fill" className="text-accent" />
            <span>All simulations run on a local testnet — no real funds at risk</span>
            <Lightning size={12} weight="fill" className="text-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
