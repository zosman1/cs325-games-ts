// import "./phaser.js";
import * as MatterJS from 'matter-js';
import * as Phaser from "phaser";
// @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
const Matter: typeof MatterJS = Phaser.Physics.Matter.Matter;


// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

function getCosFromDegrees(degrees: number): number{
    return Math.cos(degrees * Math.PI / 180);
}
function getSinFromDegrees(degrees: number): number{
    return Math.sin(degrees * Math.PI / 180);
}

class MyScene extends Phaser.Scene {

    gameOver: boolean;
    cannonAngle: number;
    cannonTimeout: boolean;
    trashBin: Phaser.GameObjects.Image;
    boundingBox: {
        topY: number,
        botY: number,
        leftX: number,
        rightX: number
    };
    balls: Phaser.Physics.Matter.Image[];
    score: number;
    text: Phaser.GameObjects.Text;


    constructor() {
        super(null);
        this.gameOver = false
        this.cannonAngle = 45;
        this.cannonTimeout = false;
        // this.trashBin = null;
        this.boundingBox = {
            topY: 0,
            botY: 0,
            leftX: 0,
            rightX: 0,
        }
        this.balls = []

        this.score = 0;
    }
    
    preload() {
        this.load.image('ball', 'assets/rocket.png');
        this.load.image('cannon', 'assets/Cannon.png');
        this.load.image('bin', 'assets/trash.png');
        this.load.image('map', 'assets/map.png');

    }

    updateBin(){
        // if(!this.trashBin) return;
        // this.trashBin.destroy();
        // this.trashBin.
        if(this.gameOver) return;

        const newY = 680 * Math.random() + 100;
        this.trashBin.setY(newY)
        this.boundingBox.botY = newY-100;
        this.boundingBox.topY = newY+100;
    }

    gameWin(){
        this.gameOver = true;
        this.add.text(200,200, "You won!",  {fontSize: "30px"});
    }

    gameLose(){
        this.gameOver = true;
        this.add.text(200,200, "You Lost, Try again!",  {fontSize: "30px"});
    }
    
    create() {


        const map = this.add.image(0, 0, 'map').setOrigin(0).setScale(.5);



        this.text = this.add.text(50, 50, "Score: N", {fontSize: "30px"})
        const temp_text = this.add.text(50, 100, "Get 5 trash balls into the garbage to win!", {fontSize: "30px"})

        setTimeout(() => {temp_text.destroy()}, 2000)
        // this.matter.world.setBounds();
        this.matter.world.setBounds(0,0,0,0,64,true,false,true,true)

        // const ball = this.matter.add.image(400, 100, 'ball')

        const cannon = this.add.image(150, 700, 'cannon');
        cannon.setAngle(-this.cannonAngle);

        this.trashBin = this.add.image(1000, 100, 'bin');

        this.boundingBox.botY = 100;
        this.boundingBox.topY = 200;

        this.boundingBox.leftX = 900;
        this.boundingBox.rightX = 1100;
        
        // setInterval(() => this.updateBin(), 500);


        this.updateBin()
        this.input.keyboard.on('keydown-LEFT', () => {
            if(this.gameOver) return;
            this.cannonAngle += 5;
            cannon.setAngle(-this.cannonAngle);
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if(this.gameOver) return;

            this.cannonAngle -= 5;
            cannon.setAngle(-this.cannonAngle);
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            if(this.gameOver) return;

            let velo = 20;
            velo += this.cannonAngle / 10
            if(this.cannonTimeout) return;
            setTimeout(() => {this.cannonTimeout = false}, 1000);
            this.cannonTimeout = true;
            const temp_ball = this.matter.add.image(150, 700, 'ball');
            temp_ball.setScale(.3)
            temp_ball.setAngle(-this.cannonAngle);
            temp_ball.setVelocity(velo * getCosFromDegrees(this.cannonAngle), -velo * getSinFromDegrees(this.cannonAngle))
            this.balls.push(temp_ball)
        });

        // this.input.on('pointerdown', function (pointer: { y: number; x: number; }) {

    
        // });
        
        // this.input.on('pointerdown', function (pointer: { y: number; x: number; }) {

        //     if (pointer.y > 300)
        //     {
        //         ball.setVelocity(0, -10);
        //     }
        //     else if (pointer.x < 400)
        //     {
        //         ball.setVelocityX(-8);
        //     }
        //     else
        //     {
        //         ball.setVelocityX(8);
        //     }
    
        // });
        

        // this.matter.add.mouseSpring();

        // // @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
        // const Matter: typeof MatterJS = Phaser.Physics.Matter.Matter;

        // const stack = this.matter.add.stack(250, 50, 6, 3, 0, 0, function(x: number, y:number) {
        //     //@ts-ignore
        //     return Matter.Bodies.rectangle(x, y, 50, 50, Phaser.Math.Between(20, 40));
        // });
        //     //@ts-ignore
        // // Matter.Bodies.rectangle(50, 50, 50, 50, Phaser.Math.Between(20, 40));
        // stack.bodies[0]



    }
    
    update() {
        if(this.score == 5){
            this.gameWin();
        }
        this.text.setText("Score: " + this.score)
        if(this.gameOver) return;
        if(!this.balls) return
        this.balls.forEach((ball, i) => {
            if(!ball) return;
            // console.
            if(!ball.x) return;

            if(ball.y > this.boundingBox.botY && 
                ball.y < this.boundingBox.topY &&
                ball.x > this.boundingBox.leftX && 
                ball.x < this.boundingBox.rightX){
                    // alert('yeet')
                    ball.destroy()
                    // this.balls.splice(i, i);
                    delete this.balls[i];
                    this.score += 1;
                    this.updateBin()
                    return;
                }
            if(ball.x > 1200){
                this.gameLose();
            }
        });
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 1240,
    height: 847,
    scene: MyScene,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0.8
            },
            debug: true,
            //@ts-ignore
            debugBodyColor: 0xffffff
        }
    }
});
