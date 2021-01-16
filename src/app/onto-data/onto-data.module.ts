import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';

import { OntoDataRoutes } from './onto-data.routing';
import { DirectivesModule } from '../directives/directives.module';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { OntoDataComponent } from './onto-data.component';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { OntoDataDisplayModule } from '../components/onto-data/onto-data-display.module';

@NgModule({
    declarations: [
      OntoDataComponent,
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
        OntoDataDisplayModule,
    ],
    providers: [OntoDataService],
})
export class OntoDataModule {}
