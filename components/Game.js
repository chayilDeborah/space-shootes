import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

/**
 * Game component that initializes a Phaser game.
 * @param {Object} props - Component properties.
 * @param {string} props.walletAddress - The connected wallet address.
 * @param {Function} props.connectWallet - Function to connect the wallet.
 * @returns {JSX.Element} The game container.
 */
const Game = ({ walletAddress, connectWallet }) => {
  const gameRef = useRef(null);

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

      // Listen for the scene creation event
      
       // console.log("scene");
        game.scene.scenes.filter(scene => {
          console.log("scene filter");
          console.log(scene.scene.key,"scene key");
          if(scene.scene.key === 'menuScene'){
          scene.initWallet(walletAddress, connectWallet);
        }})
       
     
    };

    initPhaser();

    return () => {
      if (game) {
        game.events.off('scene-create'); // Remove the event listener
        game.destroy(true);
      }
    };
  }, [connectWallet, walletAddress]);

  return <div ref={gameRef} style={{ width: '100%', height: '100%' }} />;
};

export default dynamic(() => Promise.resolve(Game), {
  ssr: false,
});
