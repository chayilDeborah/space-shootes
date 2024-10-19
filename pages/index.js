'use client'
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ThirdwebProvider, useAddress, useMetamask, ChainId } from '@thirdweb-dev/react';


const Game = dynamic(() => import('../components/Game'), { ssr: false });

export default function Home() {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Mainnet}>
        <div style={{ width: '100vw', height: '100vh' }}>
          <Game />
        </div>
    </ThirdwebProvider>
  );
}
