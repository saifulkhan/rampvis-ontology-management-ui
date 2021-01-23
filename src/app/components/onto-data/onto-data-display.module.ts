import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxJsonViewModule } from 'ng-json-view';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../material.module';

import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { OntoDataTableAComponent } from './table-a/table-a.component';
import { OntoDataShowComponent } from './show/show.component';
import { OntoDataEditComponent } from './edit/onto-data-edit.component';
import { OntoDataGroupComponent } from './group/group.component';
import { OntoDataSearchTableComponent } from './search-table/search-table.component';
import { OntoDataGroupTableComponent } from './group-table/group-table.component';

@NgModule({
    declarations: [
      OntoDataTableAComponent,
      OntoDataSearchTableComponent,
      OntoDataEditComponent,
      OntoDataShowComponent,
      OntoDataGroupComponent,
      OntoDataGroupTableComponent,
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
      OntoDataGroupComponent,
      OntoDataSearchTableComponent,
      OntoDataEditComponent,
      OntoDataShowComponent,
      OntoDataGroupTableComponent,
    ],

})
export class OntoDataDisplayModule {}
