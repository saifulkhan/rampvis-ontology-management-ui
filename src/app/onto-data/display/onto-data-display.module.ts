import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxJsonViewModule } from 'ng-json-view';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../material.module';

import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { OntoDataTableComponent } from './table/onto-data-table.component';
import { OntoDataInspectComponent } from './inspect/onto-data-inspect.component';
import { OntoDataEditComponent } from './edit/onto-data-edit.component';
import { KeywordsEditComponent } from './edit/keywords-edit.component';
import { QueryparamEditComponent } from './edit/queryparam-edit.component';
 
@NgModule({
    declarations: [
      OntoDataTableComponent,
      OntoDataEditComponent,
      OntoDataInspectComponent,
      KeywordsEditComponent,
      QueryparamEditComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        NgxJsonViewModule,
        CustomPipesModule,
    ],
    exports: [
      OntoDataTableComponent,
      OntoDataEditComponent,
      OntoDataInspectComponent,
      KeywordsEditComponent,
      QueryparamEditComponent,
    ],
   
})
export class OntoDataDisplayModule {}
