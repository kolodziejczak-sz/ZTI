import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  host: {
    'tabIndex': '0'  
  }
})

export class TileComponent {
  @Input("data") phone;
  @Output() click = new EventEmitter<number>();

  public figureClick(): void {
    console.log("ajdiczek", this.phone.id);
    this.click.emit(this.phone.id);
  }
}