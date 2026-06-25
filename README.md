```text
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ███╗   ███╗███████╗██╗   ██╗     █████╗ ██████╗ ███████╗ ║
║    ████╗ ████║██╔════╝██║   ██║    ██╔══██╗██╔══██╗██╔════╝ ║
║    ██╔████╔██║█████╗  ██║   ██║    ███████║██████╔╝█████╗   ║
║    ██║╚██╔╝██║██╔══╝  ╚██╗ ██╔╝    ██╔══██║██╔══██╗██╔══╝   ║
║    ██║ ╚═╝ ██║███████╗ ╚████╔╝     ██║  ██║██║  ██║███████╗ ║
║    ╚═╝     ╚═╝╚══════╝  ╚═══╝      ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ║
║                                                              ║
║    ██████╗  ██████╗ ████████╗     █████╗ ██████╗ ███████╗   ║
║    ██╔══██╗██╔═══██╗╚══██╔══╝    ██╔══██╗██╔══██╗██╔════╝   ║
║    ██████╔╝██║   ██║   ██║       ███████║██████╔╝█████╗     ║
║    ██╔══██╗██║   ██║   ██║       ██╔══██║██╔══██╗██╔══╝     ║
║    ██║  ██║╚██████╔╝   ██║       ██║  ██║██║  ██║███████╗   ║
║    ╚═╝  ╚═╝ ╚═════╝    ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ║
║                                                              ║
║    ╔══════════════════════════════════════════════════════╗   ║
║    ║     GAMIFIED MEV BOT COMPETITION PLATFORM         ║   ║
║    ║     ⚡ DEPLOY · COMPETE · DOMINATE ⚡              ║   ║
║    ╚══════════════════════════════════════════════════════╝   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

<div align="center">

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-FF0000?style=for-the-badge&logo=vercel&logoColor=white&labelColor=black)](https://mev-bot-arena.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript 5](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org)
[![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black)](https://hardhat.org)
[![Ethers](https://img.shields.io/badge/ethers.js-2535A0?style=for-the-badge&logo=ethereum&logoColor=white)](https://docs.ethers.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4E5EE4?style=for-the-badge&logo=openzeppelin&logoColor=white)](https://www.openzeppelin.com/contracts)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![MIT License](https://img.shields.io/badge/License-MIT-00FF88?style=for-the-badge)](LICENSE)

**Deploy. Compete. Dominate.**  
A real-time gamified simulation platform where MEV bots battle for block rewards.

[🌐 Live Demo](https://mev-bot-arena.vercel.app) · [📄 Smart Contract](./contracts/MEVBotGame.sol) · [🏆 Leaderboard](https://mev-bot-arena.vercel.app/leaderboard) · [⚔️ Arena](https://mev-bot-arena.vercel.app/arena)

</div>

---

## 🎮 Overview

**MEV Arena** is a gamified competition platform where players deploy virtual **Maximal Extractable Value (MEV)** bots and battle in real-time simulated rounds. Choose from five distinct strategies — **Sandwich**, **Arbitrage**, **Liquidation**, **Flash Loan**, and **Sniper** — configure your bot's capital, and watch it compete in a 3D-rendered mempool environment.

Every round runs for **30 seconds** with live scoring, a real-time transaction feed, and a prize pool that rewards the top 3 bots. Built entirely with free tools and testnets — **no paid APIs, no real funds at risk.**

---

## ✨ Features

### 🏟️ Arena

- **3D Mempool Visualization** — Immersive Three.js scene with floating colored blocks, dynamic particle networks, and an auto-orbiting camera. Watch transactions bubble through the mempool in real time.
- **Bot Creator** — Deploy a custom MEV bot with configurable name, one of 5 strategy types, and a capital slider (0.1–10 ETH). Instant deployment with wallet integration.
- **Real-time Simulation** — 30-second competition rounds with live score updates, a scrolling transaction feed (sandwiches, arbitrages, liquidations, flash loans, snipes), and auto-generated mock bots to compete against.
- **Rewards System** — Prize pool starts at **12.5 ETH** per round with animated counter. Top 3 payout: **7.5 ETH** 🥇 / **3.5 ETH** 🥈 / **1.5 ETH** 🥉 (60/28/12%).

### 🏆 Leaderboard

- **Live Rankings** — Sortable table displaying 20+ bots with columns for rank, name, strategy, capital, score, wins, win rate, and rewards. Gold/silver/bronze medal badges for the podium.
- **Smart Filtering** — Filter by strategy type with pill-style toggle buttons (All / Sandwich / Arbitrage / Liquidation / Flash Loan / Sniper).
- **Search** — Find any bot by name with instant client-side filtering.
- **Analytics** — Top 10 scores visualized as a **Recharts bar chart** with dark-themed tooltips and custom styling.
- **Pagination** — 10 bots per page with smart page tracking.

### 🔌 Wallet Integration

- **MetaMask** integration via ethers.js `BrowserProvider`
- **Chain detection** — automatically detects and prompts network switch
- Displays address, balance, and chain name
- Supports all **10+ EVM chains** available in MetaMask

### 📊 Landing Page

- **Hero Section** — Bold typography ("Compete. Capture. Dominate."), gradient text effects, radial glow, animated scroll indicator, and dual CTAs
- **Stats Bar** — Live counters showing **1,247 bots** deployed, **3,892 rounds** played, **$45K+** rewards paid
- **How It Works** — 3-step walkthrough (Deploy Bot → Compete in Rounds → Earn Rewards) with Phosphor icons
- **Feature Cards** — 6-card grid highlighting simulation, strategy builder, leaderboard, 3D explorer, testnet safety, and open-source nature

### 💅 Design

- **Dark cyberpunk theme** with glassmorphism cards (`bg-card/30 backdrop-blur-sm`), animated border accents, and subtle grid overlays
- **Responsive** — fully adaptive layout from mobile to ultrawide
- **Motion design** — framer-motion powered staggered animations on every page
- **Phosphor Icons** — consistent iconography across the entire platform

---

## 📸 Screenshots

| Section | Preview |
|---------|---------|
| **🏠 Landing Hero** | Bold headline with gradient text, MEV badge, dual CTAs, and animated scroll indicator |
| **📊 Stats Bar** | Three-column counter display (1,247 bots · 3,892 rounds · $45K+ rewards) |
| **❓ How It Works** | 3-step horizontal layout with step numbers, icons, and descriptions |
| **⚡ Feature Grid** | 6-card responsive grid with Phosphor icons and hover glow effects |
| **⚔️ Arena** | 3D Three.js mempool visualization with floating colored blocks and particle network |
| **🤖 Bot Creator** | Strategy dropdown (5 types), bot name input, capital slider (0.1–10 ETH), deploy button |
| **🎮 Simulation Panel** | Live scoreboard with rank/name/score, real-time transaction feed with type-coded icons, start/stop controls |
| **💰 Score Display** | Animated prize pool counter (12.5 ETH), podium breakdown (7.5 / 3.5 / 1.5 ETH), top 3 score list |
| **🏆 Leaderboard** | Sortable table with strategy badges, medal icons, search bar, and strategy filter pills |
| **📈 Leaderboard Chart** | Recharts bar chart showing top 10 bot scores with dark tooltip theming |

> *Open the [live demo](https://mev-bot-arena.vercel.app) to experience the 3D effects in your browser (WebGL required).*

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.2.9 (App Router) |
| **UI Library** | React 19.2.4, React DOM 19.2.4 |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS v4, PostCSS |
| **3D Graphics** | Three.js 0.184.0, @types/three 0.184.1 |
| **Animation** | Motion (framer-motion) 12.40.0 |
| **Charts** | Recharts 3.8.1 |
| **Icons** | @phosphor-icons/react 2.1.10 |
| **Blockchain** | ethers.js 6.17.0 |
| **Smart Contract** | Solidity ^0.8.20, OpenZeppelin 5.6.x |
| **Dev Tools** | Hardhat 3.9.0, Hardhat Toolbox, Mocha, Chai |
| **Testing** | Playwright 1.61.x |
| **Linting** | ESLint 9.x, eslint-config-next |
| **Deployment** | Vercel, .vercel config |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MetaMask** browser extension (for wallet features)
- **WebGL-compatible browser** (for 3D visualization)

### Installation

```bash
# Clone the repository
git clone https://github.com/whyuardi/mev-bot-arena.git
cd mev-bot-arena

