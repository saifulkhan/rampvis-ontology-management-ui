import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MaterialModule } from '../../material.module';
import { TestComponentsRoutes } from './test-components.routing';
import { CustomSingleSelectionModule } from '../../components/custom-single-selection/custom-single-selection.module';
import { CustomPipesModule } from '../../pipes/custom-pipes.module';
import { TestComponentsComponent } from './test-components.component';
import { OntoDataModule } from '../../components/onto-data/onto-data.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TestComponentsRoutes),
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MaterialModule,
        CustomSingleSelectionModule,
        CustomPipesModule,
        OntoDataModule,
    ],
    declarations: [TestComponentsComponent],
})
export class TestComponentsModule {}
