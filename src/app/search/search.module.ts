import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchComponent } from './search.component';
import { SearchService } from './search.service';
import { SearchRoutingModule } from './search-routing.module';
import { SliderComponent } from './slider/slider.component';
import { ResultsComponent } from './results/results.component';


@NgModule({
  declarations: [
    SearchComponent,
    SliderComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    RouterModule
  ],
  exports: [
    SearchComponent
  ],
  providers: [
    SearchService
  ]
})
export class SearchModule { }
