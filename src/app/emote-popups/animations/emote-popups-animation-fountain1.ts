import { PhysicsInfo } from "src/app/emote-popup-icon/physical/emote-popup-icon-physical.component";
import { EmoteProperties } from "../emote-popups.component";
import { EmotePopupsAnimation } from "./emote-popups-animation";

export class EmotePopupsAnimationFountain1 extends EmotePopupsAnimation {

    protected intervalId: any;
    protected iterationNumber: number = 0;

    protected emote1: string = "";
    protected emote2: string = "";
    protected type: "img" | "text" = "img";

    protected override setEmotes(emotes: string[], type: "img" | "text" = "img") {
        this.type = type;
        if (emotes.length >= 2) {
            this.emote1 = emotes[0];
            this.emote2 = emotes[1];
        }
        else {
            this.emote1 = emotes[0];
            this.emote2 = emotes[0];
        }
    }

    protected override onStart(): void {
        this.properties = new EmoteProperties();
        this.physics = this.properties.initialPhysicsState;

        this.properties.bounces = 1;
        this.properties.size = 80;
        this.intervalId = setInterval(this.doAnimationStep.bind(this), 400);
    }

    protected override doAnimationStep(): void {
        this.properties.asset = this.emote1;
        this.properties.type = this.type;
        for (let i = 0; i < 5; i++) {
            this.physics.posx = 0;
            this.physics.posy = 750 - (this.iterationNumber * 150);
            this.physics.accx = 20 + (2 * i) + (this.iterationNumber * 8);
            this.physics.accy = -(20 + 3 * i) + (this.iterationNumber * 5);
            this.createEmote(this.properties);
        }
        for (let i = 0; i < 5; i++) {
            this.physics.posx = 1566;
            this.physics.posy = 750 - (this.iterationNumber * 150);
            this.physics.accx = -(20 + (2 * i)) - (this.iterationNumber * 8);
            this.physics.accy = -(20 + 3 * i) + (this.iterationNumber * 5);
            this.createEmote(this.properties);
        }
        if (this.iterationNumber >= 4) {
            //finale
            this.properties.asset = this.emote2;
            this.properties.bounces = 0;
            this.properties.size = 80;
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    this.physics.posx = 150 + (i * 310);
                    this.physics.posy = 846;
                    this.physics.accx = -2 + (1 * j);
                    this.physics.accy = -40;
                    const ref = this.createEmote(this.properties);
                }
            }
            this.endAnimation();
        }
        this.iterationNumber++;
    }

    lastTime: number = 0;

    protected override onEnd(): void {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.iterationNumber = 0;
    }

}