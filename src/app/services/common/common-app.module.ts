import { NgModule } from '@angular/core';
import { SearchPipe } from './search.pipe';
import { FilterPipe } from './filter.pipe';
import { SortPipe } from './sort.pipe';

@NgModule({
    imports: [
    ],
    declarations: [
        SearchPipe,
        FilterPipe,
        SortPipe
    ],
    exports: [
        SearchPipe,
        FilterPipe,
        SortPipe
    ]
})

export class CommonAppModule { }
