var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        resize: resize,
    }
}; 

var game = new Phaser.Game(config);
const ballScale = 0.15;
const paddleScale = 0.3;
const ballspeed = 400;

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

function create()
{
    // no collision detection on left side and right side 
    this.physics.world.setBounds(-100, 0, 1000, config.height);
    // resize the images to fit the window 
    this.events.on('resize', resize, this);
    this.bg = this.add.sprite(game.config.width / 2, game.config.height / 2, 'table');
    this.bg.setDisplaySize(game.config.width, game.config.height);

    // loading a ball add sprite to the 
    this.ball = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'ball');
    this.ball.setScale(ballScale); // scale the sprit 
    this.ball.setBounce(1, 1); // set the bounce effect to the ball 
    this.ball.setCollideWorldBounds(true, 1, 1); // set the bounce with world 
    
    let h = game.config.height;
    // add the paddle 
    this.paddle = this.add.sprite(25, ( ( (h / 2) - (h / 3) ) / 2) + (h / 3), 'paddle').setOrigin(0,0);
    this.paddle.setScale(paddleScale); // scale the sprit
    this.physics.add.existing(this.paddle, true); // set the physicss to paddle !!
    this.physics.add.collider(this.paddle, this.ball); // set the collider with paddle and the ball 
    
    // movement ball
    this.ball.setPosition(config.width / 2, config.height / 2)
    const angle = Phaser.Math.Between(50, 360);
    const vec = this.physics.velocityFromAngle(angle, ballspeed);
    this.ball.body.setVelocity(vec.x, vec.y); // set the velocity to the ball    
    // get the input from the user using "phaser-user-input-system"
    this.cursors = this.input.keyboard.createCursorKeys();
}


function update ()
{
    if (this.cursors.up.isDown && ( this.paddle.y - 10) >= 0)
    {
        this.paddle.y -= 10;
        this.paddle.body.updateFromGameObject();
    }
    else if (this.cursors.down.isDown && (this.paddle.y + ((this.paddle.height * paddleScale)) + 10) <= config.height)
    {
        this.paddle.y += 10;
        this.paddle.body.updateFromGameObject();
    }

    if (this.ball.x < 0)
    {
        console.log("Goal userLeft");
        this.ball.setPosition(config.width / 2, config.height / 2)
        const angle = Phaser.Math.Between(50, 360);
        const vec = this.physics.velocityFromAngle(angle, ballspeed);
        this.ball.body.setVelocity(vec.x, vec.y); // set the velocity to the ball
    }
    else if (this.ball.x > config.width)
    {
        console.log("Goal userRight");
        this.ball.setPosition(config.width / 2, config.height / 2)
        const angle = Phaser.Math.Between(50, 360);
        const vec = this.physics.velocityFromAngle(angle, ballspeed);
        this.ball.body.setVelocity(vec.x, vec.y); // set the velocity to the ball
    }
}