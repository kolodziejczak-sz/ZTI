import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { SlideAnimation } from './animation';
import { slides } from './slides';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, OnDestroy {
  
  public slides = slides;
  public currentSlide = 0;
  private slideLength = slides.length;
  private interval;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit() { 
    this.startSlider();
  }

  public ngOnDestroy() {
    clearInterval(this.interval);
  }

  private startSlider() {
    this.interval = setInterval(() => this.changeSlide(), 4000);
  }

  private changeSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slideLength;
    this.changeDetectorRef.detectChanges();
  }
}
