import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SearchService } from './search.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  public search(input: string) {
    this.router.navigate(['/search', input]);
  }
}