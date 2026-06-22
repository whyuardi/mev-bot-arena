# ⚡ MEV Arena — Gamified MEV Bot Competition Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black)

**Deploy. Compete. Dominate.**  
A real-time gamified simulation platform where MEV bots battle for block rewards.

[🌐 Live Demo](https://mev-bot-arena.vercel.app) · [📄 Smart Contract](./contracts/MEVBotGame.sol) · [🏆 Leaderboard](https://mev-bot-arena.vercel.app/leaderboard)

</div>

---

## 🎮 Overview

MEV Arena is a Web3 hackathon project that gamifies **Maximal Extractable Value (MEV)** strategies. Users deploy virtual MEV bots with different strategies — **Sandwich, Arbitrage, Liquidation, Flash Loan, and Sniper** — and compete in 30-second rounds to capture the highest simulated block rewards.

Built entirely with free tools and testnets. No paid APIs. No real funds at risk.

---

## ✨ Features

### 🏟️ Arena
- **3D Mempool Visualization** — Interactive Three.js scene with floating blocks, particle networks, and orbiting camera
- **Bot Creator** — Deploy customizable bots with configurable strategy, name, and initial capital
- **Real-time Simulation** — 30-second competition rounds with live score updates and transaction feed
- **Rewards System** — Top 3 payout distribution (60/28/12%) with animated prize pool counter

### 🏆 Leaderboard
- **Live Rankings** — Sortable table with 20+ bots showing strategy, score, wins, and rewards
- **Smart Filtering** — Filter by strategy type (All / Sandwich / Arbitrage / Liquidation / Flash Loan / Sniper)
- **Search** — Find bots by name
- **Analytics** — Top 10 bar chart with Recharts visualization

### 📜 Smart Contract
- **`MEVBotGame.sol`** — Solidity ^0.8.20 contract for on-chain bot registration, competition rounds, and reward distribution
- Hardhat test suite with **22/23 tests passing**

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind v4, Motion (Framer Motion v12) |
| **3D Graphics** | Three.js (WebGL, MeshPhysicalMaterial, custom animation loop) |
| **Charts** | Recharts |
| **Icons** | Phosphor Icons (React) |
| **Smart Contract** | Solidity ^0.8.20 |
| **Dev Tools** | Hardhat, ethers.js |
| **Deployment** | Vercel, GitHub |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/whyuardi/mev-bot-arena.git
cd mev-bot-arena

# Install dependencies
npm install

# Build
npm run build

# Start production server
npm start -- -p 3456

# Open
open http://localhost:3456
```

### Development

```bash
# Dev server with hot reload
npm run dev

# Run smart contract tests
npx hardhat test

# Compile contract
npx hardhat compile
```

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout + Header
│   ├── globals.css         # Dark theme + glassmorphism
│   ├── page.tsx            # Landing page (hero, features, CTA)
│   ├── arena/
│   │   └── page.tsx        # Arena (bot creator, 3D viz, simulation)
│   └── leaderboard/
│       └── page.tsx        # Leaderboard (rankings, filters, chart)
├── components/
│   ├── Header.tsx          # Navigation bar + mobile menu
│   ├── BlockViz3D.tsx      # Three.js 3D mempool visualization
│   ├── BotCreator.tsx      # Bot deployment form
│   ├── SimulationPanel.tsx # Round simulation + transaction log
│   └── ScoreDisplay.tsx    # Prize pool + rewards breakdown

contracts/
└── MEVBotGame.sol          # Solidity smart contract

contracts/test/
└── MEVBotGame.test.js      # Hardhat test suite
```

---

## 📸 Screenshots

| Page | Preview |
|------|---------|
| **Landing** | Hero with stats bar, features grid, CTAs |
| **Arena** | 3D block viz, bot creator, simulation panel, leaderboard, rewards |
| **Leaderboard** | Rankings table, strategy filters, bar chart |

> *Open the [live demo](https://mev-bot-arena.vercel.app) to see the 3D effects in your browser (WebGL required).*

---

## 🔥 Why This Stands Out

| Factor | Detail |
|--------|--------|
| **Uniqueness** | Gamified MEV simulation — educational + fun + technically deep |
| **Technical Depth** | Three.js 3D rendering + Solidity smart contract + interactive real-time UI |
| **Judge Appeal** | Immediate visual wow factor (3D blocks), clear problem framing, working demo |
| **Zero Cost** | All free tools, testnet-only, no paid APIs |
| **Full Stack** | Frontend (Next.js + Three.js) + Backend (Smart Contract + Hardhat) |

---

## 📄 License

MIT © [Ardhiansyah Wahyu Setyadi](https://github.com/whyuardi)

---

<div align="center">
Made with ⚡ for daily hackathon challenge  
[Live Demo](https://mev-bot-arena.vercel.app) · [GitHub](https://github.com/whyuardi/mev-bot-arena) · [Portfolio](https://ar-portfolio-dusky.vercel.app)
</div>
