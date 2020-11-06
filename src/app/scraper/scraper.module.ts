import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';

import { CollectionListComponent } from './collection-list/collection-list.component';
import { routes } from './scraper.routing';
import { SourceListComponent } from './source-list/source-list.component';
import { CollectionEditComponent } from './collection-edit/collection-edit.component';
import { SourceEditComponent } from './source-edit/source-edit.component';
import { MiningListComponent } from './mining-list/mining-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PDFViewerModule } from '../shared/pdf-viewer/pdf-viewer.module';
import { CustomPipesModule } from '../shared/pipes/custom-pipes.module';

@NgModule({
	declarations: [
		CollectionListComponent,
		SourceListComponent,
		CollectionEditComponent,
		SourceEditComponent,
		MiningListComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		MaterialModule,
		MatBadgeModule,
		ReactiveFormsModule,
		MatInputModule,
		MatFormFieldModule,
		PDFViewerModule,
		MatFormFieldModule,
		PDFViewerModule,
		CustomPipesModule
	],
	entryComponents: [
		CollectionEditComponent,
		SourceEditComponent
	]
})

export class ScraperModule {
}
