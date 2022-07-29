import { io, Socket } from "socket.io-client";
import Phaser from "phaser"
import TitleScreen from "./scenes/TitleScreen"

var config: {
    type: number;
    scale: {
        mode: number;
        autoCenter: number;
        width: number;
        height: number;
    };
    physics: {
        default: string;
        arcade: {
            gravity: {
                y: number;
            };
            debug: boolean;
        };
    };
} = {
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
            debug: true
        }
    }
}

var game: Phaser.Game = new Phaser.Game(config);

var soc: Socket = io("http://127.0.0.1:3001/game", {withCredentials: true});
var scene: TitleScreen = new TitleScreen(soc, "normaleQue");

game.scene.add("titlescreen", scene);
game.scene.start("titlescreen");