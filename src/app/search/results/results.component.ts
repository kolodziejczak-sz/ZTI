import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { SearchService } from '../search.service';
import { Filter } from '../filter/filter';


@Component({
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  public phones;
  public params;

  constructor(
    private searchService: SearchService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public goToDetail(id: number): void {
    this.searchService.goToDetail(id);
  }

  public ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = this.alwaysFalse;

    this.route.params.subscribe(params => {
      this.params = params;
      this.searchService
        .getPhones(params)
        .subscribe(phones => this.phones=phones)
    });
  }

  private alwaysFalse() {
    return false;
  }
}