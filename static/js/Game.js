class StartMenu extends Phaser.Scene{
  constructor(key){
    super({key: key})
  }

}

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
    this.keyUp = this.input.keyboard.addKey(38)
    this.keyDown = this.input.keyboard.addKey(40)
    this.keyLeft = this.input.keyboard.addKey(37)
    this.keyRight = this.input.keyboard.addKey(39)
    this.keySpace = this.input.keyboard.addKey(32)
    this.keyEsc = this.input.keyboard.addKey(27)
  }

  mapSetup(){
    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('Spritesheetv2', 'tileset');
    this.background = this.map.createLayer('background', this.tileset,0,0);
    this.background.setCollisionByProperty({ water: true });
    this.terrain = this.map.createLayer('terrain', this.tileset,0,0);
    this.terrain.setCollisionByProperty({ collides: true });
    console.log("map setup")
  }
  
  levelSetup(){
    this.mapSetup()
    this.menu = new Menu(this,800,300,"menu")
    this.player = new Player(this,16,48,"mc")
    this.player.setDepth(1000)
    this.sound.add('boop')
  }
  
  preload(){
    this.load.spritesheet('mc', 'static/gameFiles/mc.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image('tileset', 'Tiled/Spritesheetv2.png');
    this.load.tilemapTiledJSON('map', 'static/gameFiles/background.json');
    this.load.image('menu', 'static/gameFiles/menu.png');
    this.load.audio('boop', 'static/gameFiles/boop.mp3')
  }

  create(){
    this.levelSetup()
    this.keysSetUp();
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, 1280, 960);
  }

  update(){
    this.player.update()
  }
}

class Menu extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture){
    super(scene, x, y, texture)
    this.setScrollFactor(0)
  }

  MenuSetUp(){
    this.scene.add.existing(this)
    this.setDepth(1000)
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
    this.scene.physics.add.collider(this, this.scene.terrain, () => {
      this.scene.sound.play('boop')
      console.log("collide")
    });
    this.scene.physics.add.collider(this, this.scene.background);
  }

  update(){
    const speed = 200
    const prevVelocity = this.body.velocity.clone();

    this.setVelocity(0)

    if (this.scene.keyA.isDown || this.scene.keyLeft.isDown){
      this.setVelocityX(-speed)
      console.log("left")
    }
    else if (this.scene.keyD.isDown || this.scene.keyRight.isDown){
      this.setVelocityX(speed)
      console.log("right")
    }
    if (this.scene.keyW.isDown || this.scene.keyUp.isDown){
      this.setVelocityY(-speed)
      console.log("up")
    }
    else if (this.scene.keyS.isDown || this.scene.keyDown.isDown){
      this.setVelocityY(speed)
      console.log("down")
    }

    this.body.velocity.normalize().scale(speed);

    if (this.scene.keyA.isDown || this.scene.keyLeft.isDown){
      this.anims.play('left', true);
    }
    else if (this.scene.keyD.isDown || this.scene.keyRight.isDown){
      this.anims.play('right', true);
    }
    else if (this.scene.keyW.isDown || this.scene.keyUp.isDown){
      this.anims.play('up', true);
    }
    else if (this.scene.keyS.isDown || this.scene.keyDown.isDown){
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
        this.scene.menu.setVisible(true)
        this.scene.menu.MenuSetUp()
        
      }
      if (this.scene.keyEsc.isDown && this.scene.menu){
        console.log("escape")
        this.scene.menu.setVisible(false)
      }
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
  autoCenter:true,
}
  
var game = new Phaser.Game(config);