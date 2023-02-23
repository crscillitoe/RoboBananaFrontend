import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PollRenderComponent } from './poll-render/poll-render.component';
import { PredictionRenderComponent } from './prediction-render/prediction-render.component';
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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
