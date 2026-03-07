


export function onMouseCheeseCollision(mouse, cheese) {
  cheese.destroy();
  this.collectedCheese++;
  this.remainingCheese--;

  if (this.remainingCheese === 0) {
    spawnCheese(this, mouse);
  }
}

export function onMouseEnemyCollision(scene) {
  console.log("GAMEOVER")
  this.scene.pause();
}

//evento di collisione specifico per la scopa
export function onMouseBroomCollision(broom) {
  if (!broom || !broom.active) return;

  const now = this.time.now;

  if (now < this.knockbackUntil) return;
  if (broom.lastHitAt && now - broom.lastHitAt < 250) return;

  const dx = this.mouse.x - broom.x;
  const dy = this.mouse.y - broom.y;
  const len = Math.hypot(dx, dy) || 1;
  const pushStrength = 6;

  this.mouse.setVelocity((dx / len) * pushStrength, (dy / len) * pushStrength);
  this.knockbackUntil = now + 180;
  broom.lastHitAt = now;
}


export function spawnCheese(scene, mouse) {
  scene.remainingCheese = 5;
  scene.cheeses = []; // Array semplice
  let cheese;
  for (let i = 0; i < 5; i++) {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(50, 550);

    cheese = scene.matter.add.image(x, y, 'cheese');
    cheese.setCircle(15); // Hitbox circolare con raggio 15 (equivalente a 30x30 box)
    cheese.setStatic(true); // Non si muove
    cheese.setDepth(1);
    cheese.body.label = 'cheese'; // utile per riconoscerlo
    cheese.body.gameObject = cheese;
    scene.cheeses.push(cheese);
  }

  /*mouse.body.label = 'mouse';
  scene.matter.world.on('collisionstart', ev => {
    ev.pairs.forEach(({ bodyA, bodyB }) => {
      const labels = [bodyA.label, bodyB.label];
      if (labels.includes('mouse') && labels.includes('cheese')) {
        // recuperiamo il relativo sprite ovvero il gameObject.
        const cheeseSprite = (bodyA.label === 'cheese' ? bodyA : bodyB).gameObject;
        if (cheeseSprite) {
          onMouseCheeseCollision.call(scene, mouse, cheeseSprite);
        }
      }
    });
  });*/
}


export function spawnEnemyInRandomPlace(width, height){
  const CANVAS_WIDTH = width; //800
  const CANVAS_HEIGHT = height; //600

  const side = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left
  let startX, startY, targetX, targetY;

  switch (side) {
    case 0: // Top
      startX = Phaser.Math.Between(0, CANVAS_WIDTH);
      startY = -30;
      targetX = Phaser.Math.Between(0, CANVAS_WIDTH);
      targetY = CANVAS_HEIGHT + 30;
      break;
    case 1: // Right
      startX = CANVAS_WIDTH + 30;
      startY = Phaser.Math.Between(0, CANVAS_HEIGHT);
      targetX = -30;
      targetY = Phaser.Math.Between(0, CANVAS_HEIGHT);
      break;
    case 2: // Bottom
      startX = Phaser.Math.Between(0, CANVAS_WIDTH);
      startY = CANVAS_HEIGHT + 30;
      targetX = Phaser.Math.Between(0, CANVAS_WIDTH);
      targetY = -30;
      break;
    case 3: // Left
      startX = -30;
      startY = Phaser.Math.Between(0, CANVAS_HEIGHT);
      targetX = CANVAS_WIDTH + 30;
      targetY = Phaser.Math.Between(0, CANVAS_HEIGHT);
      break;
  }

  let coordinate = {'startX':startX, 'startY':startY, 'targetX':targetX, 'targetY':targetY}

  return coordinate
}

