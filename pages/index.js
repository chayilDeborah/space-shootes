'use client'
import { useState } from 'react';
import dynamic from 'next/dynamic';
import '@rainbow-me/rainbowkit/styles.css';
import { useAccount,useConnect } from 'wagmi';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false, // If your dApp uses server side rendering (SSR)
});


const queryClient = new QueryClient();

const Game = dynamic(() => import('../components/Game'), { ssr: false });

export default function Home() {
  const { address } = useAccount();
  const { connect } = useConnect();
  return (
    

    <div style={{ width: '100vw', height: '100vh' }}>
      <Game walletAddress={address} connectWallet={connect} />
    </div>
   

  );
}