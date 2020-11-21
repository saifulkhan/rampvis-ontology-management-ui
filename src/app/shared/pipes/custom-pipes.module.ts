import { NgModule } from '@angular/core';
import { SortPipe } from './sort.pipe';
import { DateAgoPipe } from './date-ago.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
    declarations: [
		TruncatePipe, 
		DateAgoPipe, 
		SafeUrlPipe,
		SortPipe,
	],
    exports: [
		TruncatePipe, 
		DateAgoPipe, 
		SafeUrlPipe,
		SortPipe,
	],
})
export class CustomPipesModule {}
