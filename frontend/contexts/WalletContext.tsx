"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { VersionedTransaction, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

interface TokenBalance {
  mint: string;
  symbol: string;
  name: string;
  uiAmount: number | null;
  logoURI: string;
}

interface WalletContextType {
  wallet: any | null;
  connecting: boolean;
  connected: boolean;
  publicKey: string | null;
  tokenBalances: TokenBalance[];
  loadingBalances: boolean;
  solBalance: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connecting: false,
  connected: false,
  publicKey: null,
  tokenBalances: [],
  loadingBalances: false,
  solBalance: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  signTransaction: async (transaction: VersionedTransaction) => transaction,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<any | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [solBalance, setSolBalance] = useState<number | null>(null);

  // Create a single Connection instance using useRef
  const connectionRef = useRef<Connection | null>(null);
  useEffect(() => {
    if (!connectionRef.current) {
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
      connectionRef.current = new Connection(rpcUrl, "confirmed");
    }
  }, []);

  useEffect(() => {
    const checkForPhantom = async () => {
      try {
        if (typeof window !== "undefined") {
          const phantom = window.solana;

          if (phantom) {
            setWallet(phantom);

            // Check initial connection state
            if (phantom.isConnected) {
              const key = phantom.publicKey?.toString();
              setConnected(true);
              setPublicKey(key || null);
            }

            // Handle connection change events
            phantom.on("connect", () => {
              const key = phantom.publicKey?.toString();
              setConnected(true);
              setPublicKey(key || null);
              setConnecting(false);
              fetchTokenBalances();
            });

            phantom.on("disconnect", () => {
              setConnected(false);
              setPublicKey(null);
              setTokenBalances([]);
              setSolBalance(null);
            });
          }
        }
      } catch (error) {
        console.error("Error checking for Phantom wallet:", error);
      }
    };

    if (typeof window !== "undefined") {
      checkForPhantom();
    }

    return () => {
      if (wallet) {
        wallet.off("connect");
        wallet.off("disconnect");
      }
    };
  }, []);

  const fetchTokenBalances = async () => {
    if (!connected || !publicKey || !connectionRef.current) {
      setTokenBalances([]);
      setSolBalance(null);
      return;
    }

    setLoadingBalances(true);
    try {
      const connection = connectionRef.current;

      // Fetch all token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(new PublicKey(publicKey), {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      });

      // Fetch Jupiter's strict token list for metadata
      const tokenListResponse = await fetch("https://token.jup.ag/strict");
      const tokenListData = (await tokenListResponse.json()) as { address: string; symbol: string; name: string; logoURI: string }[];
      const tokenMap = new Map(tokenListData.map((token) => [token.address, token]));

      const balances: TokenBalance[] = tokenAccounts.value
        .map((accountInfo) => {
          const parsedInfo = accountInfo.account.data.parsed.info;
          const mintAddress = parsedInfo.mint;
          const tokenMetadata = tokenMap.get(mintAddress);

          return {
            mint: mintAddress,
            symbol: tokenMetadata ? tokenMetadata.symbol : "Unknown",
            name: tokenMetadata ? tokenMetadata.name : "Unknown Token",
            uiAmount: parsedInfo.tokenAmount.uiAmount,
            logoURI: tokenMetadata ? tokenMetadata.logoURI : "",
          };
        })
        .filter((balance) => balance.uiAmount && balance.uiAmount > 0);

      // Fetch SOL balance
      const solBalanceValue = await connection.getBalance(new PublicKey(publicKey));
      const solTokenMetadata = tokenMap.get("So11111111111111111111111111111111111111112");

      balances.unshift({
        mint: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        name: "Solana",
        uiAmount: solBalanceValue / LAMPORTS_PER_SOL,
        logoURI: solTokenMetadata ? solTokenMetadata.logoURI : "",
      });

      setTokenBalances(balances);
      setSolBalance(solBalanceValue / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching token balances:", error);
      setTokenBalances([]);
      setSolBalance(null);
    } finally {
      setLoadingBalances(false);
    }
  };

  // Debounced effect to fetch balances
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (connected && publicKey) {
      timeoutId = setTimeout(() => {
        fetchTokenBalances();
      }, 500); // Delay 500ms to debounce
    } else {
      setTokenBalances([]);
      setSolBalance(null);
    }
    return () => clearTimeout(timeoutId);
  }, [connected, publicKey]);

  const connectWallet = async () => {
    try {
      if (!wallet) {
        window.open("https://phantom.app/", "_blank");
        return;
      }

      setConnecting(true);
      await wallet.connect();
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setConnecting(false);
    }
  };

  const signTransaction = async (transaction: VersionedTransaction): Promise<VersionedTransaction> => {
    if (!wallet || !connected) {
      throw new Error("Wallet not connected");
    }
    return await wallet.signTransaction(transaction);
  };

  const disconnectWallet = async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
        setConnected(false);
        setPublicKey(null);
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connecting,
        connected,
        publicKey,
        tokenBalances,
        loadingBalances,
        solBalance,
        connectWallet,
        disconnectWallet,
        signTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};