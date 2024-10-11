    import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import SplashScene from '../scenes/SplashScene';
import TitleScene from '../scenes/TitleScene';
import MenuScene from '../scenes/MenuScene';
import GameScene from '../scenes/GameScene';

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    let game;

    const initPhaser = () => {
      const config = {
        type: Phaser.AUTO,
        scale: {
          mode: Phaser.Scale.RESIZE,
          parent: gameRef.current,
          width: '100%',
          height: '100%'
        },
        scene: [SplashScene, TitleScene, MenuScene, GameScene],
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
          },
        },
      };

      game = new Phaser.Game(config);
    };

    initPhaser();

    return () => {
      if (game) game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} style={{ width: '100vw', height: '100vh' }} />;
};


export default dynamic(() => Promise.resolve(Game), {
    ssr: false,
  });