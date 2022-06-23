export default class CountDown
{
    scene: Phaser.Scene;
    label: Phaser.GameObjects.Text;
    timeEvent: Phaser.Time.TimerEvent;
    duration = 0;

    constructor(scene: Phaser.Scene, label: Phaser.GameObjects.Text)
    {
        this.scene = scene;
        this.label = label;
    }

    stop()
    {
        if (this.timeEvent)
        {
            this.timeEvent.destroy();
            this.timeEvent = undefined;
        }
    }

    start(duration:number = 45000)
    {
        this.stop();
        
        this.timeEvent = this.scene.time.addEvent({
            delay: duration
        })
    }

    update()
    {
        if (!this.timeEvent || this.duration <= 0)
            return ;
        const elapsed = this.timeEvent.getElapsed();
        const remaning = this.duration - elapsed;
        


        const seconds = remaning / 1000;

        this.label.text = seconds.toFixed(2)

    }

}