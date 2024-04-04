import { Component, Directive, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import { AnimationComponent } from './animation.component';

@Directive({
    selector: '[animationSpace]',
})
export class AnimationHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
  selector: 'app-animation-host',
  templateUrl: './animation-host.component.html',
  styleUrls: ['./animation.component.scss']
})
export class AnimationHostComponent implements OnInit {
  
  @ViewChild(AnimationHostDirective, { static: true }) animationSpace!: AnimationHostDirective;

  constructor(private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.botService.getStream('streamdeck').subscribe(data => {
      if (data.type === "animation") {

        const viewContainerRef = this.animationSpace.viewContainerRef;
        const componentRef = viewContainerRef.createComponent<AnimationComponent>(AnimationComponent);

        let source = data.source;
        
        //typescript compiler is drunk, just leave it
        if ("canParse" in URL && typeof URL.canParse == "function") {
            if (URL.canParse(source)) {
                let url = new URL(source);
                //adding a random bit of get query so the browser doesn't try to cache our stuff
                url.searchParams.append("random", Date.now().toString());
                source = url.href;
            }
            
        }

        componentRef.instance.source = source;
        componentRef.instance.contentLoadedCallack = function() {
            setTimeout(() => {
                componentRef.destroy();
            }, data.duration);
        }
      }
    });
  }

}


