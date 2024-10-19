'use client'
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ConnectWallet } from "@thirdweb-dev/react";


const Game = dynamic(() => import('../components/Game'), { ssr: false });

export default function Home() {
  return (
        <div style={{ width: '100vw', height: '100vh' }}>
          <ConnectWallet/>
          <Game />
        </div>
  );
}
