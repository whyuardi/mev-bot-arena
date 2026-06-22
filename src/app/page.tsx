"use client";

import Link from "next/link";
import {
  Lightning,
  Rocket,
  Trophy,
  Strategy,
  ChartBar,
  CubeFocus,
  ShieldCheck,
  Code,
  ArrowRight,
} from "@phosphor-icons/react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ─── Hero Section ─── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        {/* Radial glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

        <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-accent">
            <Lightning size={14} weight="fill" />
            MEV Competition Platform
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-white">Compete.</span>{" "}
            <span className="text-gradient">Capture.</span>{" "}
            <br />
            <span className="text-white">Dominate.</span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            The ultimate arena for MEV bot warfare. Deploy your strategy, battle
            against top competitors in real-time simulations, and claim your
            share of the rewards.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/arena"
              className="group inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent/90 glow-accent"
            >
              Start Competing
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <button className="inline-flex h-12 items-center gap-2 rounded-lg border border-border bg-surface/50 px-6 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-accent/30 hover:bg-accent/5 hover:text-white">
              <Code size={18} />
              Learn MEV
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-zinc-600">
            <span className="text-xs font-medium uppercase tracking-widest">
              Scroll
            </span>
            <div className="h-8 w-5 rounded-full border border-zinc-700 flex items-start justify-center pt-1">
              <div className="h-2 w-1 rounded-full bg-zinc-500 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <StatCard value="1,247" label="Bots Deployed" />
            <StatCard value="3,892" label="Rounds Played" />
            <StatCard value="$45K+" label="Rewards Paid" />
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How It <span className="text-accent">Works</span>
            </h2>
            <p className="mx-auto max-w-xl text-zinc-400">
              Three simple steps to start competing in the MEV arena
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              step="01"
              icon={<Rocket size={28} weight="fill" />}
              title="Deploy Bot"
              description="Write or configure your MEV bot strategy using our SDK. Choose from templates or build from scratch."
            />
            <StepCard
              step="02"
              icon={<Strategy size={28} weight="fill" />}
              title="Compete in Rounds"
              description="Your bot goes head-to-head in real-time simulated environments. Watch strategies clash."
            />
            <StepCard
              step="03"
              icon={<Trophy size={28} weight="fill" />}
              title="Earn Rewards"
              description="Top performers earn rewards from the prize pool. Climb the leaderboard for bigger payouts."
            />
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for{" "}
              <span className="text-accent">Competition</span>
            </h2>
            <p className="mx-auto max-w-xl text-zinc-400">
              Everything you need to build, test, and deploy competitive MEV
              strategies
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Lightning size={24} weight="fill" />}
              title="Real-time Simulation"
              description="Watch your bot execute strategies in a realistic, low-latency simulated blockchain environment."
            />
            <FeatureCard
              icon={<Strategy size={24} weight="fill" />}
              title="Strategy Builder"
              description="Drag-and-drop editor to compose complex MEV strategies without writing a single line of code."
            />
            <FeatureCard
              icon={<ChartBar size={24} weight="fill" />}
              title="Live Leaderboard"
              description="Real-time rankings updated after every round. Track your performance against the best."
            />
            <FeatureCard
              icon={<CubeFocus size={24} weight="fill" />}
              title="3D Block Explorer"
              description="Visualize mempool dynamics and transaction ordering in an immersive 3D environment."
            />
            <FeatureCard
              icon={<ShieldCheck size={24} weight="fill" />}
              title="Testnet Safe"
              description="All competitions run on testnet simulations. No real funds at risk while you learn and compete."
            />
            <FeatureCard
              icon={<Code size={24} weight="fill" />}
              title="Open Source"
              description="Full platform source available. Audit, fork, and contribute to the future of MEV competition."
            />
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative overflow-hidden border-y border-border/60 py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to{" "}
            <span className="text-accent">Dominate</span> the Arena?
          </h2>
          <p className="mb-10 mx-auto max-w-xl text-lg text-zinc-400">
            Join hundreds of MEV strategists. Deploy your first bot and start
            climbing the ranks today.
          </p>
          <Link
            href="/arena"
            className="group inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent/90 glow-accent"
          >
            Enter the Arena
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                  <Lightning size={18} weight="fill" className="text-accent" />
                </div>
                <span className="text-base font-bold text-white">
                  MEV <span className="text-accent">Arena</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-zinc-500">
                The premier platform for MEV bot competition and strategy
                development.
              </p>
            </div>

            {/* Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Platform
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/arena"
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    Arena
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    SDK & Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Community
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    Discord
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    Twitter / X
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-border/40 pt-6 text-center">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} MEV Arena. Built for the
              community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-Components ─── */

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {value}
      </span>
      <span className="text-sm font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </span>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-xl border border-border/60 bg-card/50 p-6 transition-all duration-300 hover:border-accent/20 hover:bg-card">
      <span className="mb-4 block text-4xl font-black text-zinc-700/50">
        {step}
      </span>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-border/60 bg-card/30 p-6 transition-all duration-300 hover:border-accent/20 hover:bg-card hover:shadow-[0_0_30px_rgba(240,68,68,0.05)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}
