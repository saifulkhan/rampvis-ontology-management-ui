import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  pure: false
})
@Injectable()
export class SearchPipe implements PipeTransform {
  transform(data: any, args: any): any {
    let filtered = data;
    if (!data || !args) return data;

    for (let key in args) {
      if (!args.hasOwnProperty(key)) continue;

      let v = args[key];

      data = data.filter((row: any) => {
        let k = row[key];
        if (typeof k == 'string') {
          return k.toLowerCase().indexOf(v.toLowerCase()) !== -1;
        }
        if (typeof k == 'boolean') {
          return k == v;
        }

        return false;
      })
    }

    return data;
  }
}
