"use client";

import { WalletProvider } from "@/components/WalletConnect";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
