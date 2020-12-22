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
import { PropagationComponent } from './propagation.component';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { CustomSingleSelectionModule } from '../components/custom-single-selection/custom-single-selection.module';
import { OntoVisDisplayModule } from '../onto-vis/display/onto-vis-display.module';

@NgModule({
    declarations: [PropagationComponent],
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
        CustomSingleSelectionModule,
        OntoVisDisplayModule,
    ],
    providers: [OntoVisService],
})
export class PropagationModule {}
