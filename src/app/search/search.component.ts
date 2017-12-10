import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  @Output() submit = new EventEmitter<string>();

  public search(input: string) {
    this.submit.emit(input);
  }
}