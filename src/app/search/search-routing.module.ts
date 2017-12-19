import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultsComponent } from './results/results.component';
import { MainComponent } from './main/main.component';
import { DetailComponent } from './results/detail/detail.component';

const searchRoutes: Routes = [
  { path: '',  component: MainComponent },
  { path: 'search', component: ResultsComponent },
  { path: 'detail/:id', component: DetailComponent }      
];

@NgModule({
  imports: [RouterModule.forChild(searchRoutes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }