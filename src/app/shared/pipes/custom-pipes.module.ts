import { NgModule } from '@angular/core';
import { DateAgoPipe } from './date-ago.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
    declarations: [
		TruncatePipe, 
		DateAgoPipe, 
		SafeUrlPipe,
	],
    exports: [
		TruncatePipe, 
		DateAgoPipe, 
		SafeUrlPipe,
	],
})
export class CustomPipesModule {}
