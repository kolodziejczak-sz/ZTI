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

  public get groups(): Array<Array<any>> {
    const obj=Object.assign({},this.phone);
    delete obj['img'];
    const groups = [];
    const itemsPerGroup=18;
    let groupIndex=0;
    let group=[];
    Object.entries(obj).forEach((entry, index) => {
      if(index>0 && index%itemsPerGroup===0) {
        groupIndex++;
        groups.push(group);
        group=[];
      }
      group.push(entry);
    });
    return groups;
  }

  public ngOnInit(): void {
    this.route
    .paramMap
    .map(params => params.get('id') || '')
    .subscribe(id => {
      this.searchService.fetchDetail(id)
      .subscribe(
        phone => this.phone = phone,
        err => this.err = true
      )
    });
  }

  public goBack(): void {
    this.location.back();
  }
}