# OKW - OKX Web3 Wallet Mobile Replica & Simulator

A high-fidelity 1:1 pixel-perfect mobile web replica of the OKX Web3 Wallet interface. Built using **React**, **Tailwind CSS (v4)**, and **Lucide React** for icons, and packaged for mobile devices with **CapacitorJS**.

## 🌟 Key Features

1. **Dashboard Tab (OKX)**
   - 1:1 pixel-perfect header, search input, actions grid, and asset listing.
   - Dynamic 1D profit/loss change calculation in USD and percentage based on holdings.
   - **Rich / Empty State Toggle**: Easily switch between `$0.00` and `$28,754,470.28` (Hedge Fund balance) configurations via a button in the profile section.
   - Floating `"Manage crypto"` button and clean bottom details card.

2. **Explore Tab**
   - Header with custom action icons.
   - **Hot Categories**: 3x2 grid of cards featuring live neon-green mini-sparkline trend graphs.
   - **Meme Coins List**: Trending assets (Jotchua, SPCX, WORLDCUP, U) complete with exact metadata (market caps, volumes, badges).

3. **Boost Tab**
   - APY boost listings for BILL, SLX, and RIVER.
   - **X Campaign Banner**: Glowing glassmorphic banner featuring a premium cyan-teal gradient overlay, interactive "Join" button, and slider dot paging.

4. **Tracker Tab (Trading Simulator)**
   - **Overview**: SVG Donut Chart dynamically plotting asset allocations (BTC, ETH, SOL, BNB, OKB, etc.) based on active balances.
   - **Markets (Trade Engine)**: Live price fluctuations (+/- 3%) with **Buy / Sell execution sheets**. Trading directly updates the global wallet asset quantities, total dollar balance, and profit/loss in the OKX tab.
   - **Watchlist**: Star assets to add/remove from monitoring.
   - **Alerts**: Set alert prices (go above/below) for assets and receive live push notifications when simulated prices trigger the criteria.

---

## 🛠️ Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (v4)
- **Icons**: Lucide React
- **Mobile Wrapper**: CapacitorJS (Android)
- **Development JDK**: Java 21 (Eclipse Adoptium Temurin)
- **Compiler**: Gradle (8.14.3 wrapper)

---

## 🚀 Getting Started

### 1. Installation

Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Run Locally (Web Preview)

Start the Vite development server:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser. Toggle responsive/mobile view (Chrome DevTools: `Ctrl+Shift+I` -> `Ctrl+Shift+M`) to see the native fullscreen mobile experience.

### 3. Build & Packaging APK (Command Line)

To compile the native Android application `.apk` file without opening Android Studio:

Make sure you have:
- **Android SDK** installed.
- **Java 21 (JDK)** set up. (The project configuration automatically uses Java 21 from `gradle.properties`).

Run the automated compilation command:
```bash
npm run cap:apk
```
This script will:
- Rebuild the production web assets.
- Sync them into the Capacitor Android container folder.
- Execute Gradle wrapper to compile the APK.
- Place the finalized **`OKW.apk`** file at the root of the workspace directory.

Copy **`OKW.apk`** to any Android phone and open it to install!