# Install dependencies
npm install

# Build for production
npm run build

# Start production server (port 3456)
npm start -- -p 3456

# Open in browser
open http://localhost:3456
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Run ESLint
npm run lint
```

### Smart Contract

```bash
# Compile the Solidity contract
npx hardhat compile

# Run the test suite (22/23 tests passing)
npx hardhat test

# Run tests for a specific file
npx hardhat test contracts/test/MEVBotGame.test.js
```

---

## 📜 Smart Contract

The core competition logic lives in [`contracts/MEVBotGame.sol`](./contracts/MEVBotGame.sol) — a **Solidity ^0.8.20** contract built with **OpenZeppelin's Ownable** and **ReentrancyGuard**.

### Architecture

```
MEVBotGame (Ownable, ReentrancyGuard)
├── Registration: registerBot, deactivateBot
├── Round Management: startRound, endRound (owner only)
├── Competition: submitAttempt (payable, nonReentrant)
├── Rewards: distributeRewards (owner only, nonReentrant)
├── Internal: _calculateScores (bubble sort)
└── Views: getPlayerBots, getRoundLeaders, getRoundStatus, isBotActive, getContractBalance
```

### Strategy Types

| Enum Value | Description |
|------------|-------------|
| `Sandwich` | Front-run + back-run trades around a target transaction |
| `Arbitrage` | Exploit price differences across DEX pairs |
| `Liquidation` | Trigger liquidations on undercollateralized positions |
| `FlashLoan` | Execute uncollateralized loans within a single transaction |
| `Unknown` | Custom / experimental strategies |

### Round Lifecycle

1. **Registration** — Players register bots with a name and strategy type
2. **Round Start** — Owner starts a round with a configurable duration (max 7 days)
3. **Competition** — Bots submit MEV attempts; higher `msg.value` = higher score (simulating gas costs for aggressive MEV extraction)
4. **Round End** — Owner ends the round; scores are calculated via bubble sort
5. **Reward Distribution** — Top 3 bots earn rewards: **50% / 30% / 20%** of the prize pool

### Key Constants

```solidity
MAX_ROUND_DURATION = 7 days
MIN_BOTS_PER_ROUND = 2
TOP_BOTS_REWARDED = 3
```

### Test Suite

The Hardhat test suite covers:

- Bot registration (valid names, name length limits, duplicate checks)
- Round lifecycle (start, end, status transitions)
- Competition mechanics (submit attempts, score tracking, participant tracking)
- Owner-only access controls
- Edge cases (insufficient participants, inactive bots, invalid round states)

**22/23 tests passing** ✅

---

## 🏗️ Project Structure

```
mev-bot-arena/
├── src/
│   ├── app/
│   │   ├── fonts/
│   │   │   ├── GeistVF.woff2
│   │   │   └── GeistMonoVF.woff2
│   │   ├── favicon.ico
│   │   ├── globals.css          # Dark theme, glassmorphism, custom properties
│   │   ├── layout.tsx           # Root layout + Header + Providers
│   │   ├── page.tsx             # Landing page (hero, stats, features, CTA, footer)
│   │   ├── arena/
│   │   │   └── page.tsx         # Arena (3D viz, bot creator, simulation, scores)
│   │   └── leaderboard/
│   │       └── page.tsx         # Leaderboard (rankings, filters, chart, pagination)
│   ├── components/
│   │   ├── Header.tsx           # Navigation bar with mobile menu
│   │   ├── Providers.tsx        # Client-side providers (wallet, etc.)
│   │   ├── WalletConnect.tsx    # MetaMask integration (connect, chain, balance)
│   │   ├── BlockViz3D.tsx       # Three.js 3D mempool visualization
│   │   ├── BotCreator.tsx       # Bot deployment form (name, strategy, capital)
│   │   ├── SimulationPanel.tsx  # Round simulation + live transaction feed
│   │   └── ScoreDisplay.tsx     # Prize pool + podium rewards breakdown
│   └── ...config files
├── contracts/
│   ├── MEVBotGame.sol           # Solidity smart contract (400 lines)
│   └── test/
│       └── MEVBotGame.test.js   # Hardhat test suite (23 tests)
├── artifacts/                   # Compiled contract artifacts
├── cache/                       # Hardhat cache
├── public/                      # Static assets
├── types/                       # TypeScript type declarations
├── .vercel/                     # Vercel deployment config
├── hardhat.config.js            # Hardhat configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── eslint.config.mjs            # ESLint flat config
├── package.json                 # Dependencies and scripts
└── README.md                    # You are here 🎯
```

---

## 🔥 Why This Stands Out

| Factor | Detail |
|--------|--------|
| **🎯 Uniqueness** | Gamified MEV simulation — educational, fun, and technically deep, all in one platform |
| **⚡ Technical Depth** | Three.js 3D rendering + Solidity smart contract with OpenZeppelin security + interactive real-time UI |
| **👀 Visual Wow Factor** | Floating 3D mempool blocks, particle networks, animated prize counters, glassmorphism design |
| **🛡️ Production Quality** | Hardhat test suite (22/23 passing), ReentrancyGuard, Ownable, typed errors |
| **💰 Zero Cost** | All free tools, testnet-only simulation, no paid APIs required |
| **📐 Full Stack** | Frontend (Next.js + Three.js + Recharts) + Backend (Solidity + Hardhat + ethers.js) |
| **🎨 Design System** | Consistent dark cyberpunk aesthetic, Phosphor icons, framer-motion animations, responsive layout |
| **🧪 Tested** | 23 Hardhat tests covering registration, rounds, competition, access control, and edge cases |

---

## 🤝 Contributing

Contributions are welcome! Whether it's:

- 🐛 Reporting a bug
- 💡 Suggesting a feature (new strategy types, chains, visual effects)
- 🔧 Submitting a pull request
- 📝 Improving documentation

Please open an [issue](https://github.com/whyuardi/mev-bot-arena/issues) or [pull request](https://github.com/whyuardi/mev-bot-arena/pulls).

---

## 📄 License

**MIT License** © [Ardhiansyah Wahyu Setyadi](https://github.com/whyuardi)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

---

<div align="center">

**⚡ MEV Arena — Gamified MEV Bot Competition ⚡**

[🌐 Live Demo](https://mev-bot-arena.vercel.app) · [📦 GitHub](https://github.com/whyuardi/mev-bot-arena) · [👤 Portfolio](https://ar-portfolio-dusky.vercel.app)

Made with ⚡ for the daily hackathon challenge

</div>
