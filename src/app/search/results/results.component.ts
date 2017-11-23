import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { SearchService } from '../search.service';


@Component({
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  public phones;

  constructor(
    private searchService: SearchService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route
    .queryParamMap
    .map(params => params.get('name') || '')
    .subscribe(name => {
      this.searchService.getPhones(name).subscribe(phones => {
        this.phones = phones;
        console.log(phones);
      })
    });
  }
}