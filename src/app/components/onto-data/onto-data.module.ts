import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxJsonViewModule } from 'ng-json-view';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../material.module';

import { NgSelectModule } from '@ng-select/ng-select';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';

import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { OntoDataMainTableComponent } from './main-table/main-table.component';
import { OntoDataShowComponent } from './show/show.component';
import { OntoDataEditComponent } from './edit/edit.component';
import { OntoDataGroupComponent } from './group/group.component';
import { OntoDataGroupTableComponent } from './group/group-table.component';
import { OntoDataSearchTableComponent } from './search-table/search-table.component';
import { OntoDataMatchedComponent } from './matched/matched.component';
import { OntoDataMatchedTableComponent } from './matched/matched-table.component';
import { OntoDataExampleComponent } from './example/example.component';

@NgModule({
    declarations: [
        OntoDataMainTableComponent,
        OntoDataSearchTableComponent,
        OntoDataEditComponent,
        OntoDataShowComponent,
        OntoDataGroupComponent,
        OntoDataGroupTableComponent,
        OntoDataExampleComponent,
        OntoDataMatchedComponent,
        OntoDataMatchedTableComponent,
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
        TableVirtualScrollModule,
    ],
    exports: [
        OntoDataMainTableComponent,
        OntoDataGroupComponent,
        OntoDataSearchTableComponent,
        OntoDataEditComponent,
        OntoDataShowComponent,
        OntoDataGroupTableComponent,
        OntoDataExampleComponent,
        OntoDataMatchedComponent,
        OntoDataMatchedTableComponent,
    ],
})
export class OntoDataModule {}
