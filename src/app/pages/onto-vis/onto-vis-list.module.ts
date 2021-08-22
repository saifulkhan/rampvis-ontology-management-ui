import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MaterialModule } from '../../material.module';
import { OntoVisViewRoutes } from './onto-vis-list.routing';
import { DirectivesModule } from '../../directives/directives.module';
import { OntoVisService } from '../../services/ontology/onto-vis.service';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { OntoVisModule } from '../../components/onto-vis/onto-vis.module';
import { OntoVisListComponent } from './onto-vis-list.component';

@NgModule({
    declarations: [OntoVisListComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(OntoVisViewRoutes),
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        CustomPipesModule,
        OntoVisModule,
    ],
    providers: [OntoVisService],
    entryComponents: [],
})
export class OntoVisListModule {}
