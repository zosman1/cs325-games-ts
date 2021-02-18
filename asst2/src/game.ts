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


// references from: https://phaser.io/examples/v3/view/games/breakout/breakout
class MyScene extends Phaser.Scene {
    bouncy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    bricks: Phaser.Physics.Arcade.StaticGroup;
    balls: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[];
    paddle: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    horiz: number;
    speed: number;
    ballnum: number;
    gameOver: boolean;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    timer: Phaser.GameObjects.Text;
    gameTime: number;
    
    constructor() {
        super(null);
        
        // this.bouncy = null;
        this.horiz = 400;
        this.speed = 20;
        this.ballnum = 0;
        this.gameOver = false;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        // this.load.image( 'rocket', 'assets/rocket.png' );
        this.load.image( 'map', 'assets/map.png');
        this.load.image( 'ball', 'assets/ball.png');
        this.load.image( 'paddle', 'assets/paddle.png');
    

    }
    
    create() {

    this.cursors = this.input.keyboard.createCursorKeys();

    const map = this.add.image(0, 0, 'map').setOrigin(0).setScale(.5);


    
    this.timer = this.add.text(650, 100, "Timer: 0:00", {fontSize: "30px"});
    this.gameTime = 0;
    // this.input.keyboard.on('keydown-RIGHT', () => this.moveLeft());
    // this.input.keyboard.on('keydown-LEFT', () => this.moveRight());


    
    //  Enable world bounds, but disable the floor
    this.physics.world.setBoundsCollision(true, true, false, false);

    //  Create the bricks in a 10x6 grid
    // this.bricks = this.physics.add.staticGroup({
    //     key: 'assets', frame: [ 'blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1' ],
    //     frameQuantity: 10,
    //     gridAlign: { width: 10, height: 6, cellWidth: 64, cellHeight: 32, x: 112, y: 100 }
    // });

    // this.balls

    this.paddle = this.physics.add.image(400, 400, 'paddle').setImmovable().setScale(.3);
    
    
    this.balls = [];
    for(let i = 0; i < 100; i++){
        console.log(i)
        this.balls[i] = this.physics.add.image(Math.random() * 800, -20, 'ball').setCollideWorldBounds(true).setBounce(1).setScale(.3);
        this.balls[i].setData('onPaddle', true);
        this.physics.add.collider(this.balls[i], this.paddle, this.hitPaddle, null, this);

    }

    setInterval(() => this.releaseBalls(), 1400);
    setInterval(() => this.updateTimer(), 100);
    const introtext = this.add.text(0,0, "Keep Earths Last Oasis Alive for 20 seconds!\nProtect our water supply from the poisonous red balls", { fontFamily: "Georgia", fontSize: "30px"})
    setTimeout(() => {introtext.destroy()}, 1000)
    // setTimeout(() => {this.winGame()}, 3000);
    setTimeout(() => {this.winGame()}, 20000);
    //  = this.physics.add.image(400, 350, 'ball').setCollideWorldBounds(true).setBounce(1).setScale(.3);
    // this.ball.setData('onPaddle', true);

    // this.paddle = this.physics.add.image(400, 400, 'paddle').setImmovable().setScale(.3);

    //  Our colliders
    // this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);

    //  Input events
    // this.input.on('pointermove', function (pointer: { x: number; }) {

    //     //  Keep the paddle within the game
    //     this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748);

    //     if (this.ball.getData('onPaddle'))
    //     {
    //         this.ball.x = this.paddle.x;
    //     }

    // }, this);

    // this.input.on('pointerup', function (pointer: any) {

    //     if (this.ball.getData('onPaddle'))
    //     {
    //         this.ball.setVelocity(-75, -300);
    //         this.ball.setData('onPaddle', false);
    //     }

    // }, this);

    }

    moveLeft(){
        this.horiz -= this.speed;
        this.paddle.x = Phaser.Math.Clamp(this.horiz, 52, 748);
    }
    
    moveRight(){
        this.horiz += this.speed;
        this.paddle.x = Phaser.Math.Clamp(this.horiz, 52, 748);
    }

    updateTimer(){
        if(this.gameOver) return;
        this.gameTime += .1
        this.timer.text = `Timer: ${this.gameTime}`

    }


    // hitBrick(ball : Phaser.Types.Physics.Arcade.GameObjectWithBody, brick:Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    //     //@ts-ignore
    //     brick.disableBody(true, true);

    //     if (this.bricks.countActive() === 0) {
    //         this.resetLevel();
    //     }
    // }

    // resetBall() {
    //     this.ball.setVelocity(0);
    //     this.ball.setPosition(this.paddle.x, 500);
    //     this.ball.setData('onPaddle', true);
    // }

    resetLevel() {
        // this.resetBall();

        this.bricks.children.each(function (brick) {
            //@ts-ignore-next-line
            brick.enableBody(false, 0, 0, true, true);

        });
    }
    
    //@ts-ignore
    hitPaddle(ball : Phaser.Types.Physics.Arcade.GameObjectWithBody, paddle : Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        var diff = 0;

        //@ts-ignore
        if (ball.x < paddle.x) {
            //  Ball is on the left-hand side of the paddle
            //@ts-ignore
            diff = paddle.x - ball.x;
            //@ts-ignore
            ball.setVelocityX(-10 * diff);
        }
        //@ts-ignore
        else if (ball.x > paddle.x) {
            //  Ball is on the right-hand side of the paddle
            //@ts-ignore
            diff = ball.x - paddle.x;
            //@ts-ignore
            ball.setVelocityX(10 * diff);
        }
        else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            //@ts-ignore
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }
    loseGame() {
        if(this.gameOver) return;
        this.add.text(0, 0, "Earth's Last Oasis was destroyed!\nTry again by refreshing the page", { fontFamily: 'Georgia', fontSize: "40px" });
        this.gameOver = true;
        //game is over, shiiiiit
    }
    winGame() {
        if(this.gameOver) return;
        this.add.text(0, 0, "You saved humanities last fresh water\n source! Congratulations!", { fontFamily: 'Georgia', fontSize: "40px" });
        this.gameOver = true;
    }

    releaseBalls(){
        if(this.gameOver) return;
        // console.warn("release")
        // console.error(this.ballnum)
        const rand = Math.floor(Math.random() * 3);
        if(!this.balls[this.ballnum]) return;
        let ballnumtemp = this.ballnum;
        for(let i = this.ballnum; i < this.ballnum + rand; i++){
            setTimeout(() => {
                this.balls[i].setVelocity(Math.random() * 50, 300);
                this.balls[i].setData('OnPaddle', false);
                // ballnumtemp ++;
                this.ballnum ++;
            }, (i - this.ballnum) * 500)
        }

        this.ballnum = ballnumtemp;
        return;
    //         this.ball.setVelocity(-75, -300);
    //         this.ball.setData('onPaddle', false);
    }

    update() {
    // this.input.keyboard.on('keydown-RIGHT', () => this.moveLeft());
    // this.input.keyboard.on('keydown-LEFT', () => this.moveRight());

        if(this.cursors.right.isDown){
            this.moveRight();
        } else if (this.cursors.left.isDown) {
            this.moveLeft();
        }

        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //@ts-ignore
        // if (this.ball.y > 600)
        // {
        //     // this.resetBall();
        //     this.loseGame();
        // }
        // if(this.ball)
        for(let i = this.ballnum - 5; i < this.ballnum + 5; i++){
            if(!this.balls[i]) continue;
            if(this.balls[i].y > 600){
                this.loseGame();
            }
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
