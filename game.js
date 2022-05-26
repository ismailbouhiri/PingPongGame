var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        resize: resize,
        preload: preload,
        winner: winner,
        create: create,
        update: update,
    }
}; 

const game = new Phaser.Game(config);
const ballScale = 0.2;
const paddleScale = 0.4;
const ballspeed = 600;
const bounds = 100;
var leftScore = 0;
var rightScore = 0;
var h = game.config.height;

window.addEventListener('resize', () => {
    resize(config.width, config.height);
}, false);

function resize(width, height) 
{
  this.cameras.resize(width, height);
  this.bg.setDisplaySize(width, height);
  // this.logo.setPosition(width / 2, height / 2);
}

function preload ()
{
    this.load.image('table', 'assets/images/table.png');
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('paddle', 'assets/images/paddle.png');
}

function winner(msg)
{
    // this.add.text(100, 500, "asdasdasd", {
    //     font: "65px Arial",
    //     fill: "#ff0044",
    //     align: "center"
    // });
    // // this.add.text(400, 500, 'Hello World', { font: '"Press Start 2P"' });
    this.start.text = msg.toString();

}
function create()
{
    // resize the images to fit the window 
    this.events.on('resize', resize, this);
    this.bg = this.add.sprite(game.config.width / 2, game.config.height / 2, 'table');
    this.bg.setDisplaySize(game.config.width, game.config.height);
    
    // no collision detection on left side and right side 
    this.physics.world.setBounds(-bounds, 0, config.width + (bounds * 2), config.height);
    
    // loading a ball add sprite to the 
    this.ball = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'ball');
    this.ball.setScale(ballScale); // scale the sprit 
    this.ball.setBounce(1, 1); // set the bounce effect to the ball 
    this.ball.setCollideWorldBounds(true, 1, 1); // set the bounce with world 
    
    
    // add the paddle 
    this.paddle = this.add.sprite(30, ( ( (h / 2) - (h / 3) ) / 2) + (h / 3), 'paddle').setOrigin(0,0);
    this.paddle.setScale(paddleScale); // scale the sprit
    this.physics.add.existing(this.paddle, true); // set the physicss to paddle !!
    this.physics.add.collider(this.paddle, this.ball); // set the collider with paddle and the ball 
    
    // movement ball
    this.ball.setPosition(config.width / 2, config.height / 2)
    const angle = Phaser.Math.Between(100, 360);
    const vec = this.physics.velocityFromAngle(200, ballspeed);
    this.ball.body.setVelocity(200, vec.y); // set the velocity to the ball    
    
    // get the input from the user using "phaser-user-input-system"
    this.cursors = this.input.keyboard.createCursorKeys();

    /////////////////////////////// text ////////////////////////
    this.leftScoretxt = this.add.text((config.width / 2) - (config.width / 10) , 30, leftScore, {
        font: "65px Arial",
        fill: "#FFFFFF",
        align: "center"
    });

    this.rightScoretxt = this.add.text((config.width / 2) + (config.width / 10) , 30, rightScore, {
        font: "65px Arial",
        fill: "#FFFFFF",
        align: "center"
    });

    this.start = this.add.text(config.width / 2 - 65, config.height / 2, "", {
        font: "65px Arial",
        fill: "#FFFFFF",
        align: "center"
    });
}


function update ()
{
    if (rightScore >= 10)
        winner("you lose the game, Inshalah brbii trbah mra jaya");
    else if (leftScore >= 10)
        winner("you win the game !! Mbrook");

    if (this.cursors.up.isDown && ( this.paddle.y - 10) >= 0)
    {
        this.paddle.y -= 10;
        this.paddle.body.updateFromGameObject();
    }
    else if (this.cursors.down.isDown && (this.paddle.y +
        (Phaser.Math.RoundTo(this.paddle.height * paddleScale, 0))
        + 10) <= config.height)
    {
        this.paddle.y += 10;
        this.paddle.body.updateFromGameObject();
    }

    if (this.ball.x < 0)
    {
        /// add score to left user
        /******************* update the position of the paddle ************************/
        this.paddle.setPosition( 30, ( ( (h / 2) - (h / 3) ) / 2) + (h / 3));
        this.paddle.body.updateFromGameObject();
        /******************************************************************************/
    
        /******************* add score for the leftUser *******************************/
        rightScore += 1;
        this.rightScoretxt.text = rightScore.toString();
        /******************************************************************************/

        /******************* update the position of the ball **************************/
        this.ball.setPosition(config.width / 2, config.height / 2)
        const angle = Phaser.Math.Between(100, 360);
        const vec = this.physics.velocityFromAngle(angle, ballspeed);
        this.ball.body.setVelocity(200, vec.y); // set the velocity to the ball
        /******************************************************************************/

    }
    else if (this.ball.x > config.width)
    {
        /// add score to right user

        /******************* update the position of the paddle ************************/
        this.paddle.setPosition( 30, ( ( (h / 2) - (h / 3) ) / 2) + (h / 3));
        this.paddle.body.updateFromGameObject();
        /******************************************************************************/

        /******************* add score for the leftUser *******************************/
        leftScore += 1; 
        this.leftScoretxt.text = leftScore.toString();
        /******************************************************************************/

        /******************* update the position of the ball **************************/
        this.ball.setPosition(config.width / 2, config.height / 2)
        const angle = Phaser.Math.Between(200, 200);
        const vec = this.physics.velocityFromAngle(angle, ballspeed);
        this.ball.body.setVelocity(200, vec.y); // set the velocity to the ball
        /******************************************************************************/

    }
}