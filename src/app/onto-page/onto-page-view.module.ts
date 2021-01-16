import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RouterModule } from '@angular/router';

import { DirectivesModule } from '../directives/directives.module';
import { OntoPageService } from '../services/ontology/onto-page.service';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { CustomSingleSelectionModule } from '../components/custom-single-selection/custom-single-selection.module';
import { OntoPageModule } from '../components/onto-page/onto-page.module';
import { OntoPagesViewComponent } from './onto-pages-view.component';
import { OntoPageViewRoutes } from './onto-page-view.routing';
import { OntoPageBindingsComponent } from './bindings/onto-page-bindings.component';
import { OntoDataDisplayModule } from '../components/onto-data/onto-data-display.module';
import { OntoVisDisplayModule } from '../components/onto-vis/onto-vis-display.module';

@NgModule({
    declarations: [
        OntoPagesViewComponent,
        OntoPageBindingsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        RouterModule.forChild(OntoPageViewRoutes),
        CustomPipesModule,
        CustomSingleSelectionModule,
        OntoPageModule,
        OntoVisDisplayModule,
        OntoDataDisplayModule,
    ],
    providers: [OntoPageService],
})
export class OntoPageViewModule {}
