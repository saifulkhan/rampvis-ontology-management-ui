import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';

import { OntoPageEditComponent } from './edit-dialog/onto-page-edit.component';
import { BindingEditComponent } from './edit-dialog/binding-edit.component';
import { BindDataEditComponent } from './edit-dialog/binddata-edit.component';
import { Queryparam2EditComponent } from './edit-dialog/queryparam2-edit.component';
import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { CustomSingleSelectionModule } from '../custom-single-selection/custom-single-selection.module';
import { MaterialModule } from '../../material.module';
import { OntoPageTableComponent } from './table/onto-page-table.component';
import { OntoVisDisplayModule } from '../onto-vis/onto-vis-display.module';
import { OntoDataDisplayModule } from '../onto-data/onto-data-display.module';

@NgModule({
    declarations: [
        OntoPageTableComponent,
        OntoPageEditComponent,
        BindingEditComponent,
        BindDataEditComponent,
        Queryparam2EditComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        CustomPipesModule,
        CustomSingleSelectionModule,
        OntoVisDisplayModule,
        OntoDataDisplayModule,
    ],
    exports: [
        OntoPageTableComponent,
        OntoPageEditComponent,
    ]
})
export class OntoPageModule {}
