import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/do';

@Injectable()
export class SearchService {

  private os: Array<string>;
  private brands: Array<string>;
  private baseUrl = 'http://localhost:7777/api';
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  public goSearch(input: string, filter): void {
    if(input) filter.query=input;
    this.router.navigate(['/search', filter])
  }

  public goToDetail(model: string): void {
    this.router.navigate(['/detail', model]);
  }

  public fetchDetail(model: string): Observable<any> {
    const partialUrl = '/detail/' + model;
    return this.http.get(this.baseUrl + partialUrl);
  }

  public async getFilterData(): Promise<any> {
    return {
      os: this.os || await this.fetchOsList(),
      brands: this.brands || await this.fetchBrands()
    }
  }

  public getPhones(): Observable<any> {
    const partialUrl = this.router.routerState.snapshot.url;
    return this.http.get<any[]>(this.baseUrl + partialUrl);
  }

  private fetchBrands(): Promise<string[]> {
    return this.http.get<string[]>(this.baseUrl+'/brands')
      .do(results => this.brands = results)
      .toPromise()
  }

  private fetchOsList(): Promise<string[]> {
    return this.http.get<string[]>(this.baseUrl+'/os')
      .do(results => this.os = results)
      .toPromise()
  }
}