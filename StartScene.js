import { drawTiledBackgroundContrast } from './asset/tiledBackground.js';

import { spawnCheese, spawnSnake, spawnCat } from './gameMechanics.js';

class StartScene extends Phaser.Scene {
  constructor() {
    //super('StartScene');
    super({ key: 'StartScene', physics: { default: 'matter' } });
  }

  preload(){
    this.load.image('sfondo', './asset/splash2.png');

  }

  create() {
    //drawTiledBackgroundContrast(this);
    
    this.scoreText = this.add.text(250, 50, `Run MOUSE Run!`, {
      fontSize: '50px',
      fontFamily: "Jolly Lodger",
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(10);

    const background = this.add.image(0, 0, 'sfondo')
    .setOrigin(0)              // in alto a sinistra
    //.setDisplaySize(800, 600); // adatta alle dimensioni della scena

  }

  update() {}
  

 
  }


export { StartScene };
