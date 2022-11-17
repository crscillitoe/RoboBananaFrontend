import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }