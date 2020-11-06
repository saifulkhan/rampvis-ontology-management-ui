import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {
    constructor() { }

    template(message: string, data: object) {
        if (!data) { return message; }
        
        const keys: string = Object.keys(data).join('|');
        const regex = new RegExp('{(' + keys + ')}', 'g');
        return message.replace(regex, (match, number) => { 
          return typeof data[number] != 'undefined'
            ? (Array.isArray(data[number]) ? data[number].join(', ') : data[number])
            : match
          ;
        });
    }
}
