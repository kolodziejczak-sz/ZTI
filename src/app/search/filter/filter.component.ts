import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Filter } from './filter';
import 'rxjs/add/operator/finally'
import 'rxjs/add/operator/takeUntil';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit, OnDestroy {

  @Output() change = new EventEmitter<Filter>();
  public form: FormGroup;
  private formSubscribtion: Subscription;
  
  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.form = this.buildForm();
    this.startPassingValueChanges();
  }

  public ngOnDestroy(): void {
    this.formSubscribtion.unsubscribe();
  }

  private buildForm(): FormGroup {
    const form = this.fb.group({
      // producent: this.fb.group({
      //   apple: false,
      //   windows: false,
      //   google: false
      // }),
      // price: this.fb.group({
      //   from: '',
      //   to: ''
      // }),
       os: this.fb.group({
         android: false,
         iOS: false,
         others: false
       }),
      // display: this.fb.group({
      //   from: '',
      //   to: ''
      // }),
      // dualSim: this.fb.group({
      //   yes: false,
      //   no: false
      // })
    })
    return form;
  }

  private startPassingValueChanges(): void{
    this.formSubscribtion = this.form.valueChanges
      .subscribe(form => this.change.emit(form));    
  }
}