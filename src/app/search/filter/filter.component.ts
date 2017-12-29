import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Filter } from './filter';
import 'rxjs/add/operator/finally'
import 'rxjs/add/operator/takeUntil';
import { SearchService } from '../search.service';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit {
  
  @Input() value:Filter;
  public form: FormGroup;
  public filterData: Filter;
  
  constructor(
    private fb: FormBuilder,
    private searchService: SearchService
  ) {}

  public ngOnInit() {
    this.form = this.buildForm();
    if(this.value) this.setInitValue();
    this.searchService.getFilterData().then(filterData => {
      this.filterData=filterData;
      console.log("pobrano ",filterData)
    });
  }

  public getValue(): Filter {
    return Object.keys(this.form.value).reduce((obj, key) => {    
      if (!!this.form.value[key]){
        obj[key] = this.form.value[key];
      }
      return obj;
    }, {});
  }

  private setInitValue() {
    this.form.patchValue(this.value);
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      'os': ['', [Validators.required]],
      'brand': ['', [Validators.required]],
      'price-from': ['', [Validators.min(0)]],
      'price-to': ['', [Validators.min(0)]],
      'ram-from': ['', [Validators.min(0)]],
      'ram-to': ['', [Validators.max(100)]],
      'display-inch-from': ['', [Validators.min(0), Validators.max(10)]],
      'display-inch-to': ['', [Validators.min(0), Validators.max(10)]]
    })
  }
}