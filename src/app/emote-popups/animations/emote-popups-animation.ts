import { PhysicsInfo } from "src/app/emote-popup-icon/physical/emote-popup-icon-physical.component";
import { EmoteProperties } from "../emote-popups.component";

export abstract class EmotePopupsAnimation {

    protected createEmote: Function;

    protected properties: EmoteProperties;
    protected physics: PhysicsInfo;

    protected running: boolean = false;

    constructor(createEmote: Function) {
        this.createEmote = createEmote;
        this.properties = new EmoteProperties();
        this.physics = this.properties.initialPhysicsState;
    }

    public startAnimation(emotes: string[], type: "img" | "text" = "img") {
        this.setEmotes(emotes, type);
        if (this.running) return;
        this.running = true;
        this.onStart();
    }

    protected abstract setEmotes(emotes: string[], type: "img" | "text"): void;

    protected abstract onStart(): void;

    protected abstract doAnimationStep(): void;

    protected abstract onEnd(): void;

    public endAnimation() {
        if (!this.running) return;
        this.onEnd();
        this.running = false;
    }

    public isRunning(): boolean {
        return this.running;
    }

}