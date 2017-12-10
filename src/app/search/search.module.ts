import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FilterComponent } from './filter/filter.component';
import { MainComponent } from './main/main.component';
import { SearchComponent } from './search.component';
import { SearchService } from './search.service';
import { SearchRoutingModule } from './search-routing.module';
import { SliderComponent } from './slider/slider.component';
import { ResultsComponent } from './results/results.component';
import { DetailComponent } from './results/detail/detail.component';
import { TileComponent } from './results/tile/tile.component';
import { PrettyStringPipe } from './results/detail/pretty-string.pipe';


@NgModule({
  declarations: [
    DetailComponent,
    FilterComponent,
    MainComponent,
    PrettyStringPipe,
    SearchComponent,
    SliderComponent,
    TileComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SearchRoutingModule,
    ReactiveFormsModule,
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
