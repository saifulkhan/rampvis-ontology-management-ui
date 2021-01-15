import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';

import { OntoPageEditComponent } from './edit/onto-page-edit.component';
import { BindingEditComponent } from './edit/binding-edit.component';
import { BindDataEditComponent } from './edit/binddata-edit.component';
import { Queryparam2EditComponent } from './edit/queryparam2-edit.component';
import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { CustomSingleSelectionModule } from '../../components/custom-single-selection/custom-single-selection.module';
import { MaterialModule } from '../../material.module';
import { OntoPageTableComponent } from './table/onto-page-table.component';
import { OntoVisDisplayModule } from '../../onto-vis/display/onto-vis-display.module';
import { OntoDataDisplayModule } from '../../onto-data/display/onto-data-display.module';
import { NgxDataTableModule } from '../../components/ngx-data-table/ngx-data-table.module';
import { OntoPageExtComponent } from './ext/onto-page-ext.component';

@NgModule({
    declarations: [
        OntoPageTableComponent,
        OntoPageEditComponent,
        BindingEditComponent,
        BindDataEditComponent,
        Queryparam2EditComponent,
        OntoPageExtComponent,
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
        NgxDataTableModule,
    ],
    exports: [
        OntoPageTableComponent,
        OntoPageEditComponent,
        OntoPageExtComponent,
    ]
})
export class OntoPageDisplayModule {}
