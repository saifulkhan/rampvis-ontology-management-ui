import { NgModule } from '@angular/core';
import { SortPipe } from './sort.pipe';
import { DateAgoPipe } from './date-ago.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { TruncatePipe } from './truncate.pipe';
import { AutocompleteHighlightPipe } from './autocomplete-highlight.pipe';
import { SearchPipe } from './search.pipe';
import { FilterPipe } from './filter.pipe';

@NgModule({
    declarations: [
		TruncatePipe,
		DateAgoPipe,
		SafeUrlPipe,
		SortPipe,
		AutocompleteHighlightPipe,
        SearchPipe,
        FilterPipe,
	],
    exports: [
		TruncatePipe,
		DateAgoPipe,
		SafeUrlPipe,
		SortPipe,
		AutocompleteHighlightPipe,
        SearchPipe,
        FilterPipe,
	],
})
export class CustomPipesModule {}
