import dynamic from 'next/dynamic';

const Game = dynamic(() => import('../components/Game'), { ssr: false });

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Game />
    </div>
  );
}