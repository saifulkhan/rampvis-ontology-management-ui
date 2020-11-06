import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material.module';
import { SearchRoutes } from './search.routing';
import { SearchService } from './search.service';
import { TwitterSearchComponent } from './twitter-search/twitter.search.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(SearchRoutes),
		FormsModule,
		MaterialModule,
		ReactiveFormsModule,
	],
	declarations: [
		TwitterSearchComponent
	],
	providers: [
		SearchService
	]
})

export class SearchModule {
}
