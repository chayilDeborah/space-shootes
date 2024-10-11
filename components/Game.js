import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    let game;

    const initPhaser = async () => {
      const Phaser = await import('phaser');
      // const { default: SplashScene } = await import('../src/game/scenes/SplashScene');
      const { default: TitleScene } = await import('../src/game/scenes/TitleScene');
      const { default: MenuScene } = await import('../src/game/scenes/MenuScene');
      const { default: GameScene } = await import('../src/game/scenes/GameScene');

      const config = {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        scene: [ TitleScene, MenuScene, GameScene],
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
          },
        },
        parent: gameRef.current,
      };

      game = new Phaser.Game(config);
    };

    initPhaser();

    return () => {
      if (game) game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} style={{ width: '100%', height: '100%' }} />;
};

export default dynamic(() => Promise.resolve(Game), {
  ssr: false,
});