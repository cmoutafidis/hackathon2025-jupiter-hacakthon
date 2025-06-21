# Novex - Your AI-Powered DeFi Dashboard on Solana

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com/)
[![Jupiter](https://img.shields.io/badge/Jupiter-FE6600?style=for-the-badge&logo=jupiter&logoColor=white)](https://jup.ag/)

**Novex** is a powerful, feature-rich DeFi dashboard built on Solana, created for the **Namaste Jupiverse – Hackathon Edition**. It leverages the Jupiter Exchange APIs to provide a seamless and intelligent experience for both new and experienced crypto users.

## 🚀 Key Features

- **🤖 AI-Powered DeFi Assistant**: An integrated AI chat assistant to guide you through DeFi, answer questions, and help you make informed decisions.
- **🔄 Universal Token Swaps**: Access deep liquidity and find the best rates for token swaps using Jupiter's advanced aggregation engine.
- **🌉 Cross-Chain Swaps**: Effortlessly bridge your assets across different blockchains.
- **📊 Comprehensive Portfolio Management**: Track your token balances, view transaction history, and analyze the value of your assets in one place.
- **🔐 Secure Wallet Integration**: Connect your Solana wallet securely to manage your assets.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Blockchain**: [Solana](https://solana.com/)
- **DeFi Aggregator**: [Jupiter Exchange APIs](https://jup.ag/)
- **UI Components**: Custom-built with React (structure suggests influence from [shadcn/ui](https://ui.shadcn.com/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 📂 Project Structure

The project is organized following modern web development practices:

```
/
├── app/
│   ├── api/          # Backend API routes for DeFi interactions
│   ├── dashboard/    # Main application pages (Swap, Portfolio, AI Chat)
│   └── layout.tsx    # Main layout for the application
├── components/
│   ├── ui/           # Reusable UI components (buttons, cards, etc.)
│   └── ...           # Other React components
├── contexts/         # React contexts (e.g., WalletContext)
├── lib/              # Utility functions
└── ...
```

## 🏃‍♂️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, pnpm, or bun

### Installation

1.  Clone the repo
    ```sh
    git clone 
    git clone https://github.com/0xkid-root/jupiter-hacakthon
    ```
2.  Navigate to the frontend directory
    ```sh
    cd frontend
    ```
3.  Install NPM packages
    ```sh
    npm install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ✨ About the Jupiter Hackathon

This project is an entry for the **Namaste Jupiverse – Hackathon Edition** in Hyderabad. It's a 1-day, high-intensity builder jam powered by Jupiter Exchange, focused on exploring bleeding-edge APIs and innovating in Web3 & DeFi.

- **Learn more about Jupiter**: [jup.ag](https://jup.ag/)
- **Hackathon Socials**: [Telegram](https://t.me/JupIndia), [X/Twitter](https://x.com/jup_ind)