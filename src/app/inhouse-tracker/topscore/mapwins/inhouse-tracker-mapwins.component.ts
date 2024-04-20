import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-inhouse-tracker-mapwins',
    templateUrl: './inhouse-tracker-mapwins.component.html',
    styleUrls: ['./inhouse-tracker-mapwins.component.scss'],
})
export class InhouseTrackerMapwinComponent {

    mapsNeeded: number = 3;
    mapsWonLeft: number = 2;
    mapsWonRight: number = 1;

    constructor() {
    }

    numSequence(n: number): Array<number> {
        return Array(n);
    }

}