export function spawnSnake(scene, mouse, collectedCheese) {
  // Crea array logico se non esiste
  //if (!scene.snakes) scene.snakes = [];

  const SPEED = collectedCheese < 20? 1 : 1.5;
  const coordinate = spawnEnemyInRandomPlace(800, 600);
  const snake = scene.matter.add.image(coordinate.startX, coordinate.startY, 'snake');
  snake.setDepth(2)
  // Corpo rettangolare con sensor attivo
  snake.setBody({
    type: 'rectangle',
    width: 90,
    height: 45
  }, {
    isSensor: true, // no collisioni fisiche
    label: 'snake'
  });

  snake.setFrictionAir(0);
  snake.setIgnoreGravity(true);
  // Movimento lineare verso il target
  const dx = coordinate.targetX - coordinate.startX;
  const dy = coordinate.targetY - coordinate.startY;
  const len = Math.hypot(dx, dy) || 1;

  snake.setVelocity((dx / len) * SPEED, (dy / len) * SPEED);
  snake.rotation = Math.atan2(dy, dx);

  // Distruggi dopo 10s
  scene.time.delayedCall(10000, () => {
    snake.destroy();
    //scene.snakes = scene.snakes.filter(s => s !== snake);
  });

 // Listener collisioni (commentato per metterne uno unico)
  /*mouse.body.label = 'mouse';
    scene.matter.world.on('collisionstart', ev => {
      ev.pairs.forEach(({ bodyA, bodyB }) => {
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('snake') && labels.includes('mouse')) {
          onMouseEnemyCollision.call(scene);
        }
      });
    });*/

}

export function spawnCat(scene, collectedCheese, mouse){
  if(collectedCheese>=10){
  
    const coordinate = spawnEnemyInRandomPlace(800, 600);

    const cat = scene.matter.add.image(coordinate.startX, coordinate.startY, 'cat');
    cat.setDepth(2)
    cat.body.label = 'cat';
    cat.setBody({
      type: 'rectangle',
      width: 70,
      height: 40
      }, {
        isSensor: true, // no collisioni fisiche
        label: 'cat'
        });
        cat.setFrictionAir(0);
        cat.setIgnoreGravity(true);

    // Movimento lineare verso il target
    const SPEED = collectedCheese < 35 ? 1.5 : 2;
    const dx = coordinate.targetX - coordinate.startX;
    const dy = coordinate.targetY - coordinate.startY;
    const len = Math.hypot(dx, dy) || 1;
    cat.setVelocity((dx / len) * SPEED, (dy / len) * SPEED);
    cat.rotation = Math.atan2(dy, dx);

    // Elimina il gatto dopo 10 secondi
    scene.time.delayedCall(10000, () => {
      if (cat.active) {
        cat.destroy();
      }
    });

    // Listener collisioni (commentato per metterne uno unico)
    /*mouse.body.label = 'mouse';
    scene.matter.world.on('collisionstart', ev => {
      ev.pairs.forEach(({ bodyA, bodyB }) => {
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('cat') && labels.includes('mouse')) {
          onMouseEnemyCollision.call(scene);
        }
      });
    });*/
  }
}

export function spawnElephant(scene, collectedCheese, mouse){
  if(collectedCheese>=30){
  
    const coordinataX = Phaser.Math.Between(200, 650)
    const coordinataY = Phaser.Math.Between(200, 500)
    const targetX = Phaser.Math.Between(0, 800);
    const targetY = Phaser.Math.Between(0, 600);
    const angolo = Math.atan2(targetY - coordinataY, targetX - coordinataX);

    //non deve essere con matter per far si che combaci bene con il corpo
    const shadow = scene.add.image(coordinataX, coordinataY, 'elephant');
    shadow.setTint(0x000000).setScale(0.1).setDepth(0).setRotation(angolo);
   

    scene.tweens.add({
      targets: shadow,
      scale: 1.0,
      duration: 3000,
      ease: 'Sine.easeOut',
    });
  
    scene.time.delayedCall(3000, () => {
      const elephant = scene.matter.add.image(coordinataX, coordinataY, 'elephant');
      elephant.setDepth(2)
      elephant.body.label = 'elephant';
      elephant.setBody({
        type: 'rectangle',
        width: 130,
        height: 90
        }, {
          isSensor: true, // no collisioni fisiche
          label: 'elephant'
          });
          elephant.setFrictionAir(0);
          elephant.setIgnoreGravity(true);
          elephant.setRotation(angolo);
          elephant.setAngle(Phaser.Math.RadToDeg(angolo));

        // Elimina l'elefante
        scene.time.delayedCall(1500, () => {
          if (elephant.active) {
            shadow.destroy();
            scene.matter.world.remove(elephant.body);
            elephant.destroy();
          }
        });
    });

    // Listener collisioni (commentato per metterne uno unico)
    /*mouse.body.label = 'mouse';
    scene.matter.world.on('collisionstart', ev => {
      ev.pairs.forEach(({ bodyA, bodyB }) => {
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('elephant') && labels.includes('mouse')) {
          onMouseEnemyCollision.call(scene);
        }
      });
    });*/
  }
}
/* Versione in cui la scopa fa danno
export function spawnBroom(scene, collectedCheese, mouse){
  if(collectedCheese>=40){

    const coordinataX = Phaser.Math.Between(150, 650);
    const coordinataY = Phaser.Math.Between(150, 450);

    const broom = scene.matter.add.image(coordinataX, coordinataY, 'broom');
    broom.setDepth(2);
    broom.setBody({
      type: 'rectangle',
      width: 35,
      height: 110
    }, {
      isSensor: true,
      label: 'broom'
    });
    broom.setIgnoreGravity(true);
    broom.setStatic(true);
    broom.setSensor(false);

    scene.time.delayedCall(1200, () => {
      if (broom.active) {
        broom.setSensor(true);
        broom.setStatic(false);
        broom.setAngularVelocity(0.15);
      }
    });

    scene.time.delayedCall(3200, () => {
      if (broom.active) {
        scene.matter.world.remove(broom.body);
        broom.destroy();
      }
    });
  }
}*/

