// "use strict";

import * as Phaser from "phaser";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

function preload() {
    // Load an image and call it 'logo'.
    this.load.image( 'logo', 'assets/phaser.png' );
}

let bouncy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

function create() {
    // Create a sprite at the center of the screen using the 'logo' image.
    bouncy = this.physics.add.sprite( this.cameras.main.centerX, this.cameras.main.centerX, 'logo' );
    
    // Make it bounce off of the world bounds.
    //@ts-ignore
    bouncy.body.collideWorldBounds = true;
    
    // Make the camera shake when clicking/tapping on it.
    bouncy.setInteractive();
    bouncy.on( 'pointerdown', function( ) {
        this.scene.cameras.main.shake(500);
        });
    
    // Add some text using a CSS style.
    // Center it in X, and position its top 15 pixels from the top of the world.
    let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
    let text = this.add.text( this.cameras.main.centerX, 15, "Build something amazing.", style );
    text.setOrigin( 0.5, 0.0 );
}

function update() {
    // Accelerate the 'logo' sprite towards the cursor,
    // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
    // in X or Y.
    // This function returns the rotation angle that makes it visually match its
    // new trajectory.
    bouncy.rotation = this.physics.accelerateToObject( bouncy, this.input.activePointer, 500, 500, 500 );
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    // Phaser converts a dictionary of methods into a Scene subclass.
    scene: { preload: preload, create: create, update: update },
    physics: { default: 'arcade' },
    });
