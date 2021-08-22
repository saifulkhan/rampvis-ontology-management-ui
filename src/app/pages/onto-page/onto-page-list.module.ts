import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../material.module';
import { DirectivesModule } from '../../directives/directives.module';
import { OntoPageService } from '../../services/ontology/onto-page.service';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { CustomSingleSelectionModule } from '../../components/custom-single-selection/custom-single-selection.module';
import { OntoPageModule } from '../../components/onto-page/onto-page.module';
import { OntoPageListComponent } from './onto-page-list.component';
import { OntoPageListRoutes } from './onto-page-list.routing';
import { OntoPageComponent } from './onto-page.component';
import { OntoDataModule } from '../../components/onto-data/onto-data.module';
import { OntoVisModule } from '../../components/onto-vis/onto-vis.module';

@NgModule({
    declarations: [
        OntoPageListComponent,
        OntoPageComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        RouterModule.forChild(OntoPageListRoutes),
        CustomPipesModule,
        CustomSingleSelectionModule,
        OntoPageModule,
        OntoVisModule,
        OntoDataModule,
    ],
    providers: [OntoPageService],
})
export class OntoPageListModule {}
