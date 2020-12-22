import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MaterialModule } from '../material.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { CustomSingleSelectionModule } from '../components/custom-single-selection/custom-single-selection.module';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { AdvancedSearchControlModule } from '../components/advanced-search-control/advanced-search-control.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MaterialModule,
        CustomSingleSelectionModule,
        // TimelineModule,
        CustomPipesModule,
        AdvancedSearchControlModule,
    ],
    declarations: [DashboardComponent],
})
export class DashboardModule {}
