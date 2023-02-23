import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PollRenderComponent } from './poll-render/poll-render.component';
import { PredictionRenderComponent } from './prediction-render/prediction-render.component';
import { SubGoalComponent } from './sub-goal/sub-goal.component';
import { SubRenderComponent } from './sub-render/sub-render.component';

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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
