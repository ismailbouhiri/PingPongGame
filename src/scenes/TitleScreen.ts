import Phaser from "phaser";
import table from "../../assets/images/table.png";
import paddle from "../../assets/images/paddle.png";
import ball from "../../assets/images/ball.png";
import restartButton from "../../assets/images/restartButton.png";
import youlose from "../../assets/images/youlose.png";
import youwin from "../../assets/images/youwin.png";
import { io, Socket } from "socket.io-client";
export default class TitleScreen extends Phaser.Scene
{
    ballScale: number = 0.19;
    paddleScale: number = 0.4;
    ballspeed: number = 800;
    bounds: number = 100;
    leftScore: number = 9;
    rightScore: number = 9;
    h: number = 0;
    w: number = 0;
    bg: Phaser.GameObjects.Sprite = null;
    ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody = null;
    paddle: Phaser.GameObjects.Sprite = null;
    soc: Socket = null;
    enemy: Phaser.GameObjects.Sprite = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys = null;
    status: Phaser.GameObjects.Image = null;
    leftScoretxt: Phaser.GameObjects.Text = null;
    rightScoretxt: Phaser.GameObjects.Text = null;
    posx: number = 0;
    eposx: number = 0;
    posy: number = 0;
    restart: boolean = true;
    data: any = null;
    End: boolean = false;
    sprite : any = null;
    re: boolean = false;
    text: Phaser.GameObjects.Text;
    timedEvent: Phaser.Time.TimerEvent;
    initialTime :number = 5;
    goal: boolean = false;
    gameIsStarted: boolean = false;
    
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
    
    createObjects(ballx: number, bally: number, lpaddle: number, rpaddle: number)
    {
            // create ball for the watcher ///////// 
            this.ball = this.physics.add.image(ballx,bally, 'ball');
            this.ball.setScale(this.ballScale); // scale the sprit 
            ////////////////////////////////////////

            ///////////////////////// lpaddle ////////////////////////
            this.paddle = this.add.sprite( 30,lpaddle, 'paddle').setOrigin(0,0);
            this.paddle.setScale(this.paddleScale); // scale the sprit
            // this.physics.add.existing(this.paddle, true); // set the physicss to paddle !!
            // this.physics.add.collider(this.paddle, this.ball); // set the collider with paddle and the ball
            /////////////////////////////////////////////////////

            /////////////////////////// rpaddle /////////////////////////
            this.enemy = this.add.sprite((this.w - (this.paddle.width * this.paddleScale) - 30) ,rpaddle, 'paddle').setOrigin(0,0);
            this.enemy.setScale(this.paddleScale); // scale the sprit
            // this.physics.add.existing(this.enemy, true); // set the physicss to paddle !!
            // this.physics.add.collider(this.enemy, this.ball);
            //////////////////////////////////////////////////////////////
    }

    watcherRender(d: any)
    {
        this.rightScore = d.rScore;
        this.leftScore = d.lScore;
        this.leftScoretxt.text = d.lScore.toString();
        this.rightScoretxt.text = d.rScore.toString();

        if (!this.enemy && !this.ball && !this.paddle)
        {
            this.createObjects(d.ballx, d.bally, d.lpaddle, d.rpaddle);
            return ;
        }

        if (d.goal)
        {
            this.goal = true;
            this.soc.removeAllListeners();
            this.scene.restart();
        }

        this.ball.x = d.ballx;
        this.ball.y = d.bally; 
    
        this.enemy.y = d.rpaddle;
        this.paddle.y = d.lpaddle;

    }

