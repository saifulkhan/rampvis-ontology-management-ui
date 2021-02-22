import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { OntoPageEditComponent } from './edit/edit.component';
import { BindingEditComponent } from './edit/binding-edit.component';
import { BindDataEditComponent } from './edit/binddata-edit.component';
import { Queryparam2EditComponent } from './edit/queryparam2-edit.component';
import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { CustomSingleSelectionModule } from '../custom-single-selection/custom-single-selection.module';
import { MaterialModule } from '../../material.module';
import { OntoPageMainTableComponent } from './main-table/main-table.component';
import { OntoVisModule } from '../onto-vis/onto-vis.module';
import { OntoDataModule } from '../onto-data/onto-data.module';
import { OntoPageGroupComponent } from './group/group.component';
import { OntoPageExtGroupTableComponent } from './group-table/group-table.component';

@NgModule({
    declarations: [
        OntoPageMainTableComponent,
        OntoPageGroupComponent,
        OntoPageExtGroupTableComponent,
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
        NgSelectModule,
        NgxMatSelectSearchModule,
        CustomPipesModule,
        CustomSingleSelectionModule,
        OntoVisModule,
        OntoDataModule,
    ],
    exports: [
        OntoPageMainTableComponent,
        OntoPageGroupComponent,
        OntoPageExtGroupTableComponent,
        OntoPageEditComponent,
    ]
})
export class OntoPageModule {}
