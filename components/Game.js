import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

/**
 * Game component that initializes a Phaser game.
 * @returns {JSX.Element} The game container.
 */
const Game = () => {
  const gameRef = useRef(null);
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();

  const connectWallet = () => {
    open();
  };

  useEffect(() => {
    let game;

    const initPhaser = async () => {
      const Phaser = await import('phaser');
      const { default: TitleScene } = await import('../src/game/scenes/TitleScene');
      const { default: MenuScene } = await import('../src/game/scenes/MenuScene');
      const { default: GameScene } = await import('../src/game/scenes/GameScene');

      const config = {
        type: Phaser.AUTO,
        width: 2020,
        height: 1080,
        scene: [TitleScene, MenuScene, GameScene],
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
          },
        },
        parent: gameRef.current,
      };

      game = new Phaser.Game(config);

      game.scene.scenes.forEach(scene => {
        if (scene.scene.key === 'menuScene') {
          scene.init({ 
            connectWallet,
            address,
            isConnected 
          });
        }
      });
    };

    initPhaser();

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, [address, isConnected]);

  return <div ref={gameRef} style={{ width: '100%', height: '100%' }} />;
};

export default dynamic(() => Promise.resolve(Game), {
  ssr: false,
});