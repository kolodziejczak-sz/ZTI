import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchComponent } from './search.component';
import { SliderComponent } from './slider/slider.component';
import { ResultsComponent } from './results/results.component';

const searchRoutes: Routes = [
  { path: '', 
    component: SearchComponent, 
    children: [
      { path: '', component: SliderComponent },
      { path: 'search/:name', component: ResultsComponent }    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(searchRoutes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }