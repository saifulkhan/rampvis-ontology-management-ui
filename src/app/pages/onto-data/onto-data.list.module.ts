import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';

import { OntoDataListRoutes } from './onto-data.list.routing';
import { DirectivesModule } from '../../directives/directives.module';
import { OntoDataService } from '../../services/ontology/onto-data.service';
import { OntoDataListComponent } from './onto-data-list.component';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { OntoDataModule } from '../../components/onto-data/onto-data.module';

@NgModule({
    declarations: [
      OntoDataListComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(OntoDataListRoutes),
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        CustomPipesModule,
        OntoDataModule,
    ],
    providers: [OntoDataService],
})
export class OntoDataListModule {}
