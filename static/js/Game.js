// Game stats

class Stats{
  constructor(at,def,hp){
    this.at = at
    this.def = def
    this.hp = hp
  }
}

class Weapon extends Stats{
  constructor(at,def,hp,name,element,type){
    super(at,def,hp)
    this.name = name
    this.element = element
    this.type = type
  }
}

class PlayerStats extends Stats{
  constructor(at,def,hp,name,weapon){
    super(at,def,hp)
    this.name = name
    this.weapon = weapon
  }

  attack(enemy){
    if(this.weapon.element == enemy.weak){
      enemy.hp -= this.at + this.weapon.at * 1.5 - enemy.def
    }
    else{
      enemy.hp -= this.at + this.weapon.at - enemy.def
    }
  }

  damage(dmg){
    this.hp -= dmg + this.def
  }

  checkdead(){
    return this.hp <= 0
  }
}

class EnemyStats extends Stats{
  constructor(at,def,hp,weak){
    super(at,def,hp)
    this.weak = weak
  }
}

//Opening Menu
class StartMenu extends Phaser.Scene{
  constructor(key){
    super({key: key})
  }

}

//Game Scene
class GameScene extends Phaser.Scene{
  constructor(){
    super({key: "GameScene"})
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
    this.player = new Player(this,48,80,"mc")
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

// Forge Scene
class ForgeScene extends Phaser.Scene{
  constructor(key){
    super({key: "ForgeScene"})
    
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

  preload(){
    this.load.image('forge', 'static/gameFiles/forge.png');
    this.load.image('swatch', 'static/gameFiles/swatch.png')
    this.load.image('done', 'static/gameFiles/done.png')
    console.log("forge setup")
  }

  create(){
    this.keysSetUp();
    this.forge = this.add.image(400, 300, 'forge')
    this.done = this.add.image(212.5-32, 500, 'done').setInteractive()

    this.done.on('pointerdown', function (pointer){
      this.setTint(0xADD8E6);
    });

    this.done.on('pointerout', function (pointer){
      this.clearTint();
    });

    this.done.on('pointerup', function (pointer){
      this.clearTint();
      this.scene.scene.start("GameScene")
    });

    console.log("forge")

    // Create a graphics object to draw with
    this.isDrawing = false;
    this.currColor = 0xffffff
    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillRect(50, 162.5, 275, 275);

    // Set up pointer events for drawing
    this.input.on('pointerdown', this.startDrawing, this);
    this.input.on('pointermove', this.draw, this);
    this.input.on('pointerup', this.stopDrawing, this);

    // Create a swatch to change colors with
    this.swatch = this.add.image(800-(425/2), 600-(275/2), 'swatch').setInteractive()
    this.swatch.on('pointerdown', this.changeColor, this)
  }

  startDrawing(pointer) {
    this.isDrawing = true;
    this.graphics.beginPath();
    this.graphics.moveTo(pointer.x, pointer.y);
  }

  draw(pointer) {
    if (!this.isDrawing) return;
    const worldX = this.input.activePointer.worldX;
    const worldY = this.input.activePointer.worldY;

    if (worldX > 50 && worldX < 275+50 && worldY > 162.5 && worldY < 275+162.5) {
      this.graphics.lineTo(pointer.x, pointer.y);
      this.graphics.strokePath();
    }
  }

  stopDrawing() {
    this.isDrawing = false;
  }
  
  changeColor(){
    const worldX = this.input.activePointer.worldX;
    const worldY = this.input.activePointer.worldY;

    this.swatch.on('pointerdown', () => {
      var color = this.textures.getPixel(worldX-(800-425), worldY-(600-275), 'swatch');
      console.log(color)
      if (color) {
        var colorHex = Phaser.Display.Color.RGBToString(color.r, color.g, color.b, 0, '0x');
        console.log(worldX - (800 - 425), worldY - (600 - 275), colorHex);
        this.currColor = colorHex
      } else {
        console.log("Pixel outside the bounds of the texture.");
      }
    });
  }

  update(){
    this.graphics.lineStyle(5, this.currColor, 1);
    if (this.keyEsc.isDown){
      console.log("escape")
      this.scene.start("GameScene")
    }
  }
}

// Menu
class Menu extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture){
    super(scene, x, y, texture)
    this.setScrollFactor(0)

    this.on('pointerdown', function (pointer){
      this.setTint(0xADD8E6);
    });

    this.on('pointerout', function (pointer){
      this.clearTint();
    });

    this.on('pointerup', function (pointer){
      this.clearTint();
      this.setInteractive(false)
      this.scene.scene.start("ForgeScene")
      console.log("startforge")
    });
  }

  MenuSetUp(){
    this.setInteractive()
    this.scene.add.existing(this)
    this.setDepth(1000)
  }

}

// Player
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
  scene:[GameScene, ForgeScene],
  autoCenter:true,
}
  
var game = new Phaser.Game(config);