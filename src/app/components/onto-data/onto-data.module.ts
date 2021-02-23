import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxJsonViewModule } from 'ng-json-view';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../material.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { OntoDataMainTableComponent } from './main-table/main-table.component';
import { OntoDataShowComponent } from './show/show.component';
import { OntoDataEditComponent } from './edit/edit.component';
import { OntoDataGroupComponent } from './group/group.component';
import { OntoDataSearchTableComponent } from './search-table/search-table.component';
import { OntoDataGroupTableComponent } from './group-table/group-table.component';
import { OntoDataExGroupComponent } from './ex-group/ex-group.component';

@NgModule({
    declarations: [
      OntoDataMainTableComponent,
      OntoDataSearchTableComponent,
      OntoDataEditComponent,
      OntoDataShowComponent,
      OntoDataGroupComponent,
      OntoDataExGroupComponent,
      OntoDataGroupTableComponent,
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
        NgxJsonViewModule,
        CustomPipesModule,
    ],
    exports: [
      OntoDataMainTableComponent,
      OntoDataGroupComponent,
      OntoDataExGroupComponent,
      OntoDataSearchTableComponent,
      OntoDataEditComponent,
      OntoDataShowComponent,
      OntoDataGroupTableComponent,
    ],

})
export class OntoDataModule {}
