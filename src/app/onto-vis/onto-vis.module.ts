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
import { VisListComponent } from './vis-list/vis-list.component';
import { VisEditComponent } from './vis-edit/vis-edit.component';
import { CustomPipesModule } from '../pipes/custom-pipes.module';

@NgModule({
    declarations: [
      VisListComponent, 
      VisEditComponent,
    ],
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
    ],
    providers: [OntoVisService],
    entryComponents: [VisEditComponent],
})
export class OntoVisModule {}
