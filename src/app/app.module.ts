import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PredictionRenderComponent } from './prediction-render/prediction-render.component';
import { RaffleRenderComponent } from './raffle-render/raffle-render.component';
import { SubRenderComponent } from './sub-render/sub-render.component';
import { PollRenderComponent } from './poll-render/poll-render.component';
import { SubGoalComponent } from './sub-goal/sub-goal.component';
import { CoolComponent } from './cool/cool.component';
import { CoolIconComponent } from './cool-icon/cool-icon.component';
import { CoolIconDirective } from './cool/cool-icon-directive';
import { VodReviewComponent } from './vod-review/vod-review.component';
import { TimerRenderComponent } from './timer-render/timer-render.component';
import { OverlayBoxComponent } from './overlay-box/overlay-box.component';
import { OverlayTitleComponent } from './overlay-title/overlay-title.component';
import { TestingComponent } from './testing/testing.component';
import { StreamLayoutComponent } from './stream-layout/stream-layout.component';
import { AdsComponent } from './ads/ads.component';
import { ChatComponent } from './chat/chat.component';
import { TalkingPngComponent } from './talking-png/talking-png.component';
import { ChessComponent } from './chess/chess.component';
import { BananaComponent } from './banana/banana.component';
import { TwoPlayerGameComponent } from './two-player-game/two-player-game.component';
import { DynamicOverlayComponent } from './dynamic-overlay/dynamic-overlay.component';
import { ConvertWithFunctionPipe } from './convert-with-function.pipe';
import { TitleComponent } from './dynamic-overlay/title/title.component';
import { HeaderComponent } from './dynamic-overlay/header/header.component';
import { TimerComponent } from './dynamic-overlay/timer/timer.component';
import { SideBannerComponent } from './dynamic-overlay/side-banner/side-banner.component';
import { ScrollingTextComponent } from './dynamic-overlay/scrolling-text/scrolling-text.component';
import { BackgroundVideoComponent } from './dynamic-overlay/background-video/background-video.component';
import { PrerollVideoComponent } from './dynamic-overlay/preroll-video/preroll-video.component';
import { HideableComponent } from './dynamic-overlay/hideable/hideable.component';
import { ChatWrapperComponent } from './dynamic-overlay/chat-wrapper/chat-wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    PredictionRenderComponent,
    RaffleRenderComponent,
    SubRenderComponent,
    PollRenderComponent,
    SubGoalComponent,
    CoolComponent,
    CoolIconComponent,
    CoolIconDirective,
    VodReviewComponent,
    TimerRenderComponent,
    OverlayBoxComponent,
    OverlayTitleComponent,
    TestingComponent,
    StreamLayoutComponent,
    AdsComponent,
    ChatComponent,
    TalkingPngComponent,
    ChessComponent,
    BananaComponent,
    TwoPlayerGameComponent,
    DynamicOverlayComponent,
    ConvertWithFunctionPipe,
    TitleComponent,
    HeaderComponent,
    TimerComponent,
    SideBannerComponent,
    ScrollingTextComponent,
    BackgroundVideoComponent,
    PrerollVideoComponent,
    HideableComponent,
    ChatWrapperComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  exports: [
    SubGoalComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
