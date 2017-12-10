import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'prettyString'})
export class PrettyStringPipe implements PipeTransform {
  transform(value: string): string {
    return value ? this.capitalize(value.replace(/\_/g, ' ')) : '';
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}