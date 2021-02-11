// import "./phaser.js";

import * as Phaser from "phaser";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class


//examples from 
//http://phaser.io/examples/v3/view/input/dragging/drag-time-threshold
//https://blog.ourcade.co/posts/2020/phaser-3-object-reveal-flashlight-spotlight-magic-lens/
class MyScene extends Phaser.Scene {
    radius: number
    greenfill: number;
    redfill: number;
    text: Phaser.GameObjects.Text;
    cover: Phaser.GameObjects.Image;
    light: Phaser.GameObjects.Arc;
    renderTexture: Phaser.GameObjects.RenderTexture;
    gameover: boolean;
    textHelper: Phaser.GameObjects.Text;
    music: Phaser.Sound.BaseSound;
    
    constructor() {
        super(null);
        
        this.radius = 100;
        this.greenfill = 3;
        this.redfill = 3;
        this.text = null;
        this.gameover = false;
        this.music = null;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'map', 'assets/map.png' );
        this.load.image( 'greenbottle', "assets/greenbottle.png");
        this.load.image( 'redbottle', "assets/redbottle.png")
        this.load.audio( 'main', "assets/mk4.mp3")
    }
    
    spawnGreen(){
        const greenbottle = this.add.sprite(70, 400, 'greenbottle').setInteractive();
        this.input.setDraggable(greenbottle);
        greenbottle.name = "green"
    }
    spawnRed(){

        const redbottle = this.add.sprite(800, 400, 'redbottle').setInteractive();
        this.input.setDraggable(redbottle);
        redbottle.name = "red"
    }
    create() {
		const reveal = this.add.image(0, 0, 'map').setOrigin(0).setScale(.5);
		this.cover = this.add.image(0, 0, 'map').setOrigin(0).setScale(.5);
        this.cover.setTint(0x002c49)
        
        this.music = this.sound.add('main', {loop: true});
        this.music.play();

		const width = this.cover.width
		const height = this.cover.height

		const rt = this.make.renderTexture({
			width,
            height,
            //@ts-ignore-next-line
			add: false
		})

		const maskImage = this.make.image({
			x: 0,
			y: 0,
			key: rt.texture.key,
			add: false
		})

		this.cover.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage)
		this.cover.mask.invertAlpha = true

		reveal.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage)

		// this.light = this.add.circle(0, 0, 30, 0x000000, 1)
		// this.light.visible = false


		this.renderTexture = rt 
        this.spawnGreen();
        this.spawnRed();


        this.input.on('drag', function (pointer: any, gameObject: { x: any; y: any; }, dragX: any, dragY: any) {

            gameObject.x = dragX;
            gameObject.y = dragY;
    
        });
        // addGreen(){
        //     this.greenfill +=1;
        // }
        const greenDrop = () => {
            this.greenfill += 1
            this.spawnGreen()
        }
        const redDrop = () => {
            this.redfill += 1
            this.spawnRed()
        }
        this.input.on('dragend', function (pointer: any, gameObject: { x: number; y: number; name: string; destroy: () => void; }) {
            console.warn(gameObject.x);
            console.warn(gameObject.y);
            if(gameObject.x > 350 && gameObject.x < 500
                && gameObject.y > 400){
                    console.warn(gameObject.name);

                    gameObject.name == "green" ? greenDrop() : redDrop()
                    gameObject.destroy();

                }
    
        });

        this.text = this.add.text(0,0, "hello", { fontFamily: 'Georgia'});
        this.textHelper = this.add.text(0,200, "The darkness is closing in, mix red and \ngreen chemicals to create.. light.", { fontFamily: 'Georgia', fontSize: "40px"});

        
        setTimeout(() => setInterval(() => this.update_game(), 2000), 3000);   
            //  setTimeout(() => this.win_game(), 200);

        setTimeout(() => this.win_game(), 120000);
    }

    win_game(){
        this.gameover = true;
        this.textHelper.text = "You won! You survived the darkness,\n and became one with the light.\n Live Long, and Prosper."
    }
    update_game(){
        if(this.gameover){
            // this.textHelper.text = "Game Over!";
            return;
        }
        this.textHelper.text = ""

        if(this.greenfill == 0 || this.redfill == 0){
            this.radius = this.radius - 50
        } else {
            if(this.radius < 500) this.radius = this.radius + 50
        }

        // if(this.radius < 500)
        this.greenfill = this.greenfill - Math.floor(Math.random() * 3)
        this.redfill = this.redfill - Math.floor(Math.random() * 3)
        if(this.greenfill < 0){
            this.greenfill = 0
        }
        if(this.redfill < 0){
            this.redfill = 0
        }


   
        

        if(this.radius < 70){
            this.gameover = true;
            this.textHelper.text = "The darkness took you,\n may you rest, in peace."
            // alert("You lost! Reload to try again")
        }

        if(this.gameover){
            this.text.text = "Game Over!";
        }

        // alert(this.radius)
        // if
        // alert(this.greenfill)
    }
    
    update() {
        if(this.gameover){
            this.music.stop();
            return
        }
        const greenBar = this.add.graphics();
        const greenBox = this.add.graphics();
        greenBox.fillStyle(0x222222, 0.6);
        greenBox.fillRect(240, 600, 50, -200);

        greenBar.fillStyle(0x00ff00, 1);
        greenBar.fillRect(240, 600, 50, -200*this.greenfill/10)

        const redBar = this.add.graphics();
        const redBox = this.add.graphics();
        redBox.fillStyle(0x222222, 0.6);
        redBox.fillRect(630, 600, 50, -200);

        redBar.fillStyle(0xff0000, 1);
        redBar.fillRect(630, 600, 50, -200*this.redfill/10)

        const lcircle= this.add.circle(0, 0, this.radius, 0x000000, 1)
        lcircle.visible = false;
        this.renderTexture.clear()
        this.renderTexture.draw(lcircle, 1330, 1100)
        this.text.text = "Greenfill: " + this.greenfill + "  Redfill: " + this.redfill;
        if(this.gameover){
            this.text.text = "Game Over!";
        }

    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 847,
    height: 620,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
