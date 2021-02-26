import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgSelectModule } from '@ng-select/ng-select';
import {
    NgxUiLoaderModule,
    NgxUiLoaderConfig,
    SPINNER,
    POSITION,
    PB_DIRECTION,
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule,
} from 'ngx-ui-loader';

import { PropagationRoutes } from './propagation.routing';
import { DirectivesModule } from '../directives/directives.module';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { PropagationComponent } from './propagation.component';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { CustomSingleSelectionModule } from '../components/custom-single-selection/custom-single-selection.module';
import { OntoVisModule } from '../components/onto-vis/onto-vis.module';
import { OntoDataModule } from '../components/onto-data/onto-data.module';
import { OntoPageModule } from '../components/onto-page/onto-page.module';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    bgsColor: 'rgba(0, 94, 184, 1)',
    bgsOpacity: 1,
    bgsPosition: POSITION.bottomRight,
    bgsSize: 20,
    bgsType: SPINNER.threeStrings,
    fgsColor: 'rgba(0, 94, 184, 1)',
    fgsPosition: POSITION.centerCenter,
    "blur": 0,
};

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

        NgSelectModule,
        NgxMatSelectSearchModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),

        CustomPipesModule,
        CustomSingleSelectionModule,
        OntoVisModule,
        OntoDataModule,
        OntoPageModule,
    ],
    providers: [OntoVisService],
})
export class PropagationModule {}
