"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface WalletContextType {
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: string | null;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  chainId: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  balance: null,
});

export function useWallet() {
  return useContext(WalletContext);
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatBalance(wei: string) {
  const eth = parseInt(wei, 16) / 1e18;
  return eth.toFixed(4);
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = !!address;

  const fetchBalance = useCallback(async (addr: string) => {
    if (typeof window === "undefined" || !window.ethereum) return;
    try {
      const hexBalance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [addr, "latest"],
      });
      setBalance(formatBalance(hexBalance as string));
    } catch {
      setBalance("0.0000");
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (!window.ethereum) {
      alert("Please install MetaMask or another Ethereum wallet");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainHex = await window.ethereum.request({
        method: "eth_chainId",
      });
      const addr = (accounts as string[])[0];
      setAddress(addr);
      setChainId(parseInt(chainHex as string, 16));
      await fetchBalance(addr);
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code !== 4001) {
        console.error("Wallet connect error:", e.message);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setBalance(null);
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: unknown) => {
        if ((accounts as string[]).length > 0) {
          const addr = (accounts as string[])[0];
          setAddress(addr);
          window.ethereum!.request({ method: "eth_chainId" }).then((chain: unknown) => {
            setChainId(parseInt(chain as string, 16));
          });
          fetchBalance(addr);
        }
      })
      .catch(() => {});
  }, [fetchBalance]);

  // Listen for account/chain changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;
    const handleAccountsChanged = (accounts: unknown) => {
      if ((accounts as string[]).length === 0) {
        setAddress(null);
        setChainId(null);
        setBalance(null);
      } else {
        const addr = (accounts as string[])[0];
        setAddress(addr);
        fetchBalance(addr);
      }
    };
    const handleChainChanged = (chain: unknown) => {
      setChainId(parseInt(chain as string, 16));
      if (address) fetchBalance(address);
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [address, fetchBalance]);

  return (
    <WalletContext.Provider
      value={{ address, chainId, balance, isConnecting, isConnected, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// ─── Wallet Button Component ───
export function WalletButton({ className = "" }: { className?: string }) {
  const { address, balance, isConnecting, isConnected, connect, disconnect, chainId } = useWallet();

  const chainNames: Record<number, string> = {
    1: "Ethereum",
    11155111: "Sepolia",
    137: "Polygon",
    80001: "Mumbai",
    56: "BSC",
    42161: "Arbitrum",
    10: "Optimism",
    8453: "Base",
    1337: "Hardhat",
    31337: "Localhost",
  };

  const chainName = chainId ? chainNames[chainId] || `Chain #${chainId}` : "";

  if (isConnected && address) {
    return (
      <div className={`group relative ${className}`}>
        {/* Connected state */}
        <button
          onClick={disconnect}
          className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:border-accent/50 hover:bg-accent/10"
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
            <span className="font-mono text-white">{shortenAddress(address)}</span>
          </span>
          {balance && (
            <span className="border-l border-border/40 pl-3 text-xs text-zinc-400">
              {parseFloat(balance).toFixed(2)} ETH
            </span>
          )}
        </button>

        {/* Dropdown on hover */}
        <div className="invisible absolute right-0 top-full z-50 mt-2 w-64 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
          <div className="rounded-xl border border-border/60 bg-bg/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <span className="h-3 w-3 rounded-full bg-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-400">Connected Wallet</p>
                <p className="font-mono text-xs text-white">{shortenAddress(address)}</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-border/40 pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Network</span>
                <span className="font-medium text-accent">{chainName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Balance</span>
                <span className="font-medium text-white">{balance || "0"} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status</span>
                <span className="flex items-center gap-1.5 font-medium text-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
                  Active
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                disconnect();
              }}
              className="mt-3 w-full rounded-lg border border-red-500/20 bg-red-500/5 py-2 text-xs font-medium text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/10"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className={`rounded-xl border border-border bg-surface/50 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-white disabled:opacity-50 ${className}`}
    >
      <span className="flex items-center gap-2">
        {isConnecting ? (
          <span className="h-2 w-2 animate-spin rounded-full border border-accent border-t-transparent" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
        )}
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </span>
    </button>
  );
}

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
