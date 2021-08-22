import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MaterialModule } from '../../material.module';
import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';
import { CustomSingleSelectionModule } from '../../components/custom-single-selection/custom-single-selection.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(HomeRoutes),
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MaterialModule,
        CustomSingleSelectionModule,
        // TimelineModule,
        CustomPipesModule,
    ],
    declarations: [HomeComponent],
})
export class DashboardModule {}
