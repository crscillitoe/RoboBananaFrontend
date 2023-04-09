import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[coolIconHost]',
})
export class CoolIconDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}