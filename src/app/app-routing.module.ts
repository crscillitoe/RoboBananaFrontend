import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PredictionRenderComponent } from './prediction-render/prediction-render.component';

const routes: Routes = [
    {
        path: "prediction",
        component: PredictionRenderComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }