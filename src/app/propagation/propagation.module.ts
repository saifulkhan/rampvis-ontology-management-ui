import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { PropagationRoutes } from './propagation.routing';
import { DirectivesModule } from '../shared/directives/directives.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { PropagationComponent } from './vis-list/propagation.component';
import { CustomPipesModule } from '../shared/pipes/custom-pipes.module';

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
    ],
    providers: [OntoVisService],
    entryComponents: [],
})
export class PropagationModule {}
