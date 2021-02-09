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
class MyScene extends Phaser.Scene {
    radius: number
    greenfill: number;
    redfill: number;
    text: Phaser.GameObjects.Text;
    
    constructor() {
        super(null);
        
        this.radius = 5000;
        this.greenfill = 0;
        this.redfill = 0;
        this.text = null;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'map', 'assets/map.png' );
        this.load.image( 'greenbottle', "assets/greenbottle.png");
        this.load.image( 'redbottle', "assets/redbottle.png")
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
        
        const map = this.add.image(0, 0, 'map').setOrigin(0).setScale(.5);
        this.lights.enable().setAmbientColor(0x111111);

        map.setPipeline('Light2D');

        this.lights.addLight(470, 500, this.radius).setColor(0xffffff).setIntensity(5);

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

    }
    
    update() {

      this.text.text = "Greenfill: " + this.greenfill + "  Redfill: " + this.redfill;
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
