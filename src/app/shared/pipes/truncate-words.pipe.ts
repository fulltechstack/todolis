import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWords'
})
export class TruncateWordsPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (!value) return '';

    if (value.length > limit) {
      return value.slice(0, limit) + '...';
    } else {
      return value;
    }
  }
}
