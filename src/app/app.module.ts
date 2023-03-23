import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PredictionRenderComponent } from './prediction-render/prediction-render.component';
import { RaffleRenderComponent } from './raffle-render/raffle-render.component';
import { SubRenderComponent } from './sub-render/sub-render.component';
import { PollRenderComponent } from './poll-render/poll-render.component';
import { SubGoalComponent } from './sub-goal/sub-goal.component';
import { CoolComponent } from './cool/cool.component';

@NgModule({
  declarations: [
    AppComponent,
    PredictionRenderComponent,
    RaffleRenderComponent,
    SubRenderComponent,
    PollRenderComponent,
    SubGoalComponent,
    CoolComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
