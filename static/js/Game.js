class GameScene extends Phaser.Scene{
  constructor(key){
    super({key: key})
  }

  movementSetUp(){
    this.keyW = this.input.keyboard.addKey(87)
    this.keyS = this.input.keyboard.addKey(83)
    this.keyD = this.input.keyboard.addKey(68)
    this.keyA = this.input.keyboard.addKey(65)
  }
  levelSetup(){
    this.player = new Player(this,100,100,"mc")
    this.player.setDepth(1000)
    this.mapSetup()
  }

  mapSetup(){
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('Spritesheetv2', 'tileset');
    const ground = map.createLayer('background', tileset,0,0);
    const terrain = map.createLayer('terrain', tileset,0,0);
    console.log("HO")
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
    this.movementSetUp();
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
  }

  initPhysics(){
	//initiliase the physics of the character (drag, etc.)
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
    this.setCollideWorldBounds(true);
  }

  move(direction){
    if (direction == "l"){
      this.setVelocityX(-50)
      console.log("left")
    }
    else if (direction == "r"){
      this.setVelocityX(50)
      console.log("right")
    }
    if (direction == "u"){
      this.setVelocityY(-50)
      console.log("up")
    }
    else if (direction == "d"){
      this.setVelocityY(50)
      this.anims.play('down', true);
      console.log("down")
    }
    if (direction == ""){
      this.setVelocityX(0)
      this.setVelocityY(0)
      this.anims.stop();
    }
  }

  update(){
    if (this.scene.keyA.isDown){
      this.move("l")
    }
    else if (this.scene.keyD.isDown){
      this.move("r")
    }
    if (this.scene.keyW.isDown){
      this.move("u")
    }
    else if (this.scene.keyS.isDown){
      this.move("d")
    }
    if (this.scene.keyA.isUp && this.scene.keyD.isUp && this.scene.keyW.isUp && this.scene.keyS.isUp){
      this.move("")
    }
  }
}

class Test extends GameScene{
  constructor(){
    super("Test")
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