//Versione in cui la scopa respinge
export function spawnBroom(scene, collectedCheese, mouse){
  if(collectedCheese>=40){

    const coordinataX = Phaser.Math.Between(150, 650);
    const coordinataY = Phaser.Math.Between(150, 450);

    const broom = scene.matter.add.image(coordinataX, coordinataY, 'broom');
    broom.setDepth(2);
    broom.setBody({
      type: 'rectangle',
      width: 35,
      height: 110
    }, {
      isSensor: true,
      label: 'broom'
    });

    broom.setIgnoreGravity(true);
    broom.setStatic(true);
    broom.setSensor(true);
    broom.isTurning = false;
    broom.lastHitAt = 0;

    scene.time.delayedCall(1200, () => {
      if (broom.active) {
        broom.isTurning = true;

        broom.spinTimer = scene.time.addEvent({
          delay: 16,
          loop: true,
          callback: () => {
            if (broom.active) {
              broom.setAngle(broom.angle + 15);
            }
          }
        });
      }
    });

    scene.time.delayedCall(3200, () => {
      if (broom.active) {
        if (broom.spinTimer) {
          broom.spinTimer.remove();
        }
        scene.matter.world.remove(broom.body);
        broom.destroy();
      }
    });
  }
}

/*NOTE:
Commentati i singoli gestori delle collisioni per crearne uno unico
versione con scopa che fa danni
export function handleCollisionStart(event) {
  event.pairs.forEach(({ bodyA, bodyB }) => {
    const labels = [bodyA.label, bodyB.label];

    if (labels.includes('mouse') && labels.includes('cheese')) {
      const cheeseSprite = (bodyA.label === 'cheese' ? bodyA : bodyB).gameObject;
      if (cheeseSprite && cheeseSprite.active) {
        onMouseCheeseCollision.call(this, this.mouse, cheeseSprite);
      }
    }

    if (
      labels.includes('mouse') &&
      (labels.includes('snake') || labels.includes('cat') || labels.includes('elephant') || labels.includes('broom'))
    ) {
      onMouseEnemyCollision.call(this);
    }
  });
}*/

//Gestore collisioni con danni
export function handleCollisionStart(event) {
  event.pairs.forEach(({ bodyA, bodyB }) => {
    const labels = [bodyA.label, bodyB.label];

    if (labels.includes('mouse') && labels.includes('cheese')) {
      const cheeseSprite = (bodyA.label === 'cheese' ? bodyA : bodyB).gameObject;
      if (cheeseSprite && cheeseSprite.active) {
        onMouseCheeseCollision.call(this, this.mouse, cheeseSprite);
      }
    }

    if (
      labels.includes('mouse') &&
      (labels.includes('snake') || labels.includes('cat') || labels.includes('elephant'))
    ) {
      onMouseEnemyCollision.call(this);
    }
  });
}

//Gestore collisioni con respinta
export function handleCollisionActive(event) {
  event.pairs.forEach(({ bodyA, bodyB }) => {
    const labels = [bodyA.label, bodyB.label];

    if (labels.includes('mouse') && labels.includes('broom')) {
      const broomSprite = bodyA.label === 'broom' ? bodyA.gameObject : bodyB.gameObject;

      if (broomSprite && broomSprite.active && broomSprite.isTurning) {
        onMouseBroomCollision.call(this, broomSprite);
      }
    }
  });
}