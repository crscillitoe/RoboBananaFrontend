import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[emotePopupSpace]',
})
export class EmotePopupsDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
