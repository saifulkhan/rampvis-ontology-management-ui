import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'highlight' })
export class AutocompleteHighlightPipe implements PipeTransform {
    transform(text: string, search: any): string {
        // console.log('AutocompleteHighlightPipe: text = ', text, ', search = ', search)
        const pattern = search
            .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
            .split(' ')
            .filter((t: any) => t.length > 0)
            .join('|');
        const regex = new RegExp(pattern, 'gi');

        return search ? text.replace(regex, (match) => `<span class="search-highlight">${match}</span>`) : text;
    }
}
