import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MaterialModule } from '../material.module';
import { TestComponentsRoutes } from './test-components.routing';
import { CustomSingleSelectionModule } from '../components/custom-single-selection/custom-single-selection.module';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { AdvancedSearchControlModule } from '../components/advanced-search-control/advanced-search-control.module';
import { TestComponentsComponent } from './test-components.component';
import { OntoDataDisplayModule } from '../components/onto-data/onto-data-display.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TestComponentsRoutes),
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MaterialModule,
        CustomSingleSelectionModule,
        // TimelineModule,
        CustomPipesModule,
        AdvancedSearchControlModule,
        OntoDataDisplayModule,
    ],
    declarations: [TestComponentsComponent],
})
export class TestComponentsModule {}
