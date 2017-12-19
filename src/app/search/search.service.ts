import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { phones } from '../mockup-data';
import { Router } from '@angular/router';

@Injectable()
export class SearchService {

  private mockupData = phones;
  private baseUrl = 'localhost:4000';
  
  constructor(
    private router: Router
  ) { }

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

  public getPhones(): Observable<any> {
    const partialUrl = this.router.routerState.snapshot.url;
    const url = this.baseUrl + partialUrl;
    console.log('przyszly get ', url);
    
    return Observable.create(observer => {
      observer.next(phones);
      observer.complete();
    })
  }
}