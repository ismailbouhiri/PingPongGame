import { io } from "socket.io-client";
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
    leftScore: number = 0 ;
    rightScore: number = 0;
    h: number = 0;
    w: number = 0;
    bg: Phaser.GameObjects.Sprite;
    ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody = null;
    paddle: Phaser.GameObjects.Sprite = null;
    soc: any = null;
    enemy: Phaser.GameObjects.Sprite = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys = null;;
    leftScoretxt: Phaser.GameObjects.Text;
    rightScoretxt: Phaser.GameObjects.Text;
    posx: number = 0;
    eposx: number = 0;
    posy: number = 0;
    data: any = null;
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


        if (!this.soc)
            this.soc = io("http://127.0.0.1:3001/game", {withCredentials: true});
        
        // resize the images to fit the window
        this.bg = this.add.sprite(this.w / 2, this.h / 2, 'table');
        
        
        // add the paddle 
        
        /////////////////////////////// text ////////////////////////
        this.leftScoretxt = this.add.text((this.w / 2) - (this.w / 10) , 30, this.leftScore.toString(), {
            font:"65px Arial",
            align: "center"
        });
        
        this.rightScoretxt = this.add.text((this.w / 2) + (this.w / 10) , 30, this.rightScore.toString(), {
            font:"65px Arial",
            align: "center"
        });
        
        this.soc.on("startGame", () => {
            this.startGame();
        });

        this.soc.on("saveData", (data: {
            player: string,
            is_player: boolean,
            roomId: string
        }) => {
            this.data = data;
            this.startGame();
        });
    }

    startGame() : void
    {
        // loading a ball add sprite to the 
        console.log(this.soc.data);
        this.posx = (this.data.player == "player1") ? 30: this.w - (145 * this.paddleScale) - 30 ;
        this.eposx = (this.data.player != "player1") ? 30: this.w - (145 * this.paddleScale) - 30 ;
        this.posy = ( ( (this.h / 2) - (this.h / 3) ) / 2) + (this.h / 3);
        this.createBall();
        if (this.data.player == "player1")
            this.paddle = this.add.sprite(this.posx, this.posy, 'paddle').setOrigin(0,0);
        else 
            this.paddle = this.add.sprite((this.w - (145 * this.paddleScale) - 30) , this.posy, 'paddle').setOrigin(0,0);
        this.paddle.setScale(this.paddleScale); // scale the sprit
        this.physics.add.existing(this.paddle, true); // set the physicss to paddle !!
        this.physics.add.collider(this.paddle, this.ball); // set the collider with paddle and the ball 
        // create enemy 
        this.createEnemy(this.paddle.width);
        // get the input from the user using "phaser-user-input-system"

        this.cursors = (this.data.is_player) ? this.input.keyboard.createCursorKeys() : null;
    }

    createEnemy(w: number) : void
    {
        if (this.data.player == "player1")
            this.enemy = this.add.sprite((this.w - (w * this.paddleScale) - 30) , this.posy, 'paddle').setOrigin(0,0);
        else
            this.enemy = this.add.sprite(30, this.posy, 'paddle').setOrigin(0,0);
        this.enemy.setScale(this.paddleScale); // scale the sprit
        this.physics.add.existing(this.enemy, true); // set the physicss to paddle !!
        this.physics.add.collider(this.enemy, this.ball);
    }
    
    resetball() : void
    {
        this.ball.setPosition(this.w / 2, this.h / 2)
        if (this.data.player == "player1")
        {
            this.ball.setBounce(1, 1); // set the bounce effect to the ball 
            this.ball.setCollideWorldBounds(true, 1, 1); // set the bounce with world
            const angle = Phaser.Math.Between(400, 1000);
            this.ball.body.setVelocity(angle, this.ballspeed); // set the velocity to the ball
        }
        // const vec = this.physics.velocityFromAngle(angle, this.ballspeed);
        // console.log(vec);//
    }

    createBall() : void 
    {
        this.ball = this.physics.add.image(this.w / 2, this.h / 2, 'ball');
        this.ball.setScale(this.ballScale); // scale the sprit 
        // movement ball
        this.resetball();
    }

    winner(img: string) : void
    {
        this.soc.emit('endGame', {
            lscore: this.leftScore,
            rscore: this.rightScore
        });
        if (this.data.player == "player1")
            this.ball.body.stop();
        else
            this.ball.setPosition(this.w / 2, this.h / 2)
        this.input.keyboard.enabled = false;
        
        this.soc.on("Restart", () => {
            this.add.sprite(this.w/2, this.h/2 - sprite.height, img);
            var sprite = this.add.sprite(this.w/2, this.h/2, 'restart').setInteractive();
            sprite.on('pointerdown', () =>
            {
                this.soc.emit('restart');
            });
        });
    }

    update () : void
    {
        if (this.rightScore >= 10 || this.leftScore >= 10)
        {
            const msg: string = (this.leftScore >= 10 && this.data.player == "player1") ? "youwin" : "youlose";
            this.winner(msg);
        }
        if (this.cursors && this.cursors.up.isDown && ( this.paddle.y - 10) >= 0)
        {
            this.paddle.y -= 10;
            if('updateFromGameObject' in this.paddle.body) {
                this.paddle.body.updateFromGameObject();
            }
        }
        else if (this.cursors && this.cursors.down.isDown && (this.paddle.y +
            (Phaser.Math.RoundTo(this.paddle.height * this.paddleScale, 0))
            + 10) <= this.h)
        {
            this.paddle.y += 10;
            if('updateFromGameObject' in this.paddle.body) {
                this.paddle.body.updateFromGameObject();
            }
        }
        if (this.ball && this.ball.x < 0)
        {
            /// add score to left user
            /******************* update the position of the paddle ************************/
            this.paddle.setPosition( 30, this.posy);
            if('updateFromGameObject' in this.paddle.body) {
                this.paddle.body.updateFromGameObject();
            }

            this.enemy.setPosition( this.eposx, this.posy);
            if('updateFromGameObject' in this.enemy.body) {
                this.enemy.body.updateFromGameObject();
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
        else if (this.ball && this.ball.x > this.w)
        {
            /// add score to right user
            /******************* update the position of the paddle ************************/
            this.paddle.setPosition( this.posx, this.posy);
            if('updateFromGameObject' in this.paddle.body) {
                this.paddle.body.updateFromGameObject();
            }
            this.enemy.setPosition( this.eposx, this.posy);
            if('updateFromGameObject' in this.enemy.body) {
                this.enemy.body.updateFromGameObject();
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
        if (this.ball)
        {
            this.soc.emit('move', {
                roomid: this.data.roomId,
                paddleY: this.paddle.y,
                ballx: (this.ball.body) ? this.ball.body.x: 0,
                bally: (this.ball.body) ? this.ball.body.y: 0,
                lscore: this.leftScore,
                rscore: this.rightScore,
            });
        }

        this.soc.on('recv', (data: any ) => {            
            if (this.enemy.body)
            {
                this.enemy.y = data.paddleY;
                if('updateFromGameObject' in this.enemy.body) {
                    this.enemy.body.updateFromGameObject();
                }
            }
            this.ball.x = (this.data.player == "player2") ? data.ballx : this.ball.x;
            this.ball.y = (this.data.player == "player2") ? data.bally : this.ball.y;
            if (this.data.player == "player2")
            {
                this.rightScoretxt.text = data.rscore.toString();
                this.leftScoretxt.text = data.lscore.toString();
                this.leftScore = data.lscore;
                this.rightScore = data.rscore;
            }
        });
    }
}