    create() : void
    {
        // no collision detection on left side and right side 
        this.physics.world.setBounds(-this.bounds, 0, this.w + (this.bounds * 2), this.h);
        
        if (!this.soc)
            this.soc = io("http://127.0.0.1:3001/game", {withCredentials: true});

        // resize the images to fit the window
        this.bg = this.add.sprite(this.w / 2, this.h / 2, 'table');
                
        /////////////////////////////// text ////////////////////////
        this.leftScoretxt = this.add.text((this.w / 2) - (this.w / 10) , 30, this.leftScore.toString(), {
            font:"65px Arial",
            align: "center"
        });
        
        this.rightScoretxt = this.add.text((this.w / 2) + (this.w / 10) , 30, this.rightScore.toString(), {
            font:"65px Arial",
            align: "center"
        });
        
        this.soc.on("saveData", (data: { player: string, is_player: boolean, roomId: string, userId: string } ) => 
        {
            console.log(data);
            this.data = data;
        });
        
        this.soc.on("startGame", () => {
            this.startGame();
        });

        this.soc.on("restartGame", () => {
            this.leftScore = 9;
            this.rightScore = 9;
            this.rightScoretxt.text = this.leftScore.toString();
            this.leftScoretxt.text = this.leftScore.toString();
            this.End = false;
            this.goal = false;
            if (this.data.is_player)
                this.input.keyboard.enabled = true;
            this.startGame();
        });
        
        this.soc.on("newRoom", (id: string) => 
        {
            this.soc.emit("join", {
                oldData: this.data,
                newRoom: id
            });
            this.data.roomId = id;
        });
        this.soc.on("Watchers", (data: any) => 
        {
            if (!this.data || this.data.is_player)
                return ;
            this.watcherRender(data);
        });

        this.soc.on("leave", () => {
            console.log("The Client is Disconnected !! ");
            if (this.data)
            {
                this.soc.emit('move', {
                    roomId: this.data.roomId,
                    paddleY: this.paddle.y,
                    ballx: (this.ball.body) ? this.ball.body.x: 0,
                    bally: (this.ball.body) ? this.ball.body.y: 0,
                    lScore: 10,
                    rScore: 10
                });
            }
            this.soc.disconnect();
            this.scene.stop();
        });

        this.soc.on("restart", (img) => {
            this.add.image(this.w/2, this.h/2 - 100, img).setOrigin(0.5);
            const text = this.add.text(this.w / 2 , this.h / 2 , "Click to Restart", { font:"65px Arial", align: "center" }).setInteractive().setOrigin(0.5);
            text.on('pointerdown', function ()
            {
                text.text = "";
                this.soc.removeAllListeners();
                this.re = true;
                this.scene.restart();
            }, this);

        });

        this.soc.on('recv', (data: 
            {
                roomId: string,
                paddleY: number,
                ballx: number,
                bally: number,
            }) => {
            
            if (this.enemy && this.enemy.body)
            {
                this.enemy.y = data.paddleY;
                if('updateFromGameObject' in this.enemy.body) {
                    this.enemy.body.updateFromGameObject();
                }
            }
            if (this.ball && this.data.player === "player2")
            {
                this.ball.x = data.ballx;
                this.ball.y = data.bally;
            }
        });
        if (this.re)
        {
            this.re = false;
            this.soc.emit('restart', this.data);
        }
        else if (!this.End && (this.rightScore >= 10 || this.leftScore >= 10))
        {
            this.End = true;
            const msg = ((this.leftScore >= 10 && this.data.player === "player1") || (this.rightScore >= 10 && this.data.player === "player2")) ? "youwin" : "youlose";
            this.winner(msg);
        }
        else if  (!this.End && this.goal && !this.re && (this.leftScore || this.rightScore))
            this.goalTime();
    }

    formatTime(seconds:number){
        // Minutes
        var minutes = Math.floor(seconds/60);
        // Seconds
        var partInSeconds = seconds%60;
        // Adds left zeros to seconds
        var partInSecondsS = partInSeconds.toString().padStart(2,'0');
        // Returns formated time
        return `${minutes}:${partInSecondsS}`;
    }

    onEvent ()
    {
        if (this.timedEvent == undefined)
            return ;
        this.initialTime -= 1; // One second
        this.text.setText('' + this.formatTime(this.initialTime)).setOrigin(0.5);
        if (this.initialTime <= 0)
        {
            this.goal = false;
            this.timedEvent = undefined;
            this.text.text = "";
            if (this.data.is_player)
                this.startGame();
            else
                this.createObjects(this.w / 2, this.h / 2, this.h / 2, this.h / 2);
        }
    }

    startGame() : void
    {
        this.gameIsStarted = true;
        // loading a ball add sprite to the 
        this.posx = (this.data.player === "player1") ? 30: this.w - (145 * this.paddleScale) - 30 ;
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
        if (this.data.player === "player1")
        {
            const arr= [45, -45, 135, -135];
            const ran = Phaser.Math.Between(0, 3);
            this.ball.setBounce(1, 1); // set the bounce effect to the ball 
            this.ball.setCollideWorldBounds(true, 1, 1); // set the bounce with world
            const vec = this.physics.velocityFromAngle(arr[ran], this.ballspeed);
            this.ball.body.setVelocity(vec.x, vec.y); // set the velocity to the ball
            // this.physics.accelerateTo(this.ball, this.ball.x, this.ball.y,this.ballspeed + 100);
        }
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
        if (this.ball)
            this.ball.destroy();
        this.paddle.destroy();
        this.enemy.destroy();
        this.input.keyboard.enabled = false;
        this.soc.emit('endGame', {
            player: this.data.player,
            rscore: this.rightScore,
            lscore: this.leftScore, 
            userId: this.data.userId,
            roomId: this.data.roomId,
            status: img
        });
    }
    updatePositions()
    {
        this.paddle.setPosition( this.posx, this.posy);
        if( this.paddle && this.paddle.body && 'updateFromGameObject' in this.paddle.body) {
            this.paddle.body.updateFromGameObject();
        }

        this.enemy.setPosition( this.eposx, this.posy);
        if(this.enemy && this.enemy.body && 'updateFromGameObject' in this.enemy.body) {
            this.enemy.body.updateFromGameObject();
        }
    }
    
