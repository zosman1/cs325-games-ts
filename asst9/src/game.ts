import * as Phaser from "phaser";

class MyScene extends Phaser.Scene {
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    gameOver: boolean
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;


    constructor() {
        super(null);
        
        this.gameOver = false;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'rocket', 'assets/rocket.png' );
        this.load.image( 'map', 'assets/map.png');
        this.load.image( 'guard', 'assets/guard.png');
        this.load.image( 'player', 'assets/player.png');
        this.load.image( 'win', 'assets/win.png');
        this.load.image( 'wallh', 'assets/wallh.png');
        this.load.image( 'wallv', 'assets/wallv.png');
    }
    
    create() {
        const map = this.add.image(0, 0, 'map').setOrigin(0).setScale(.5);
        this.player = this.physics.add.image(0, 0, 'player').setCollideWorldBounds(true).setScale(.3).setDepth(1);
        


        //instructions
        this.add.text(this.player.x - 120, this.player.y - 90, `Capture the \napple of eden.\ndon't let the\nguards see you!`, {fontSize: "20px"})

        //setup cameras
        this.cameras.main.setZoom(3);
        this.cameras.main.startFollow(this.player, false, .3, .3)
        this.cameras.main.setBackgroundColor("#333333");

        //initiate cursors for movement and stuff later
        this.cursors = this.input.keyboard.createCursorKeys();
        
        //setup music
        //will have to try to come up with music for second itteration
        
        //setup physics

        //setup walls
        const walls = this.physics.add.group({immovable: true});
        this.createPhysicsObject(walls, 'wallv', 100, 50, .3)
        this.createPhysicsObject(walls, 'wallv', 100, 100, .3)
        this.createPhysicsObject(walls, 'wallv', 100, 200, .3)
        // this.createPhysicsObject(walls, 'wallv', 100, 300, .3)

        this.createPhysicsObject(walls, 'wallh', 50, 400, .3)
        this.createPhysicsObject(walls, 'wallh', 150, 400, .3)
        this.createPhysicsObject(walls, 'wallh', 250, 400, .3)

        this.createPhysicsObject(walls, 'wallv', 300, 350, .3)
        this.createPhysicsObject(walls, 'wallv', 300, 250, .3)
        this.createPhysicsObject(walls, 'wallh', 250, 200, .25)
        this.createPhysicsObject(walls, 'wallv', 300, 150, .3)

        this.createPhysicsObject(walls, 'wallh', 250, 10, .3)
        this.createPhysicsObject(walls, 'wallh', 150, 10, .3)

        this.createPhysicsObject(walls, 'wallh', 350, 100, .3)
        this.createPhysicsObject(walls, 'wallh', 450, 100, .3)

        this.createPhysicsObject(walls, 'wallh', 350, 10, .3)
        this.createPhysicsObject(walls, 'wallh', 450, 10, .3)
        this.createPhysicsObject(walls, 'wallh', 550, 10, .3)

        this.createPhysicsObject(walls, 'wallv', 600, 50, .3)
        this.createPhysicsObject(walls, 'wallv', 600, 150, .3)

        this.createPhysicsObject(walls, 'wallh', 550, 200, .3)
        this.createPhysicsObject(walls, 'wallh', 450, 200, .3)
        this.createPhysicsObject(walls, 'wallh', 350, 400, .3)

        this.createPhysicsObject(walls, 'wallv', 400, 350, .3)
        this.createPhysicsObject(walls, 'wallh', 450, 300, .3)
        this.createPhysicsObject(walls, 'wallh', 550, 300, .3)
        this.createPhysicsObject(walls, 'wallv', 600, 250, .3)






        //create guards

        const guards = this.physics.add.group();
        this.createPhysicsObject(guards, 'guard', 230, 100, .2, 0, 50)
        this.createPhysicsObject(guards, 'guard', 160, 350, .2, 0, -100)

        this.createPhysicsObject(guards, 'guard', 350, 350, .2, 0, -100)



        //create win
        const win = this.physics.add.image(550, 250, 'win').setScale(.5).setImmovable(true)

        // guards.children.get()
        // const guards = []
        // guards.push(this.physics.add.image(100, 100, 'guard').setScale(.3))

        this.physics.add.collider(this.player, [walls])

        this.physics.add.collider(this.player, guards, (obj1, obj2) => {
            alert("game over")
        })

        //@ts-ignore
        this.physics.add.collider(guards, walls, (obj1, obj2) => {
            //@ts-ignore
            // alert(obj1.velocity.x)
            obj1.flipY ? obj1.flipY=false : obj1.flipY=true;

            //@ts-ignore
            obj1.setVelocityX(-1 * obj1.velocityX);
            //@ts-ignore
            obj1.velocityX = -1 * obj1.velocityX
            // obj1.x += -1 * obj1.velocityX / 10

            //@ts-ignore
            obj1.setVelocityY(-1 * obj1.velocityY);
            //@ts-ignore
            obj1.velocityY = -1 * obj1.velocityY
            // obj1.y += -1 * obj1.velocityY / 10

        })


        this.physics.add.collider(this.player, win, (obj1, obj2) => { 
            this.gameOver = true;
            this.add.text(this.player.x + 10, this.player.y + 10, "You Won!", {fontSize: "20px"})
            // alert('win')
        })





    }
    createPhysicsObject(group: Phaser.Physics.Arcade.Group, sprite: string, x: number, y: number, scale: number, xv?: number, yv?: number){
        const newObject = group.create(x, y, sprite).setScale(scale);

        if(yv < 0) newObject.flipY = true;
        
        newObject.setVelocityX(xv || 0);
        newObject.setVelocityY(yv || 0);

        newObject.velocityX = xv || 0;
        newObject.velocityY = yv || 0;

        this.physics.add.existing(newObject);
    }

    update() {
        if(this.gameOver) return;
        this.handleMovement();
    }

    handleMovement(){
        //handleMovement
        const speed = 300
        if(this.cursors.up.isDown || this.cursors.down.isDown){
            this.player.setVelocityY(this.cursors.up.isDown? -speed: speed);
        }
        else{
            this.player.setVelocityY(0)
        }
        if(this.cursors.right.isDown || this.cursors.left.isDown){
            this.player.setVelocityX(this.cursors.left.isDown? -speed: speed);
        }
        else{
            this.player.setVelocityX(0);
        }
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 874,
    height: 620,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
