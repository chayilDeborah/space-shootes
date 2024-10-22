import Phaser from 'phaser';

class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'titleScene' });

    this.titleSceneBackgroundImage = null;
    this.titleSceneImage = null;
    this.loadingText = null;
    this.loadingBarBackground = null;
    this.loadingBarForeground = null;
    this.loadTime = 0; // Track the loading time
    this.promptText = null; // Add a reference for the prompt text
  }

  init(data) {
    this.cameras.main.setBackgroundColor('#ffffff');
  }

  preload() {
    console.log('Title Scene');
    this.load.image('titleSceneBackground', '/image.png');
    this.load.image('titleSceneImage', '/titletext.svg');
    this.load.image('baseLogo', '/basee.svg'); // Preload the BASE logo
  }

  create(data) {
    // Add background image
    this.titleSceneBackgroundImage = this.add.sprite(1920 / 2, 1080 / 2, 'titleSceneBackground').setScale(2.2);

    // Add title image
    this.titleSceneImage = this.add.image(1420 / 2, (1080 / 2) - 400, 'titleSceneImage');

    // Shift the BASE logo and text to the right for better alignment
    const logoY = 600; // Adjust this value to shift the logo right or left
    const baseTextY = 680; // Position the text next to the logo

    // Add BASE logo image
    this.baseLogo = this.add.image(logoY, 350, 'baseLogo'); // Adjusted X position

    // Add "BASE" text next to the logo
    this.baseText = this.add.text(baseTextY, 350, 'BASE', { font: '50px "Press Start 2P"', fill: '#ffffff' }).setOrigin(0, 0.5);

    // Add "LOADING" text
    this.loadingText = this.add.text(710, 570, 'LOADING', { font: '50px "Press Start 2P"', fill: '#ffffff' }).setOrigin(0.5);

    // Create a white background bar (static)
    this.loadingBarBackground = this.add.graphics();
    this.loadingBarBackground.fillStyle(0xffffff, 1); // White color
    this.loadingBarBackground.fillRect(590, 650, 240, 30); // Static white background
    // fillRect(760, 850, 400, 30);
    // Create the loading bar foreground (dynamic, starts from 0 width)
    this.loadingBarForeground = this.add.graphics();

    // Add prompt text
    this.promptText = this.add.text(1120 / 2 + 100, (1100 / 2) - 100, 'NOTE: This game is to be played on a desktop browser! Please switch to a web browser for optimal gameplay.', {
      font: '20px Arial',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 800, useAdvancedWrap: true }
    }).setOrigin(0.5);

    // Check if the device is mobile
  
  }

  update(time, delta) {
    // Increase the loading bar width gradually
    this.loadTime += delta;
    const barWidth = Math.min(200, this.loadTime / 10); // Adjust the speed of the loading bar

    // Clear previous foreground bar and draw it again with gradient effect
    this.loadingBarForeground.clear();

    // Define the radial gradient color using two rectangles
    const gradientStart = 0x4F7DE8; // #4F7DE8
    const gradientEnd = 0x1A3779; // #1A3779

    // Top half of the bar (lighter blue)
    this.loadingBarForeground.fillStyle(gradientStart, 1);
    this.loadingBarForeground.fillRect(590, 650, barWidth, 15); // Top half of the bar

    // Bottom half of the bar (darker blue)
    this.loadingBarForeground.fillStyle(gradientEnd, 1);
    this.loadingBarForeground.fillRect(590, 665, barWidth, 15); // Bottom half of the bar

    // Switch to the next scene after 4 seconds
    if (this.loadTime >= 4000) {
      this.scene.switch('menuScene'); // Switch to the menu scene after 4 seconds
    }
  }

  isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }
}

export default TitleScene;
