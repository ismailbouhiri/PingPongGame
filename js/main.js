// "use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// // import "../assets/Phaser/phaser.min.js"
// const phaser_1 = __importDefault(require("phaser"));
// const TitleScreen_1 = __importDefault(require("../src/scenes/TitleScreen"));
var config = {
    type: phaser_1.default.CANVAS,
    scale: {
        mode: phaser_1.default.Scale.FIT,
        autoCenter: phaser_1.default.Scale.CENTER_BOTH,
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
};
var game = new phaser_1.default.Game(config);
game.scene.add("titlescreen", TitleScreen_1.default);
game.scene.start("titlescreen");
