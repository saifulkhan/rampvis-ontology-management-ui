import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { OntoVisRoutes } from './onto-vis.routing';
import { DirectivesModule } from '../directives/directives.module';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { OntoVisDisplayModule } from './display/onto-vis-display.module';
import { OntoVisComponent } from './onto-vis.component';

@NgModule({
    declarations: [OntoVisComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(OntoVisRoutes),
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        CustomPipesModule,
        OntoVisDisplayModule,
    ],
    providers: [OntoVisService],
    entryComponents: [],
})
export class OntoVisModule {}
