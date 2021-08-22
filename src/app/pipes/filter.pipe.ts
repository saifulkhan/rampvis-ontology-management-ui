import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterPipe'
})
@Injectable()
export class FilterPipe implements PipeTransform {
    transform(array: any[], ...args: any[]): any {
        const propName: string = args[0];
        const propValue = args[1];
        if (!propValue) {
            return array;
        }
        return array.filter(prop => prop[propName].indexOf(propValue) !== -1);
    }
}
