import { io, Socket } from "socket.io-client";
import Phaser from "phaser";
import table from "../../assets/images/table.png";
import paddle from "../../assets/images/paddle.png";
import ball from "../../assets/images/ball.png";
import restartButton from "../../assets/images/restartButton.png";
import youlose from "../../assets/images/youlose.png";
import youwin from "../../assets/images/youwin.png";
export default class TitleScreen extends Phaser.Scene
{
    ballScale: number = 0.19;
    paddleScale: number = 0.4;
    ballspeed: number = 600;
    bounds: number = 100;
    textSize: number = 65;
    leftScore: number = 0;
    rightScore: number = 0;
    h: number = 0;
    w: number = 0;
    bg: Phaser.GameObjects.Sprite;
    ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    paddle: Phaser.GameObjects.Sprite;
    enemy: Phaser.GameObjects.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    leftScoretxt: Phaser.GameObjects.Text;
    rightScoretxt: Phaser.GameObjects.Text;
    roomId: string = "";

    preload () : void
    {
        this.h = this.cameras.main.height;
        this.w = this.cameras.main.width;
        this.load.image('table', table);
        this.load.image('ball', ball);
        this.load.image('paddle', paddle);
        this.load.image('restart', restartButton);
        this.load.image('youwin', youwin);
        this.load.image('youlose', youlose);
    }
    
    create() : void
    {
        // no collision detection on left side and right side 
        this.physics.world.setBounds(-this.bounds, 0, this.w + (this.bounds * 2), this.h);
        
        // const ser = http.createServer()
        const socket = io("http://127.0.0.1:3001/game", {withCredentials: true});

        
        // resize the images to fit the window
        this.bg = this.add.sprite(this.w / 2, this.h / 2, 'table');
        
        // loading a ball add sprite to the 
        this.ball = this.physics.add.sprite(this.w / 2, this.h / 2, 'ball');
        this.ball.setScale(this.ballScale); // scale the sprit 
        this.ball.setBounce(1, 1); // set the bounce effect to the ball 
        this.ball.setCollideWorldBounds(true, 1, 1); // set the bounce with world 
        
        
        // add the paddle 
        this.paddle = this.add.sprite(30, ( ( (this.h / 2) - (this.h / 3) ) / 2) + (this.h / 3), 'paddle').setOrigin(0,0);
        this.paddle.setScale(this.paddleScale); // scale the sprit
        this.physics.add.existing(this.paddle, true); // set the physicss to paddle !!
        this.physics.add.collider(this.paddle, this.ball); // set the collider with paddle and the ball 
        
        // enemie paddle
        // this.enemy = this.add.sprite((this.w - (this.paddle.width *this.paddleScale) - 30) , ( ( (this.h / 2) - (this.h / 3) ) / 2) + (this.h / 3), 'paddle').setOrigin(0,0);
        // this.enemy.setScale(this.paddleScale); // scale the sprit
        // this.physics.add.existing(this.enemy, true); // set the physicss to paddle !!
        // this.physics.add.collider(this.enemy, this.ball); // set the collider with paddle and the ball 
        
        // movement ball
        this.resetball(); 
        
        // get the input from the user using "phaser-user-input-system"
        this.cursors = this.input.keyboard.createCursorKeys();
        
        /////////////////////////////// text ////////////////////////
        this.leftScoretxt = this.add.text((this.w / 2) - (this.w / 10) , 30, this.leftScore.toString(), {
            font: this.textSize + "px Arial",
            align: "center"
        });
        
        this.rightScoretxt = this.add.text((this.w / 2) + (this.w / 10) , 30, this.rightScore.toString(), {
            font: this.textSize + "px Arial",
            align: "center"
        });
        
        socket.on("startGame", ( room) => {
            console.log("game start on !!!");
            this.roomId = room;
            this.createEnemy();
            this.input.keyboard.enabled = true;
            this.ball.setBounce(1, 1); // set the bounce effect to the ball 
            this.ball.setCollideWorldBounds(true, 1, 1); // set the bounce with world 
            // this.scene.start();
        });

        if (this.roomId == "")
        {
            this.ball.body.stop();
            this.input.keyboard.enabled = false;
        }
    }
    createEnemy() : void
    {
        this.enemy = this.add.sprite((this.w - (this.paddle.width * this.paddleScale) - 30) , ( ( (this.h / 2) - (this.h / 3) ) / 2) + (this.h / 3), 'paddle').setOrigin(0,0);
        this.enemy.setScale(this.paddleScale); // scale the sprit
        this.physics.add.existing(this.enemy, true); // set the physicss to paddle !!
        this.physics.add.collider(this.enemy, this.ball);
    }

    resetball()  : void
    {
        this.ball.setPosition(this.w / 2, this.h / 2)
        const angle = Phaser.Math.Between(400, 1000);
        // const vec = this.physics.velocityFromAngle(angle, this.ballspeed);
        // console.log(vec);//
        this.ball.body.setVelocity(angle, this.ballspeed); // set the velocity to the ball
    }

    winner(img: string)  : void
    {
        this.ball.body.stop();
        this.input.keyboard.enabled = false;
        var sprite = this.add.sprite(this.w/2, this.h/2, 'restart').setInteractive();
        sprite.on('pointerdown', () =>
        {
            this.input.keyboard.enabled = true;
            this.leftScore = 0;
            this.rightScore = 0;
            this.scene.restart();
        });
        this.add.sprite(this.w/2, this.h/2 - sprite.height, img);
    }

    update () : void
    {
        this.ballspeed += 0.5;
        this.ball.body.velocity.normalize().scale(this.ballspeed);
        if (this.rightScore >= 10)
            this.winner("youlose");
        else if (this.leftScore >= 10)
            this.winner("youwin");
    
        if (this.cursors.up.isDown && ( this.paddle.y - 10) >= 0)
        {
            this.paddle.y -= 10;
            if('updateFromGameObject' in this.paddle.body) {
                this.paddle.body.updateFromGameObject();
            }
        }
        else if (this.cursors.down.isDown && (this.paddle.y +
            (Phaser.Math.RoundTo(this.paddle.height * this.paddleScale, 0))
            + 10) <= this.h)
        {
            this.paddle.y += 10;
            if('updateFromGameObject' in this.paddle.body) {
                this.paddle.body.updateFromGameObject();
            }
        }
    
        if (this.ball.x < 0)
        {
            /// add score to left user
            /******************* update the position of the paddle ************************/
            this.paddle.setPosition( 30, ( ( (this.h / 2) - (this.h / 3) ) / 2) + (this.h / 3));
            if('updateFromGameObject' in this.paddle.body) {
                this.paddle.body.updateFromGameObject();
            }
            /******************************************************************************/
        
            /******************* add score for the leftUser *******************************/
            this.rightScore += 1;
            this.rightScoretxt.text = this.rightScore.toString();
            /******************************************************************************/
    
            /******************* update the position of the ball **************************/
            this.resetball();
            /******************************************************************************/
    
        }
        else if (this.ball.x > this.w)
        {
            /// add score to right user
    
            /******************* update the position of the paddle ************************/
            this.paddle.setPosition( 30, ( ( (this.h / 2) - (this.h / 3) ) / 2) + (this.h / 3));
            if('updateFromGameObject' in this.paddle.body) {
                this.paddle.body.updateFromGameObject();
            }
            /******************************************************************************/
    
            /******************* add score for the leftUser *******************************/
            this.leftScore += 1; 
            this.leftScoretxt.text = this.leftScore.toString();
            /******************************************************************************/
    
            /******************* update the position of the ball **************************/
            this.resetball();
            /******************************************************************************/
        }
    }
}

