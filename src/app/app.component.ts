import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RoboBananaFrontend';

  testPrediction() {
    console.log("test prediction");
  }

  testRaffle() {
    console.log("test raffle");
  }

  testSub() {
    console.log("test sub");
  }
}
