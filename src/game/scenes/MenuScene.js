/* global Phaser */

// This is the Menu Scene

class MenuScene extends Phaser.Scene {
    constructor () {
      super({ key: 'menuScene' })
  
      this.menuSceneBackgroundImage = null
      this.startButton = null
    }
  
    init (data) {
      this.cameras.main.setBackgroundColor('#ffffff')
    }
  
    preload () {
      console.log('Menu Scene')
  
      this.load.image('menuSceneBackground', '/aliens_screen_image2.jpg')
      this.load.image('startButton', '/start.png')
    }
  
    create (data) {
      this.menuSceneBackgroundImage = this.add.sprite(0, 0, 'menuSceneBackground')
      this.menuSceneBackgroundImage.x = 1920 / 2
      this.menuSceneBackgroundImage.y = 1080 / 2
  
      this.startButton = this.add.sprite(1920 / 2, (1080 / 2) + 100, 'startButton')
      this.startButton.setInteractive({ useHandCursor: true })
      this.startButton.on('pointerdown', () => this.clickButton())
    }
  
    update (time, delta) {
    }
  
    clickButton () {
      this.scene.start('gameScene')
    }
  }
  
  export default MenuScene