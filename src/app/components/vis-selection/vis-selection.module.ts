import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { VisSelectionComponent } from './vis-selection.component';
import { DirectivesModule } from '../../directives/directives.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { OntoVisService } from 'src/app/services/ontology/onto-vis.service';

@NgModule({
    declarations: [VisSelectionComponent],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        CustomPipesModule,
    ],
    providers: [OntoVisService],
    exports: [VisSelectionComponent],
})
export class VisSelectionModule {}
