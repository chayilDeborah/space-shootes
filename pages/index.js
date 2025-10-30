'use client'
import dynamic from 'next/dynamic';
import { useAppKit } from '@reown/appkit/react';

const Game = dynamic(() => import('../components/Game'), { ssr: false });

export default function Home() {
  const { open } = useAppKit();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={() => open()}>Connect Wallet</button>
      {/* Or use the built-in component: */}
      {/* <appkit-button /> */}
      <Game />
    </div>
  );
}