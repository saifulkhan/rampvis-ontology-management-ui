import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { OntoVisTableComponent } from './table/onto-vis-table.component';
import { OntoVisEditComponent } from './edit/onto-vis-edit.component';
import { OntoVisTableSimpleComponent } from './table-simple/onto-vis-table-simple.component';


@NgModule({
    declarations: [
      OntoVisTableComponent,
      OntoVisTableSimpleComponent,
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
      OntoVisTableComponent,
      OntoVisTableSimpleComponent,
      OntoVisEditComponent,
    ],
})
export class OntoVisDisplayModule {}
