import { Injectable } from '@angular/core';
import { phones } from '../mockup-data';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SearchService {

  private mockupData = phones;

  public getPhones(name: string, params?): Observable<any> {

    let phones = this.mockupData.filter(phone => phone.name.indexOf(name) !== -1);

    if(params) {
      for (const [key, value] of Object.entries(params)) {
        phones = phones.filter(phone => phone[key] === value)
      }
    }
    return Observable.create(observer => {
      observer.next(phones);
      observer.complete();
    })
  }
}