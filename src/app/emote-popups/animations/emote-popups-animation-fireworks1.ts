import { PhysicsInfo } from "src/app/emote-popup-icon/physical/emote-popup-icon-physical.component";
import { EmoteProperties } from "../emote-popups.component";
import { EmotePopupsAnimation } from "./emote-popups-animation";

export class EmotePopupsAnimationFireworks1 extends EmotePopupsAnimation {
    protected count: number = 0;
    protected intervalId: any;
    protected iteration: number = 0;

    protected rocketProperties!: EmoteProperties;

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
        
        this.properties.bounces = 0;
        this.properties.size = 80;

        this.rocketProperties = structuredClone(this.properties);
        this.rocketProperties.asset = this.emote1;
        this.rocketProperties.type = this.type;

        this.intervalId = setInterval(this.doAnimationStep.bind(this), 250);
    }

    protected override doAnimationStep(): void {
        this.rocketProperties.initialPhysicsState.posx = 220 * (this.iteration + 1);
        this.rocketProperties.initialPhysicsState.posy = 846;
        this.rocketProperties.initialPhysicsState.accy = (Math.random() * -15) - 20;

        this.fireRocket();

        this.iteration++;
        if (this.iteration >= 7) {
            clearInterval(this.intervalId);
        }
    }

    /**
     * Fires rocket with current rocketProperties
     */
    protected fireRocket() {
        const rocketRef = this.createEmote(this.rocketProperties);
        rocketRef.instance.customCheckFunction = (pInfo: PhysicsInfo) => {
            if (pInfo.vely >= 0) {
                this.explodeAnimation(pInfo.posx, pInfo.posy);
                rocketRef.instance.stopAnimation();
            }
        }
    }

    protected explodeAnimation(x: number, y: number) {
        this.physics.posx = x;
        this.physics.posy = y;
        this.properties.asset = this.emote2;
        this.properties.type = this.type;
        for (let i = 0; i < 16; i++) {
            let angle = Math.random() * Math.PI * 2;
            let power = Math.random() * 10 + 5;
            this.physics.accx = Math.sin(angle) * power;
            this.physics.accy = Math.cos(angle) * power;
            this.createEmote(this.properties);
        }
        this.explodeFinished();
    }

    protected explodeFinished() {
        this.count++;
        if (this.count >= this.iteration) {
            this.endAnimation();
        }
    }

    protected override onEnd(): void {
        this.count = 0;
        this.iteration = 0;
    }

}