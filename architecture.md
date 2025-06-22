# Novex System Architecture

This document outlines the technical architecture of the Novex platform, a social trading application built on the Solana blockchain. It details the frontend and backend components, their interactions, and the core functionalities that power the user experience.

## 1. High-Level Overview

Novex is a full-stack application composed of a **Next.js frontend** and a **Node.js/Express backend**. This architecture was chosen to enable rapid development, seamless server-side rendering for performance and SEO, and a robust, scalable backend to handle blockchain interactions and business logic.

- **Frontend**: A modern, responsive user interface built with React, Next.js, and Tailwind CSS. It communicates with both the Novex backend and directly with the Solana blockchain via the user's wallet.
- **Backend**: A dedicated API layer built with Node.js and Express. It serves as a secure and efficient proxy to the Jupiter Swap API, abstracting away its complexity from the frontend.
- **Solana Blockchain**: The core decentralized ledger for all trading and token-related activities.
- **Jupiter API**: A powerful service for sourcing the best swap routes and executing trades on Solana.
- **Google Gemini AI**: A generative AI model used to provide users with trading insights and analysis.

---

## 2. Frontend Architecture

The frontend is a [Next.js](https://nextjs.org/) application located in the `frontend/` directory. It is responsible for rendering the user interface and managing all client-side interactions.

### Key Technologies:

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext`) and the `WalletContext` for managing wallet connection state.
- **Animations**: [Framer Motion](httpss://www.framer.com/motion/) for a fluid and engaging user experience.
- **API Communication**: `axios` and the native `fetch` API for making requests to the backend.

### Core Components & Features:

- **Dashboard (`/dashboard`)**: The main user hub, providing access to all key features.
  - **Swap (`/swap`)**: A real-time token swapping interface powered by the Jupiter API. It allows users to get quotes and execute trades securely through their connected wallet.
  - **Social Feed (`/social-feed`)**: A dynamic feed displaying market trends, AI-driven insights, and community trading activity.
  - **AI Chat (`/ai-chat`)**: An intelligent trading assistant powered by Google's Gemini AI. The `Novex2Agent` processes real-time market data from the Jupiter API and provides users with actionable trading strategies, predictions, and risk management advice.
- **Wallet Integration (`/contexts/WalletContext.tsx`)**: Securely manages the user's wallet connection (`Phantom`, `Solflare`, etc.). It provides the necessary functions for signing and sending transactions on the Solana network.
- **UI Components (`/components/ui`)**: A collection of reusable, best-practice UI elements built with `shadcn/ui` that ensure a consistent and high-quality user experience.

---

## 3. Backend Architecture

The backend is a [Node.js](https://nodejs.org/) application using the [Express](https://expressjs.com/) framework, located in the `backend/` directory. Its primary role is to serve as a secure and reliable interface to the Jupiter API.

### Key Technologies:

- **Framework**: [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API Communication**: `axios` for making requests to the Jupiter API.

### Core Components & Endpoints:

- **Jupiter Service (`/services/jupiter.service.ts`)**: This is the core of the backend logic. It contains functions that wrap the various endpoints of the Jupiter API, such as:
  - `GET /tokens`: Fetching all available tokens for swapping.
  - `GET /quote`: Getting a swap quote for a given token pair and amount.
  - `POST /swap-transaction`: Creating a swap transaction.
  - `POST /send-transaction`: Submitting a signed transaction to the Solana network.
- **Jupiter Controller (`/controllers/jupiter.controller.ts`)**: This handles the incoming HTTP requests from the frontend, calls the appropriate `JupiterService` function, and sends the response back to the client.
- **Routes (`/routes/jupiter.routes.ts`)**: This defines the API endpoints that the frontend can call (e.g., `/api/jupiter/tokens/all`, `/api/jupiter/quote`).

---

## 4. How Novex Works: The User Journey

The architecture is designed to create a seamless and powerful trading experience. Here's how the different components work together:

1.  **Connecting a Wallet**: The user visits the Novex web application and connects their Solana wallet. The `WalletContext` on the frontend securely manages the connection state and public key.

2.  **Swapping Tokens**:
    - The user navigates to the **Swap** page.
    - The frontend calls the Novex backend's `/api/jupiter/tokens/all` endpoint to fetch a list of available tokens.
    - When the user enters a swap amount, the frontend calls the `/api/jupiter/quote` endpoint. The backend relays this request to the Jupiter API and returns the best quote.
    - The user clicks "Swap", and the frontend calls the `/api/jupiter/swap-transaction` endpoint. The backend gets the transaction details from Jupiter.
    - The frontend uses the `signTransaction` function from the `WalletContext` to have the user sign the transaction.
    - The signed transaction is sent to the `/api/jupiter/send-transaction` endpoint, which the backend forwards to the Solana network for execution.

3.  **Getting AI Insights**:
    - The user interacts with the **AI Chat**.
    - The `Novex2Agent` on the frontend takes the user's query and fetches real-time price data directly from the Jupiter price API.
    - This data is combined with a sophisticated prompt and sent to the **Google Gemini AI**.
    - The AI returns a detailed trading analysis, which is then displayed to the user in the chat interface.

This architecture ensures a secure, high-performance, and feature-rich platform for social trading on Solana. The separation of concerns between the frontend and backend allows for scalability and maintainability, while the integration with powerful third-party services like Jupiter and Google AI provides a cutting-edge user experience. 