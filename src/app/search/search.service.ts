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

  public goSearch(input: string): void {
    this.router.navigate(['/search', input]);
  }

  public goToDetail(id: number): void {
    this.router.navigate(['/detail', id]);
  }

  public fetchDetail(id: number): Observable<any> {
    console.log(id);
    const phone = phones.filter(phone => phone.id===id).pop();
    console.log(phones);
    return Observable.create(observer => {
      observer.next(phone);
      observer.complete();
    })
  }

  public getPhones(name: string, params?): Observable<any> {
    return Observable.create(observer => {
      observer.next(phones);
      observer.complete();
    })
  }
}