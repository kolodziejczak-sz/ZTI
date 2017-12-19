import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {

  public filterVisibility = false;

  constructor(
    private searchService: SearchService
  ) {}

  public toggleFilter() {
    this.filterVisibility=!this.filterVisibility;
  }
}