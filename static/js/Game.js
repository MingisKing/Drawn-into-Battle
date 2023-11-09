class GameScene extends Phaser.Scene{
  constructor(key){
    super({key: key})
  }

  keysSetUp(){
    this.keyW = this.input.keyboard.addKey(87)
    this.keyS = this.input.keyboard.addKey(83)
    this.keyD = this.input.keyboard.addKey(68)
    this.keyA = this.input.keyboard.addKey(65)
    this.keyEnter = this.input.keyboard.addKey(13)
  }

  mapSetup(){
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('Spritesheetv2', 'tileset');
    map.createLayer('background', tileset,0,0);
    this.terrain = map.createLayer('terrain', tileset,0,0);
    this.terrain.setCollisionByProperty({ collides: true });
    console.log("map setup")
  }
  
  levelSetup(){
    this.mapSetup()
    this.player = new Player(this,16,16,"mc")
    this.player.setDepth(1000)
  }
  
  preload(){
    this.load.spritesheet('mc', 'static/gameFiles/mc.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image('tileset', 'Tiled/Spritesheetv2.png');
    this.load.tilemapTiledJSON('map', 'static/gameFiles/background.json');
  }

  create(){
    this.levelSetup()
    this.keysSetUp();
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, 960, 640);
  }

  update(){
    this.player.update()
  }
}


class Player extends Phaser.Physics.Arcade.Sprite
{
  constructor(scene,x,y,spriteKey){
    super(scene,x,y,spriteKey)
    //initiliase any properties of the player here
    this.initPhysics()
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('mc', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('mc', { start: 10, end: 13 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('mc', { start: 15, end: 18 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('mc', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  }

  initPhysics(){
	//initiliase the physics of the character (drag, etc.)
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
    this.scene.physics.add.collider(this, this.scene.terrain);
  }

  update(){
    const speed = 100
    const prevVelocity = this.body.velocity.clone();

    this.setVelocity(0)

    if (this.scene.keyA.isDown){
      this.setVelocityX(-speed)
      console.log("left")
    }
    else if (this.scene.keyD.isDown){
      this.setVelocityX(speed)
      console.log("right")
    }
    if (this.scene.keyW.isDown){
      this.setVelocityY(-speed)
      console.log("up")
    }
    else if (this.scene.keyS.isDown){
      this.setVelocityY(speed)
      console.log("down")
    }

    this.body.velocity.normalize().scale(speed);

    if (this.scene.keyA.isDown){
      this.anims.play('left', true);
    }
    else if (this.scene.keyD.isDown){
      this.anims.play('right', true);
    }
    else if (this.scene.keyW.isDown){
      this.anims.play('up', true);
    }
    else if (this.scene.keyS.isDown){
      this.anims.play('down', true);
    }
    else {
      this.anims.stop();
      if (prevVelocity.x < 0) this.setTexture('mc', 15) // move left
      else if (prevVelocity.x > 0) this.setTexture('mc', 5) // move right
      else if (prevVelocity.y < 0) this.setTexture('mc', 10) // move up
      else if (prevVelocity.y > 0) this.setTexture('mc', 0) // move down
      if (this.scene.keyEnter.isDown){
        console.log("enter")
      }
    }
  }
}

class Test extends GameScene{
  constructor(){
    super("Test")
  }
}

class Menu extends GameScene{
  constructor(){
    super("Menu")
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800, 
  height: 600,
  fps:60,
  backgroundColor: 0x000000,
  pixelArt:true,
  physics: {
		default: 'arcade',

		fps:60,
	},
  scene:[Test],
}
  
var game = new Phaser.Game(config);