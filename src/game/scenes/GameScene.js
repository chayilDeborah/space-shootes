/* global Phaser */

// Game Scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'gameScene' });

    this.ship = null;
    this.fireMissile = false;
    this.score = 0;
    this.level = 1;
    this.scoreText = null;
    this.levelText = null;
    this.scoreTextStyle = { font: '40px Arial', fill: '#ffffff', align: 'center', marginBottom: 20,  };
    this.levelTextStyle = { font: '40px Arial', fill: '#ffffff', align: 'center' };

    this.gameOverText = null;
    this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' };
  }

  init(data) {
    this.cameras.main.setBackgroundColor('#0x5f6e7a');
    if (data.level) {
      this.level = data.level;
      this.score = data.score || 0;
    }
  }

  preload() {
    console.log('Game Scene');

    // Images
    this.load.image('menuBackground', '/image.png');
    this.load.image('ship', '/spaceship.svg');
    this.load.image('missile', '/missile.png');
    this.load.image('alien', '/alien.png');
    this.load.image('pauseButton', '/pause.svg');
    this.load.image('avatar', '/user.svg'); 
    this.load.image('explosion', '/explosion.svg'); 
    this.load.image('baseLogo', '/base_logo.svg'); 
    this.load.image('bulbLogo', '/tips.svg');
    this.load.image('continueButton', '/continue.svg'); // Button for level complete
    this.load.image('cancelLogo', '/Vector.png'); // Cancel button for modal
    this.load.image('getNowButton', '/getnow.png'); // Get Now button image

    // Sounds
    this.load.audio('laser', '/laser1.wav');
    this.load.audio('explosion', '/barrelExploding.wav');
    this.load.audio('bomb', '/bomb.wav');
  }

  create(data) {
    // Set up background, score, and level text
    this.background = this.add.image(0, 0, 'menuBackground').setScale(2.0).setOrigin(0, 0);

    this.levelText = this.add.text(10, 60, 'Level: ' + this.level.toString(), this.levelTextStyle);
    this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle);

    // Create ship and set physics properties
    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 180, 'ship');

    // Create groups for missiles and aliens
    this.missileGroup = this.physics.add.group();
    this.alienGroup = this.add.group();

    // Start spawning aliens
    this.startAlienSpawnLoop();

    // Add collision logic between missiles and aliens
    this.physics.add.collider(
      this.missileGroup,
      this.alienGroup,
      (missileCollide, alienCollide) => {
        this.createExplosion(alienCollide.x, alienCollide.y);
        alienCollide.destroy();
        missileCollide.destroy();
        this.sound.play('explosion');

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score.toString());

        if (this.score % 100 === 0) {
          this.levelComplete();
        } else {
          this.spawnAliens(2 + this.level); // Spawn more aliens with increasing difficulty
        }
      }
    );

    // Add collision logic between the ship and aliens
    this.physics.add.collider(
      this.ship,
      this.alienGroup,
      (shipCollide, alienCollide) => {
        this.sound.play('bomb');
        this.physics.pause();
        alienCollide.destroy();
        shipCollide.destroy();

        this.gameOverText = this.add
          .text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle)
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true });

        this.gameOverText.on('pointerdown', () => this.scene.restart());
      }
    );

    // Add a timed event to spawn aliens every few seconds
    this.time.addEvent({
      delay: 5000, // Adjust the delay as needed (e.g., 5000ms = 5 seconds)
      callback: this.spawnAliens,
      callbackScope: this,
      loop: true,
      args: [2 + this.level] // Pass the number of aliens to spawn
    });
  }

  update(time, delta) {
    const keyLeftObj = this.input.keyboard.addKey('LEFT');
    const keyRightObj = this.input.keyboard.addKey('RIGHT');
    const keySpaceObj = this.input.keyboard.addKey('SPACE');

    if (keyLeftObj.isDown) {
      this.ship.x -= 15;
      if (this.ship.x < 0) this.ship.x = 0;
    }

    if (keyRightObj.isDown) {
      this.ship.x += 15;
      if (this.ship.x > 1920) this.ship.x = 1920;
    }

    if (keySpaceObj.isDown && !this.fireMissile) {
      this.fireMissile = true;
      const missile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile');
      this.missileGroup.add(missile);
      this.sound.play('laser');
    }

    if (keySpaceObj.isUp) {
      this.fireMissile = false;
    }

    this.missileGroup.children.each((missile) => {
      missile.y -= 15;
      if (missile.y < 50) missile.destroy();
    });
  }

  startAlienSpawnLoop() {
    this.spawnAliens(2 + this.level); // Spawn initial aliens
  }

  spawnAliens(count) {
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 1920);
      const alien = this.physics.add.sprite(x, -100, 'alien');
      alien.body.velocity.y = 200;
      alien.body.velocity.x = Math.random() < 0.5 ? -50 : 50;
      this.alienGroup.add(alien);
    }
  }

  createExplosion(x, y) {
    const explosion = this.add.sprite(x, y, 'explosion').setScale(0.5).setAlpha(0.8);
    this.tweens.add({
      targets: explosion,
      alpha: 0,
      duration: 500,
      onComplete: () => explosion.destroy(),
    });
  }

  levelComplete() {
    this.physics.pause();

    const levelCompleteText = this.add
      .text(1920 / 2, 1080 / 2 - 100, `Level ${this.level} Complete!\nScore: ${this.score}`, {
        font: '65px Arial',
        fill: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    const continueButton = this.add
      .image(1920 / 2, 1080 / 2 + 50, 'continueButton')
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        levelCompleteText.destroy();
        continueButton.destroy();
        this.showLevelModal();
      });
  }

  showLevelModal() {
    let modalText = '';
    let modalHeading = '';
    switch (this.level) {
      case 1:
        modalText = 'Blockchain is a decentralized technology for secure, transparent transactions.\n' +
                    'Base builds on this to offer faster, scalable solutions for users and developers.';
        modalHeading = 'BASE TIPS';
        break;
      case 2:
        modalText = 'Base is a Layer 2 blockchain that enhances Ethereum’s performance by reducing transaction costs\n' +
                    'and speeding up processes while maintaining the security of Ethereum.';
        modalHeading = 'Coinbase Wallet';
        break;
      case 3:
        modalText = 'One of Base’s key advantages is significantly reduced gas fees, making it cheaper to execute\n' +
                    'transactions and run applications compared to Layer 1 blockchains like Ethereum.';
        modalHeading = 'BASE NAME';
        break;
      default:
        modalText = 'Congratulations on completing the game!';
        modalHeading = 'GAME COMPLETE';
    }

    const modalBg = this.add.rectangle(960, 540, 600, 400, 0x4457da).setAlpha(0.9).setStrokeStyle(2, 0xffffff).setOrigin(0.5);
    const baseLogo = this.add.image(850, 400, 'baseLogo').setScale(0.5);
    const headingText = this.add.text(880, 390, modalHeading, {
      font: '30px Arial',
      fill: '#ffffff',
      align: 'center'
    });

    const bodyText = this.add.text(
      700, 450,
      modalText,
      { font: '20px Arial', fill: '#ffffff', align: 'left', wordWrap: { width: 500 }, lineSpacing: 10 }
    );

    const continueButton = this.add.image(960, 650, 'continueButton')
      .setInteractive({ useHandCursor: true });

    continueButton.on('pointerdown', () => {
      modalBg.destroy();
      baseLogo.destroy();
      headingText.destroy();
      bodyText.destroy();
      continueButton.destroy();
      if (this.level < 3) {
        this.showBaseNameModal();
      } else {
        this.startNextLevel();
      }
    });
  }

  showBaseNameModal() {
    const modalBg = this.add.rectangle(960, 540, 600, 400, 0x4457da).setAlpha(0.9).setStrokeStyle(2, 0xffffff).setOrigin(0.5);
    const baseLogo = this.add.image(700, 390, 'baseLogo').setScale(0.5);
    
    // Adjust the modal heading based on the level
    const modalHeadingText = this.level === 2 ? 'COINBASE WALLET' : 'BASE NAME';
    const baseNameText = this.add.text(880, 390, modalHeadingText, {
      font: '30px Arial',
      fill: '#ffffff',
    });
  
    const cancelLogo = this.add.image(1190, 400, 'cancelLogo').setScale(0.7).setInteractive(); // Increased size
    cancelLogo.on('pointerdown', () => {
      modalBg.destroy();
      baseLogo.destroy();
      baseNameText.destroy();
      cancelLogo.destroy();
      bodyText.destroy();
      getNowButton.destroy();
      this.startNextLevel();
    });
  
    // Update the body text and link for level 2
    const bodyTextContent = this.level === 2
      ? 'Coinbase Wallet is a self-custody crypto wallet, meaning you have full control over your digital assets like cryptocurrencies, NFTs, and tokens. Unlike the Coinbase exchange, which holds your assets for you, Coinbase Wallet gives you the private keys to your wallet—so only you can access it.'
      : 'Basenames are unique identifiers used on the Base blockchain for easy identification and fast transactions. Connect with Based builders. Build your Based profile';
  
    const bodyText = this.add.text(
      700, 450,
      bodyTextContent,
      { font: '20px Arial', fill: '#ffffff', align: 'left', wordWrap: { width: 500 }, lineSpacing: 10 }
    );
  
    const getNowButton = this.add.image(930, 680, 'getNowButton') // Replaced text with image
      .setInteractive({ useHandCursor: true });

    // Update the link for level 2
    const link = this.level === 2 ? 'https://help.coinbase.com/en/wallet/getting-started/create-a-coinbase-wallet' : 'https://www.base.org/names?utm_source=dotorg&medium=hero';
    getNowButton.on('pointerdown', () => {
      window.open(link, '_blank');
    });
  }

  startNextLevel() {
    this.level += 1;
    this.score = 0;
    this.scoreText.setText('Score: ' + this.score.toString());
    this.levelText.setText('Level: ' + this.level.toString());
    this.physics.resume();
    this.scene.restart({ level: this.level, score: this.score });
  }
}

export default GameScene;
