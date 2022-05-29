// import "../assets/Phaser/phaser.min.js"
import Phaser from "phaser"
import TitleScreen from "./scenes/TitleScreen"

var game;

window.onload = function() {
    //Game config here
    var config = {
        width: 1920,
        height: 1080,
        type: Phaser.AUTO,
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
    resize();
    window.addEventListener("resize", resize, false);
}

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;

    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}