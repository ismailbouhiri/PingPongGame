var config = {
    type: Phaser.AUTO,
    width: 1920,
    hieght: 1120,
    scene: {
        preload: preload,
        create: create,
        update: update,
        resize: resize,
    }
}; 

var game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.resize(window.innerWidth, window.innerHeight);
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
}

function create()
{
    // resize the images to fit the window 
    this.events.on('resize', resize, this);
    this.bg = this.add.sprite(game.config.width / 2, game.config.height / 2, 'table');
    this.bg.setDisplaySize(game.config.width, game.config.height);
}


function update ()
{
}