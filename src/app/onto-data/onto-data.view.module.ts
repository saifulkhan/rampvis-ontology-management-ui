import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';

import { OntoDataViewRoutes } from './onto-data.view.routing';
import { DirectivesModule } from '../directives/directives.module';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { OntoDataViewComponent } from './onto-data-view.component';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { OntoDataModule } from '../components/onto-data/onto-data.module';

@NgModule({
    declarations: [
      OntoDataViewComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(OntoDataViewRoutes),
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
export class OntoDataViewModule {}
