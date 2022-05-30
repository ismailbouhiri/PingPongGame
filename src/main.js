// import "../assets/Phaser/phaser.min.js"
import Phaser from "phaser"
import TitleScreen from "./scenes/TitleScreen"

var config = {
    type: Phaser.CANVAS,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
}
game = new Phaser.Game(config);
game.scene.add("titlescreen", TitleScreen);
game.scene.start("titlescreen");