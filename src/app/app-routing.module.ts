import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoolComponent } from './cool/cool.component';
import { PollRenderComponent } from './poll-render/poll-render.component';
import { PredictionRenderComponent } from './prediction-render/prediction-render.component';
import { SubGoalComponent } from './sub-goal/sub-goal.component';
import { SubRenderComponent } from './sub-render/sub-render.component';
import { VodReviewComponent } from './vod-review/vod-review.component';

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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
