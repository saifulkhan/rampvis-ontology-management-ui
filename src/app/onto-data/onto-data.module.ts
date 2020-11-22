import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { OntoDataRoutes } from './onto-data.routing';
import { DirectivesModule } from '../shared/directives/directives.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { DataEditComponent } from './data-edit/data-edit.component';
import { DataListComponent } from './data-list/data-list.component';
import { QueryparamEditComponent } from './data-edit/queryparam-edit.component';
import { CustomPipesModule } from '../shared/pipes/custom-pipes.module';

@NgModule({
    declarations: [
      DataListComponent, 
      DataEditComponent, 
      QueryparamEditComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(OntoDataRoutes),
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        CustomPipesModule,
    ],
    providers: [OntoDataService],
    entryComponents: [DataEditComponent],
})
export class OntoDataModule {}
