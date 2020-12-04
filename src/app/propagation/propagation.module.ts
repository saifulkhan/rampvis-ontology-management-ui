import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PropagationRoutes } from './propagation.routing';
import { DirectivesModule } from '../directives/directives.module';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { PropagationComponent } from './vis-list/propagation.component';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { VisSelectionModule } from '../components/vis-selection/vis-selection.module';

@NgModule({
    declarations: [
      PropagationComponent, 
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(PropagationRoutes),
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        CustomPipesModule,
        VisSelectionModule
    ],
    providers: [OntoVisService],
    entryComponents: [],
})
export class PropagationModule {}
