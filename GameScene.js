import { drawTiledBackgroundContrast, drawTiledBackgroundLighter } from './asset/tiledBackground.js';

import { spawnCheese, spawnSnake, spawnCat, spawnElephant } from './gameMechanics.js';


class GameScene extends Phaser.Scene {
  constructor() {
    //super('GameScene');
    super({ key: 'GameScene', physics: { default: 'matter' } });
  }

  preload(){
    this.load.image('mouse', './asset/topo2.png');
    this.load.image('cheese', './asset/formaggio.png');
    this.load.image('snake', './asset/serpente.png');
    this.load.image('cat', './asset/gatto.png');
    this.load.image('elephant', './asset/elefante.png');
    this.load.image('dog', './asset/cane2.png');

    this.load.image('ingranaggio', './asset/ingranaggio.png');

  }

  create() {
    drawTiledBackgroundContrast(this);
    // Imposta i confini del mondo: (x, y, larghezza, altezza, spessore delle linee)
    this.matter.world.setBounds(0, 0, this.game.config.width, this.game.config.height, 32);


    // Punteggio
    this.collectedCheese = 0;
    this.remainingCheese = 5;

    this.scoreText = this.add.text(550, 10, `Punteggio: 0`, {
      fontSize: '25px',
      fontFamily: 'Atma',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(5);

    //TOPO
    this.mouse = this.matter.add.image(400, 500, 'mouse');
    this.mouse.setBody({ type: 'circle', width: 40, height: 40 }, { label: 'mouse' });//setta la forma dell'hitbox e le sue dimensioni
    this.mouse.setFixedRotation(); // opzionale, evita la rotazione automatica
    this.mouse.setDepth(1);
    //this.mouse.setBounce(0.5);
    //this.mouse.setIgnoreGravity(true);

    //INGRANAGGIO
    this.ingranaggio = this.add.image(50, 20, 'ingranaggio');
    this.ingranaggio.setDepth(5);

    //FORMAGGIO
    spawnCheese(this, this.mouse)

    //SERPENTI
    spawnSnake(this, this.mouse)

    


    this.currentSnakeRate = 1000;
    this.currentCatRate = 2000;
    this.currentElephantRate = 2000;
  
    this.snakeTimer = this.time.addEvent({
      delay: this.currentSnakeRate,
      loop: true,
      callback: () => spawnSnake(this, this.mouse)
    });
  
    this.catTimer = this.time.addEvent({
      delay: this.currentCatRate,
      loop: true,
      callback: () => spawnCat(this, this.collectedCheese, this.mouse)
    });
    
    this.elephantTimer = this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => spawnElephant(this, this.collectedCheese, this.mouse)
    });  

    const startButton = this.add.rectangle(50, 20, 30, 30)
    .setInteractive({ useHandCursor: true })
    .setOrigin(0.5);

    startButton.on('pointerdown', () => {
        this.scene.start('StartScene', {  });
    });
    

    // Define WASD keys
    this.WASD = this.input.keyboard.addKeys({
      'W': Phaser.Input.Keyboard.KeyCodes.W,
      'S': Phaser.Input.Keyboard.KeyCodes.S,
      'A': Phaser.Input.Keyboard.KeyCodes.A,
      'D': Phaser.Input.Keyboard.KeyCodes.D
    });
    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const body = this.mouse.body;
    const speed = 3; //da decidere tra 3 (da provare ancora bene) e 2.5 (con 2.5 fatti 39 abbastanza in fretta)
    let vx = 0, vy = 0;
    if (this.cursors.left.isDown || this.WASD.A.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.WASD.D.isDown) vx = speed;
    if (this.cursors.up.isDown || this.WASD.W.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.WASD.S.isDown) vy = speed;

    this.mouse.setVelocity(vx, vy);
    // Optional: orientamento
    if (vx !== 0 || vy !== 0) {
      this.mouse.rotation = Math.atan2(vy, vx);
    }


    // Aggiorna punteggio a ogni frame
    this.scoreText.setText(`Punteggio: ${this.collectedCheese}`);


    // Aggiorna snake spawn rate
    const newSnakeRate = this.collectedCheese < 15 ? 1000 : 750;
    if (newSnakeRate !== this.currentSnakeRate) {
      this.currentSnakeRate = newSnakeRate;
      this.snakeTimer.remove();
      this.snakeTimer = this.time.addEvent({
        delay: this.currentSnakeRate,
        loop: true,
        callback: () => spawnSnake(this, this.mouse, this.collectedCheese)
      });
    }

    // Aggiorna cat spawn rate
    const newCatRate = this.collectedCheese < 25 ? 2000 : 1000;
    if (newCatRate !== this.currentCatRate) {
      this.currentCatRate = newCatRate;
      this.catTimer.remove();
      this.catTimer = this.time.addEvent({
        delay: this.currentCatRate,
        loop: true,
        callback: () => spawnCat(this, this.collectedCheese, this.mouse)
      });
    }

    // Aggiorna elephant spawn rate
    const randomElephant = Phaser.Math.Between(5000, 7000);
    const newElephantRate = this.collectedCheese < 31 ? 5000 : randomElephant;
    if (newCatRate !== this.currentCatRate) {
      this.currentCatRate = newCatRate;
      this.catTimer.remove();
      this.catTimer = this.time.addEvent({
        delay: this.currentCatRate,
        loop: true,
        callback: () => spawnCat(this, this.collectedCheese, this.mouse)
      });
    }







  }
  

 
  }


export { GameScene };