    goalTime()
    {
        this.initialTime = 2;
        this.text = this.add.text(this.w / 2, this.h / 2, '' + this.formatTime(this.initialTime), { font:"65px Arial", align: "center" }).setOrigin(0.5);
        // Each 1000 ms call onEvent
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
    }

    update () : void
    {
        if (this.goal || !this.gameIsStarted || !this.data.is_player)
            return ;
        // ///// check For the  movment //////////////// 
        if (this.data.is_player && !this.End && this.cursors && this.cursors.up.isDown && ( this.paddle.y - 10) >= 0)
        {
            this.paddle.y -= 10;
            if('updateFromGameObject' in this.paddle.body) {
                this.paddle.body.updateFromGameObject();
            }
        }
        else if (this.data.is_player && !this.End && this.cursors && this.cursors.down.isDown && (this.paddle.y +
            (Phaser.Math.RoundTo(this.paddle.height * this.paddleScale, 0))
            + 10) <= this.h)
        {
            this.paddle.y += 10;
            if('updateFromGameObject' in this.paddle.body) {
                this.paddle.body.updateFromGameObject();
            }
        }
        /////////////////////////////////////////////////////////

        ///////////////////// check for the winner ///////////////
        if (this.data.is_player && !this.End && (this.rightScore >= 10 || this.leftScore >= 10))
        {
            this.gameIsStarted = false;
            this.End = true;
            const msg = ((this.leftScore >= 10 && this.data.player === "player1") || (this.rightScore >= 10 && this.data.player === "player2")) ? "youwin" : "youlose";
            this.winner(msg);
        }
        //////////////////////////////////////////////////////////
        
        // emit data to another player // 
        if (this.data.is_player && !this.End && this.ball && this.paddle)
        {
            this.soc.emit('move', {
                roomId: this.data.roomId,
                paddleY: this.paddle.y,
                ballx: (this.ball.body) ? this.ball.body.x: 0,
                bally: (this.ball.body) ? this.ball.body.y: 0,
                lScore: this.leftScore,
                rScore :this.rightScore
            });
        }
        //////////////////////////////////////////////
        if (this.data.is_player && this.data.player === "player1")
        {
            this.soc.emit('sendToWatcher', {
                roomId: this.data.roomId,
                lpaddle: this.paddle.y,
                rpaddle: this.enemy.y,
                ballx: this.ball.body.x,
                bally: this.ball.body.y,
                lScore: this.leftScore,
                rScore: this.rightScore,
                endGame: this.End,
                goal: this.goal,
            });
        }
        //////       check For the goals    //////////
        if ( this.data.is_player && !this.End && this.ball && ((this.ball.x < 0) || 
            ( this.data.player == "player2") &&( (this.ball.x - 20 ) < 0 )))
        {
            /******************* add score for the leftUser *******************************/
            this.rightScore += 1;
            this.rightScoretxt.text = this.rightScore.toString();
            /******************************************************************************/

            if (this.data.is_player && !this.End)
            {
                this.goal = true;
                if (this.data.is_player && this.data.player === "player1")
                {
                    this.soc.emit('sendToWatcher', {
                        roomId: this.data.roomId,
                        lpaddle: this.paddle.y,
                        rpaddle: this.enemy.y,
                        ballx: this.ball.body.x,
                        bally: this.ball.body.y,
                        lScore: this.leftScore,
                        rScore: this.rightScore,
                        endGame: this.End,
                        goal: this.goal,
                    });
                }
                this.soc.removeAllListeners();
                this.scene.restart();
            }
            
        }
        else if (this.data.is_player && !this.End && this.ball && ((this.ball.x > this.w) || 
            ( this.data.player == "player2") &&( (this.ball.x + 20 ) > this.w) ))
        {
            /******************* update the position of the paddle ************************/
            /******************************************************************************/
            
            /******************* add score for the leftUser *******************************/
            this.leftScore += 1; 
            this.leftScoretxt.text = this.leftScore.toString();
            /******************************************************************************/

            if (this.data.is_player && !this.End)
            {
                this.goal = true;
                if (this.data.is_player && this.data.player === "player1")
                {
                    this.soc.emit('sendToWatcher', {
                        roomId: this.data.roomId,
                        lpaddle: this.paddle.y,
                        rpaddle: this.enemy.y,
                        ballx: this.ball.body.x,
                        bally: this.ball.body.y,
                        lScore: this.leftScore,
                        rScore: this.rightScore,
                        endGame: this.End,
                        goal: this.goal,
                    });
                }
                this.soc.removeAllListeners();
                this.scene.restart();
            }
        }
    }
}

