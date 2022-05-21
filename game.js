var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('table', 'assets/images/table.png');
}

function create ()
{
    this.add.image(0, 0, 'table').setOrigin(0, 0);
}

function update ()
{
}