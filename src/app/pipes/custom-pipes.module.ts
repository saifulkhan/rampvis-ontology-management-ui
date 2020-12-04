import { NgModule } from '@angular/core';
import { SortPipe } from './sort.pipe';
import { DateAgoPipe } from './date-ago.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { TruncatePipe } from './truncate.pipe';
import { AutocompleteHighlightPipe } from './autocomplete-highlight.pipe';

@NgModule({
    declarations: [
		TruncatePipe, 
		DateAgoPipe, 
		SafeUrlPipe,
		SortPipe,
		AutocompleteHighlightPipe,
	],
    exports: [
		TruncatePipe, 
		DateAgoPipe, 
		SafeUrlPipe,
		SortPipe,
		AutocompleteHighlightPipe,
	],
})
export class CustomPipesModule {}
