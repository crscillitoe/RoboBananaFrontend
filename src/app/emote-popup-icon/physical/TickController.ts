import { EmotePopupsIconPhysicalComponent } from "./emote-popup-icon-physical.component";

export class TickController {

    protected intervalId: any;
    protected tickDelay: number;

    protected entityList: EmotePopupsIconPhysicalComponent[] = [];
    protected toRemove: EmotePopupsIconPhysicalComponent[] = [];

    constructor(delay: number = 25) {
        this.tickDelay = delay;
    }

    protected tick() {
        this.entityList.forEach(e => {
            e.doAnimationStep();
        });
        this.removeAll();
    }

    public add(e: EmotePopupsIconPhysicalComponent) {
        this.entityList.push(e);
        if (this.intervalId == null) {
            this.intervalId = setInterval(this.tick.bind(this), this.tickDelay);
        }
    }

    public remove(e: EmotePopupsIconPhysicalComponent) {
        this.toRemove.push(e);
    }

    protected removeAll() {
        this.toRemove.forEach(e => {
            let index = this.entityList.indexOf(e);
            if (index >= 0) {
                this.entityList.splice(index, 1);
            }
        });
        if (this.entityList.length == 0) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

}