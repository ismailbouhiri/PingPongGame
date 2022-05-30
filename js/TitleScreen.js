"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const table_png_1 = __importDefault(require("../../assets/images/table.png"));
const paddle_png_1 = __importDefault(require("../../assets/images/paddle.png"));
const ball_png_1 = __importDefault(require("../../assets/images/ball.png"));
const restartButton_png_1 = __importDefault(require("../../assets/images/restartButton.png"));
const youlose_png_1 = __importDefault(require("../../assets/images/youlose.png"));
const youwin_png_1 = __importDefault(require("../../assets/images/youwin.png"));
class TitleScreen extends phaser_1.default.Scene {
    constructor() {
        super();
        this.ballScale = 0.19;
        this.paddleScale = 0.4;
        this.ballspeed = 600;
        this.bounds = 100;
        this.textSize = 65;
        this.leftScore = 0;
        this.rightScore = 0;
        this.h = 0;
        this.w = 0;
    }
    preload() {
        this.h = this.cameras.main.height;
        this.w = this.cameras.main.width;
        this.load.image('table', table_png_1.default);
        this.load.image('ball', ball_png_1.default);
        this.load.image('paddle', paddle_png_1.default);
        this.load.image('restart', restartButton_png_1.default);
        this.load.image('youwin', youwin_png_1.default);
        this.load.image('youlose', youlose_png_1.default);
    }
    create() {
        // no collision detection on left side and right side 
        this.physics.world.setBounds(-this.bounds, 0, this.w + (this.bounds * 2), this.h);
        // resize the images to fit the window
        this.bg = this.add.sprite(0, 0, 'table').setOrigin(0, 0);
        // // loading a ball add sprite to the 
        this.ball = this.physics.add.sprite(this.w / 2, this.h / 2, 'ball');
        this.ball.setScale(this.ballScale); // scale the sprit 
        this.ball.setBounce(1, 1); // set the bounce effect to the ball 
        this.ball.setCollideWorldBounds(true, 1, 1); // set the bounce with world 
        // add the paddle 
        this.paddle = this.add.sprite(30, (((this.h / 2) - (this.h / 3)) / 2) + (this.h / 3), 'paddle').setOrigin(0, 0);
        this.paddle.setScale(this.paddleScale); // scale the sprit
        this.physics.add.existing(this.paddle, true); // set the physicss to paddle !!
        this.physics.add.collider(this.paddle, this.ball); // set the collider with paddle and the ball 
        // movement ball
        this.resetball();
        // get the input from the user using "phaser-user-input-system"
        this.cursors = this.input.keyboard.createCursorKeys();
        /////////////////////////////// text ////////////////////////
        this.leftScoretxt = this.add.text((this.w / 2) - (this.w / 10), 30, this.leftScore, {
            font: this.textSize + "px Arial",
            fill: "#FFFFFF",
            align: "center"
        });
        this.rightScoretxt = this.add.text((this.w / 2) + (this.w / 10), 30, this.rightScore, {
            font: this.textSize + "px Arial",
            fill: "#FFFFFF",
            align: "center"
        });
    }
    resetball() {
        this.ball.setPosition(this.w / 2, this.h / 2);
        const angle = phaser_1.default.Math.Between(400, 1000);
        // const vec = this.physics.velocityFromAngle(angle, this.ballspeed);
        // console.log(vec);//
        this.ball.body.setVelocity(angle, this.ballspeed); // set the velocity to the ball
    }
    winner(img) {
        this.ball.body.stop();
        this.input.keyboard.enabled = false;
        var sprite = this.add.sprite(this.w / 2, this.h / 2, 'restart').setInteractive();
        sprite.on('pointerdown', (event) => {
            this.input.keyboard.enabled = true;
            this.leftScore = 0;
            this.rightScore = 0;
            this.scene.restart();
        });
        this.add.sprite(this.w / 2, this.h / 2 - sprite.height, img.toString());
    }
    update() {
        this.ballspeed += 0.5;
        this.ball.body.velocity.normalize().scale(this.ballspeed);
        if (this.rightScore >= 10)
            this.winner("youlose");
        else if (this.leftScore >= 10)
            this.winner("youwin");
        if (this.cursors.up.isDown && (this.paddle.y - 10) >= 0) {
            this.paddle.y -= 10;
            this.paddle.body.updateFromGameObject();
        }
        else if (this.cursors.down.isDown && (this.paddle.y +
            (phaser_1.default.Math.RoundTo(this.paddle.height * this.paddleScale, 0))
            + 10) <= this.h) {
            this.paddle.y += 10;
            this.paddle.body.updateFromGameObject();
        }
        if (this.ball.x < 0) {
            /// add score to left user
            /******************* update the position of the paddle ************************/
            this.paddle.setPosition(30, (((this.h / 2) - (this.h / 3)) / 2) + (this.h / 3));
            this.paddle.body.updateFromGameObject();
            /******************************************************************************/
            /******************* add score for the leftUser *******************************/
            this.rightScore += 1;
            this.rightScoretxt.text = this.rightScore.toString();
            /******************************************************************************/
            /******************* update the position of the ball **************************/
            this.resetball();
            /******************************************************************************/
        }
        else if (this.ball.x > this.w) {
            /// add score to right user
            /******************* update the position of the paddle ************************/
            this.paddle.setPosition(30, (((this.h / 2) - (this.h / 3)) / 2) + (this.h / 3));
            this.paddle.body.updateFromGameObject();
            /******************************************************************************/
            /******************* add score for the leftUser *******************************/
            this.leftScore += 1;
            this.leftScoretxt.text = this.leftScore.toString();
            /******************************************************************************/
            /******************* update the position of the ball **************************/
            this.resetball();
            /******************************************************************************/
        }
    }
}
exports.default = TitleScreen;
