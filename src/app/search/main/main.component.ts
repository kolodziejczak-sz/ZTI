import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {

  constructor(
    private searchService: SearchService
  ) {

  }
  public inputSubmit(inputValue: string): void {
    this.searchService.goSearch(inputValue);
  }
}