import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  @ViewChild('input') inputRef;
  @Output() submit = new EventEmitter<string>();
  @Input() set value(val: string) {
    if(val) {
      this.inputRef.nativeElement.value=val;
    }      
  };

  constructor(private elementRef: ElementRef) {}

  public search(input: string) {
    this.submit.emit(input);
  }
}