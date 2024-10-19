import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAddress, useMetamask } from '@thirdweb-dev/react';

/**
 * Game component that initializes a Phaser game.
 * @param {Object} props - Component properties.
 * @param {string} props.walletAddress - The connected wallet address.
 * @param {Function} props.connectWallet - Function to connect the wallet.
 * @returns {JSX.Element} The game container.
 */
const Game = () => {
  const gameRef = useRef(null);
  const address = useAddress();
  const connectWallet = useMetamask();

  useEffect(() => {
    let game;

    const initPhaser = async () => {
      const Phaser = await import('phaser');
      const { default: TitleScene } = await import('../src/game/scenes/TitleScene');
      const { default: MenuScene } = await import('../src/game/scenes/MenuScene');
      const { default: GameScene } = await import('../src/game/scenes/GameScene');

      const config = {
        type: Phaser.AUTO,
        width: 1920,
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
          scene.initWallet(address, connectWallet);
        }
      });
    };

    initPhaser();

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, [address, connectWallet]);

  return <div ref={gameRef} style={{ width: '100%', height: '100%' }} />;
};

export default dynamic(() => Promise.resolve(Game), {
  ssr: false,
});
