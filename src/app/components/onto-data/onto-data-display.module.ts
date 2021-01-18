import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxJsonViewModule } from 'ng-json-view';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../material.module';

import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { OntoDataTableAComponent } from './table-a/onto-data-table-a.component';
import { OntoDataInspectComponent } from './inspect/onto-data-inspect.component';
import { OntoDataEditComponent } from './edit/onto-data-edit.component';
import { OntoDataTableBComponent } from './table-b/onto-data-table-b.component';
import { OntoDataTableSComponent } from './table-s/onto-data-table-s.component';

@NgModule({
    declarations: [
      OntoDataTableAComponent,
      OntoDataTableBComponent,
      OntoDataTableSComponent,
      OntoDataEditComponent,
      OntoDataInspectComponent,
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
      OntoDataTableAComponent,
      OntoDataTableBComponent,
      OntoDataTableSComponent,
      OntoDataEditComponent,
      OntoDataInspectComponent,
    ],

})
export class OntoDataDisplayModule {}
