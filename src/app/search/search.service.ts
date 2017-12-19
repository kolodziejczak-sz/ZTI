import { Injectable } from '@angular/core';
import { phones } from '../mockup-data';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class SearchService {

  constructor(
    private router: Router
  ) {

  }

  private mockupData = phones;

  public goSearch(input: string, filter): void {
    if(input) filter.query=input;
    this.router.navigate(['/search', filter])
  }

  public goToDetail(id: number): void {
    this.router.navigate(['/detail', id]);
  }

  public fetchDetail(id: number): Observable<any> {
    const phone = phones.filter(phone => phone.id===id).pop();
    return Observable.create(observer => {
      observer.next(phone);
      observer.complete();
    })
  }

  public getFilterData(): Observable<any> {
    return Observable.create(observer => {
      observer.next({
        os: ['android', 'ios', 'windows'],
        brands: ['lg', 'acer', 'xiaomi', 'huawei', 'apple']
      });
      observer.complete();
    })
  }

  public getPhones(params): Observable<any> {
    return Observable.create(observer => {
      observer.next(phones);
      observer.complete();
    })
  }
}