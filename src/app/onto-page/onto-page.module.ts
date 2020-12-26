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
import { OntoPageDisplayModule } from './display/onto-page-display.module';
import { OntoPageComponent } from './onto-page.component';
import { OntoPageRoutes } from './onto-page.routing';

@NgModule({
    declarations: [OntoPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        RouterModule.forChild(OntoPageRoutes),
        CustomPipesModule,
        CustomSingleSelectionModule,
        OntoPageDisplayModule,
    ],
    providers: [OntoPageService],
})
export class OntologyModule {}
