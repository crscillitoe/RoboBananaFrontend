import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoolComponent } from './cool/cool.component';
import { PollRenderComponent } from './poll-render/poll-render.component';
import { PredictionRenderComponent } from './prediction-render/prediction-render.component';
import { SubGoalComponent } from './sub-goal/sub-goal.component';
import { SubRenderComponent } from './sub-render/sub-render.component';
import { VodReviewComponent } from './vod-review/vod-review.component';
import { TimerRenderComponent } from './timer-render/timer-render.component';
import { TestingComponent } from './testing/testing.component';
import { StreamLayoutComponent } from './stream-layout/stream-layout.component';
import { ChatComponent } from './chat/chat.component';
import { ConnectFourComponent } from './connect-four/connect-four.component';
import { ViewerComponent } from './viewer/viewer.component';
import { SpotifyComponent } from './spotify-nowplaying/spotify-nowplaying.component';
import { EmotePopupsComponent } from './emote-popups/emote-popups.component';
import { UnderpeelDraftComponent } from './underpeel-draft/underpeel-draft.component';
import { PokemonComponent } from './pokemon/pokemon.component';

const routes: Routes = [
    {
        path: "prediction",
        component: PredictionRenderComponent,
    },
    {
        path: "subs",
        component: SubRenderComponent,
    },
    {
        path: "polls",
        component: PollRenderComponent,
    },
    {
        path: "chat",
        component: ChatComponent,
    },
    {
        path: "subgoal",
        component: SubGoalComponent,
    },
    {
        path: "cool",
        component: CoolComponent,
    },
    {
        path: "vods",
        component: VodReviewComponent,
    },
    {
        path: "timer",
        component: TimerRenderComponent,
    },
    {
        path: "testing",
        component: TestingComponent,
    },
    {
        path: "stream-layout",
        component: StreamLayoutComponent,
    },
    {
        path: "chat",
        component: ChatComponent
    },
    {
        path: "connect-four",
        component: ConnectFourComponent
    },
    {
        path: "viewer",
        component: ViewerComponent
    },
    {
        path: "spotify",
        component: SpotifyComponent
    },
    {
        path: "emote-popups",
        component: EmotePopupsComponent
    },
    {
        path: "underpeel-draft",
        component: UnderpeelDraftComponent
    },
    {
        path: "pokemon",
        component: PokemonComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
