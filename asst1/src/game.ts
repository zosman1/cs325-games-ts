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

class MyScene extends Phaser.Scene {
    radius: number
    
    constructor() {
        super(null);
        
        this.radius = 5000;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'map', 'assets/map.png' );
        this.load.image( 'greenbottle', "assets/greenbottle.png");
    }
    
    create() {
        
        const map = this.add.image(0, 0, 'map').setOrigin(0).setScale(.5);
        this.lights.enable().setAmbientColor(0x111111);

        map.setPipeline('Light2D');

        this.lights.addLight(470, 500, this.radius).setColor(0xffffff).setIntensity(5);

    }
    
    update() {
      
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
