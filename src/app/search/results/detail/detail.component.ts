import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../search.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {

  public phone;
  public err = false;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  public get model(): Array<Array<any>> {
    const obj=Object.assign({},this.phone);
    delete obj['img'];
    return Object.entries(obj);
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const model = params.model
      this.searchService.fetchDetail(model)
      .subscribe(
        phone => this.phone = phone[0],
        err => this.err = true
      )
    });
  }

  public goBack(): void {
    this.location.back();
  }
}