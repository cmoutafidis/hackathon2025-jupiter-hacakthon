# Novex: AI-Enhanced DeFi Trading Companion for Solana and Ethereum
Entry for OKX Hackathon

## 🚀 Project Summary
Novex is an AI-driven DeFi trading assistant crafted for Solana and Ethereum, aimed at simplifying and enhancing decentralized trading. By harnessing TensorFlow-powered AI, ERC-4337 account abstraction, and integrations with OKX DEX API and Galess Swap API, Novex provides a fluid, efficient, and user-focused trading platform.

Serving as your dedicated DeFi guide, Novex empowers users with sophisticated trading strategies, intelligent portfolio management, and streamlined trade execution with minimal hassle.

## 🎥 Presentation

View our detailed project presentation and documentation [here](https://drive.google.com/drive/folders/1ZC1Bw-bmC6KM3a7ru9DFAeexeno_dUlh?usp=sharing).

## 🌟 Main Features

🤖 AI-Supported TradingTensorFlow models deliver real-time trade entry and exit suggestions based on market patterns.

🔄 Cross-DEX TradingPerform token swaps across multiple decentralized exchanges via OKX DEX API and Galess Swap API for optimal pricing and liquidity.

📊 Portfolio MonitoringGain insights into asset performance, risk metrics, and visual dashboards for better decision-making.

⛽ Gas Fee OptimizationAI-driven strategies reduce transaction costs on both Solana and Ethereum networks.

🧠 Market Mood AnalysisNLP techniques process social media, news, and on-chain data to uncover market trends.

🔗 Cross-Chain FunctionalityTrade effortlessly across Solana and Ethereum, enabled by ERC-4337 for gasless, programmable transactions.

💼 ERC-4337 Smart WalletsSupport for gasless, delegated, and customizable wallet operations.

📱 Accessible InterfaceA sleek, responsive UI tailored for both new and experienced DeFi traders.



## 🏗️ Technical Architecture

### Frontend
- **Framework**: React.js with Tailwind CSS
- **State Management**: Redux for global state
- **UI Components**: Custom components with Material-UI integration

### AI Engine
- **Core**: TensorFlow.js for browser-based inference
- **Models**: 
  - Price prediction using LSTM networks
  - Sentiment analysis with NLP transformers
  - Portfolio optimization algorithms

### Blockchain Integration
#### Solana
- **SDK**: @solana/web3.js v1.xx
- **Features**:
  - High-speed transaction processing
  - Program interaction
  - Account management

#### Ethereum
- **Library**: ethers.js v6.xx
- **Features**:
  - ERC-4337 wallet operations
  - Smart contract interaction
  - Gas optimization

### Data & APIs
- **OKX DEX API**: 
  - Real-time price feeds
  - Order routing optimization
  - Liquidity aggregation
- **Galess Swap API**:
  - Cross-DEX integration
  - Best price discovery
- **Pyth Network**: 
  - Price oracle integration
  - Real-time market data

### Account Abstraction
- **Standard**: ERC-4337 implementation
- **Features**:
  - Gasless transactions
  - Programmable account rules
  - Multi-signature support


📈 Practical Applications

Automated TradingExecute strategies automatically using AI-generated signals.

Arbitrage OpportunitiesCapitalize on price differences across DEXs with OKX and Galess integration.

Dollar-Cost AveragingSchedule gasless purchases to minimize volatility risks.

Flash Loan StrategiesCombine Solana’s speed with Ethereum’s flexibility for advanced flash loans.

Portfolio AdjustmentDynamically rebalance assets based on AI-driven insights.



🔌 OKX DEX API Integration
Novex integrates seamlessly with the OKX DEX API to provide:

Real-time access to aggregated liquidity pools
Optimized swap routing with low slippage
Fast, secure, and data-driven trade execution

This enables high-frequency, AI-powered DeFi strategies with excellent pricing efficiency.

💡 Innovative Elements

Galess Swap API: Enhances liquidity aggregation alongside OKX DEX.
ERC-4337 Abstraction: Facilitates gasless, programmable wallet interactions.
AI-Powered Decisions: Merges TensorFlow insights with real-time data for precise trading.
Cross-Chain Capabilities: Combines Ethereum’s DeFi ecosystem with Solana’s high-speed performance.


## 🛠 Development Setup

### Prerequisites
```bash
Node.js >= 16.x
Yarn or npm
Solana CLI tools
```

### Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/novex.git
cd novex
```

2. Install dependencies
```bash
yarn install # or npm install
```

3. Configure environment
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

4. Start development server
```bash
yarn dev # or npm run dev
```

### Testing
```bash
yarn test # Run unit tests
yarn test:e2e # Run end-to-end tests
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Credits

- **OKX DEX Team**: For their robust API enabling seamless cross-DEX trading
- **Solana Foundation**: For providing a high-performance blockchain for DeFi
- **Galess Swap Team**: For their innovative liquidity aggregation solutions
- **Ethereum Community**: For pioneering ERC-4337 and smart wallet advancements
- **Solana Accelerate Hackathon**: For fostering innovation in cross-chain DeFi

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

