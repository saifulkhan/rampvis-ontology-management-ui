import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { OntoVisMainTableComponent } from './main-table/main-table.component';
import { OntoVisEditComponent } from './edit/onto-vis-edit.component';
import { OntoVisTableBComponent } from './table-b/table-b.component';


@NgModule({
    declarations: [
      OntoVisMainTableComponent,
      OntoVisTableBComponent,
      OntoVisEditComponent,
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
    ],
    exports: [
      OntoVisMainTableComponent,
      OntoVisTableBComponent,
      OntoVisEditComponent,
    ],
})
export class OntoVisModule {}
