import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PredictionRenderComponent } from './prediction-render/prediction-render.component';
import { RaffleRenderComponent } from './raffle-render/raffle-render.component';
import { SubRenderComponent } from './sub-render/sub-render.component';

@NgModule({
  declarations: [
    AppComponent,
    PredictionRenderComponent,
    RaffleRenderComponent,
    SubRenderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
