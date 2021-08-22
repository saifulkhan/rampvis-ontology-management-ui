import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {ActivitiesRoutes} from './activities.routing';
import {ActivitiesListComponent} from './activities-list/activities.list.component';
import { ActivitiesService } from './activities.service'

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ActivitiesRoutes),
		FormsModule,
		MaterialModule,
		ReactiveFormsModule,
	],
	declarations: [
		ActivitiesListComponent
	],
	providers: [
		ActivitiesService
	]
})

export class ActivitiesModule {
}
