import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoolComponent } from './cool/cool.component';
import { PollRenderComponent } from './poll-render/poll-render.component';
import { PredictionRenderComponent } from './prediction-render/prediction-render.component';
import { SubGoalComponent } from './sub-goal/sub-goal.component';
import { SubRenderComponent } from './sub-render/sub-render.component';
import { VodReviewComponent } from './vod-review/vod-review.component';
import { TimerRenderComponent } from './timer-render/timer-render.component';
import { OverlayBoxComponent } from './overlay-box/overlay-box.component';
import { TestingComponent } from './testing/testing.component';

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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
