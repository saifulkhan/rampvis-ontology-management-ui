import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {

  constructor() {}

  transform(value: string, args?: any): string {
    const limit = parseInt(args);
    if (value?.length > limit) return value.slice(0, limit) + '...';
    return value;
  }
}
