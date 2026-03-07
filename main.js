import { StartScene} from './StartScene.js';
import { GameScene} from './GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [ GameScene, StartScene]
};

const game = new Phaser.Game(config);