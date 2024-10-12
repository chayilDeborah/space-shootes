import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'menuScene' });

    this.menuBackground = null;
    this.menuspaceship = null;
    this.startButton = null;
    this.walletContainer = null;
  }

  preload() {
    this.load.image('menuBackground', '/image.png'); // Background image
    this.load.image('menuspaceship', '/menuspaceship.svg'); // Spaceship image
    this.load.image('startButton', '/menustart.svg'); // Start button image
    this.load.image('walletIcon', '/wallet.svg'); // Connect wallet icon
    this.load.image('loginIcon', '/login.svg'); // Daily login icon
    this.load.image('baseIcon', '/smallbase.svg'); // Earn Base tokens icon
    this.load.image('freeIcon', '/video.svg'); // Free rewards icons
    this.load.image('userAvatar', '/user.svg'); // User avatar image
  }

  create() {
    // Left and right background sections
    this.add.rectangle(0, 0, this.scale.width * 0.4, this.scale.height, 0x0f275d).setOrigin(0);
    this.menuBackground = this.add.image(this.scale.width * 0.7, this.scale.height / 2, 'menuBackground').setScale(2.2);

    // Spaceship with animation
    this.menuspaceship = this.add.sprite(this.scale.width * 0.7, 600, 'menuspaceship');
    this.add.tween({
      targets: this.menuspaceship,
      alpha: { from: 0.7, to: 1 },
      duration: 4000,
      repeat: -1,
      yoyo: true
    });

    // Start button with bounce animation and pointer cursor
    this.startButton = this.add.image(this.scale.width * 0.2, 950, 'startButton')
      .setInteractive({ cursor: 'pointer' }) // Add pointer cursor
      .setScale(0.7);

    this.add.tween({
      targets: this.startButton,
      scale: { from: 0.7, to: 0.75 },
      duration: 1000,
      ease: 'Linear',
      repeat: -1,
      yoyo: true
    });

    // Start button click: Switch to GameScene
    this.startButton.on('pointerdown', () => {
      this.scene.start('gameScene'); // Switch to GameScene when clicked
    });

    // Wallet Container, Icons, and other UI Elements...
    const walletIcon = this.add.image(20, 20, 'walletIcon').setScale(0.5);
    const walletText = this.add.text(60, 20, 'CONNECT WALLET', {
      font: '20px "Press Start 2P"',
      fill: '#ffffff',
    }).setOrigin(0, 0.5);

    this.walletContainer = this.add.container(this.scale.width * 0.146, 780, [walletIcon, walletText]);
    this.walletContainer.setSize(140, 70);
    this.walletContainer.setInteractive({ cursor: 'pointer' });
    this.walletContainer.on('pointerover', () => this.walletContainer.setScale(1.05));
    this.walletContainer.on('pointerout', () => this.walletContainer.setScale(1));

    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x2774a4);
    graphics.strokeRect(
      this.walletContainer.x - 20,
      this.walletContainer.y - 20,
      this.walletContainer.width + 140,
      this.walletContainer.height + 5
    );

    // Daily login, earn tokens, and free rewards setup...
    const buttons = [
      { icon: 'loginIcon', y: 320, text: 'Daily Login' },
      { icon: 'baseIcon', y: 400, text: 'Earn Base Tokens' },
      { icon: 'freeIcon', y: 480, text: 'Free' },
      { icon: 'freeIcon', y: 560, text: 'Free' },
    ];

    buttons.forEach((button) => {
      let btnIcon = this.add.image(300, button.y, button.icon)
        .setInteractive({ cursor: 'pointer' })
        .setScale(0.5);

      let btnText = this.add.text(360, button.y, button.text, {
        font: '30px "Press Start 2P"',
        fill: '#ffffff',
      }).setOrigin(0, 0.5);

      btnIcon.on('pointerover', () => btnIcon.setScale(0.55));
      btnIcon.on('pointerout', () => btnIcon.setScale(0.5));
    });

    // User avatar, username, and level display...
    const userAvatar = this.add.image(205, 103, 'userAvatar').setScale(0.7);
    const username = this.add.text(230, 85, 'user101', {
      font: '20px "Press Start 2P"',
      fill: '#ffffff',
      backgroundColor: '#3F4044',
      padding: { top: 10, bottom: 10, left: 20, right: 20 },
    });

    const userLevel = this.add.text(230, 120, 'LVL 1', {
      font: '16px "Press Start 2P"',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { top: 10, bottom: 10, left: 20, right: 20 },
    });

    this.add.container(0, 0, [userAvatar, username, userLevel]);
  }

  update() {
    // Continuous updates go here if needed
  }
}

export default MenuScene;
