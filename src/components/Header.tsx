"use client";

import Link from "next/link";
import { Lightning, List, X } from "@phosphor-icons/react";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20 transition-all duration-300 group-hover:bg-accent/20 group-hover:ring-accent/40">
            <Lightning
              size={20}
              weight="fill"
              className="text-accent"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            MEV <span className="text-accent">Arena</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/arena"
            className="text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-white"
          >
            Arena
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-white"
          >
            Leaderboard
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-white"
          >
            Docs
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <button className="rounded-lg border border-border bg-surface/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-white">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
              Connect Wallet
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center rounded-lg p-2 text-zinc-400 transition-colors hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border/60 glass md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            <Link
              href="/arena"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-accent/5 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Arena
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-accent/5 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Leaderboard
            </Link>
            <Link
              href="#"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-accent/5 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Docs
            </Link>
            <div className="mt-2 border-t border-border/40 pt-2">
              <button className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface/50 px-3 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-accent/30 hover:bg-accent/5 hover:text-white">
                <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
                Connect Wallet
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
