import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {
    constructor() { }

    template(message: string, data: any) {
        if (!data) { return message; }
        
        const keys: string = Object.keys(data).join('|');
        const regex = new RegExp('{(' + keys + ')}', 'g');
        return message.replace(regex, (match: any, number: any) => { 
          return typeof data[number] != 'undefined'
            ? (Array.isArray(data[number]) ? data[number].join(', ') : data[number])
            : match
          ;
        });
    }
}
