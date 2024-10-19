import Phaser from 'phaser';
import { ConnectWallet } from "@thirdweb-dev/react";
/**
 * MenuScene class for the Phaser game.
 * Handles the main menu interactions and UI.
 */
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'menuScene' });

    /** @type {Phaser.GameObjects.Image} */
    this.menuBackground = null;
    /** @type {Phaser.GameObjects.Sprite} */
    this.menuspaceship = null;
    /** @type {Phaser.GameObjects.Image} */
    this.startButton = null;
    /** @type {Phaser.GameObjects.Container} */
    this.walletContainer = null;
    /** @type {string|null} */
    this.walletAddress = null;
    /** @type {Function|null} */
    this.connectWallet = null;
  }

  /**
   * Initializes the wallet functionality.
   * @param {string|null} walletAddress - The connected wallet address.
   * @param {Function} connectWallet - Function to connect the wallet.
   */
  initWallet(walletAddress, connectWallet) {
    this.walletAddress = walletAddress;
    this.connectWallet = connectWallet;
    this.updateWalletText();
  }

  /**
   * Preloads assets for the scene.
   */
  preload() {
    this.load.image('menuBackground', '/image.png');
    this.load.image('menuspaceship', '/menuspaceship.svg');
    this.load.image('startButton', '/menustart.svg');
    this.load.image('walletIcon', '/wallet.svg');
    this.load.image('loginIcon', '/login.svg');
    this.load.image('baseIcon', '/smallbase.svg');
    this.load.image('freeIcon', '/video.svg');
    this.load.image('userAvatar', '/user.svg');
  }

  /**
   * Creates the scene and its elements.
   */
  create() {
    this.add.rectangle(0, 0, this.scale.width * 0.4, this.scale.height, 0x0f275d).setOrigin(0);
    this.menuBackground = this.add.image(this.scale.width * 0.7, this.scale.height / 2, 'menuBackground').setScale(2.2);

    this.menuspaceship = this.add.sprite(this.scale.width * 0.7, 600, 'menuspaceship');
    this.add.tween({
      targets: this.menuspaceship,
      alpha: { from: 0.7, to: 1 },
      duration: 4000,
      repeat: -1,
      yoyo: true
    });

    this.startButton = this.add.image(this.scale.width * 0.2, 950, 'startButton')
      .setInteractive({ cursor: 'pointer' })
      .setScale(0.7);

    this.add.tween({
      targets: this.startButton,
      scale: { from: 0.7, to: 0.75 },
      duration: 1000,
      ease: 'Linear',
      repeat: -1,
      yoyo: true
    });

    this.startButton.on('pointerdown', () => {
      this.scene.start('gameScene');
    });

    const walletIcon = this.add.image(20, 20, 'walletIcon').setScale(0.5);
    const walletText = this.add.text(60, 20, this.getWalletDisplayText(), {
      font: '20px "Press Start 2P"',
      fill: '#ffffff',
    }).setOrigin(0, 0.5);

    this.walletContainer = this.add.container(this.scale.width * 0.146, 780, [walletIcon, walletText]);
    this.walletContainer.setSize(140, 70);
    this.walletContainer.setInteractive({ cursor: 'pointer' });
    this.walletContainer.on('pointerover', () => this.walletContainer.setScale(1.05));
    this.walletContainer.on('pointerout', () => this.walletContainer.setScale(1));
    this.walletContainer.on('pointerdown', async () => {
      if (this.connectWallet && !this.walletAddress) {
        await this.connectWallet();
      }
    });
    
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x2774a4);
    graphics.strokeRect(
      this.walletContainer.x - 20,
      this.walletContainer.y - 20,
      this.walletContainer.width + 140,
      this.walletContainer.height + 5
    );

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

  /**
   * Returns the display text for the wallet address.
   * @returns {string} The formatted wallet address or 'CONNECT WALLET'.
   */
  getWalletDisplayText() {
    if (this.walletAddress) {
      return `${this.walletAddress.slice(0, 5)}...${this.walletAddress.slice(-3)}`;
    }
    return 'CONNECT WALLET';
  }

  /**
   * Updates the wallet text display with the connected address.
   */
  updateWalletText() {
    if (this.walletContainer) {
      const walletText = this.walletContainer.getAt(1);
      walletText.setText(this.getWalletDisplayText());
    }
  }
}

export default MenuScene;

// <ConnectWallet/>