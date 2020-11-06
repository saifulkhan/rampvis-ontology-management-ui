import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { TimelineModule } from '../shared/timeline/timeline.module';
import { CustomPipesModule } from '../shared/pipes/custom-pipes.module';
import { PDFViewerModule } from '../shared/pdf-viewer/pdf-viewer.module';
import { MiningTableModule } from '../shared/mining-table/mining-table.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        MaterialModule,
        AngularSvgIconModule,
        TimelineModule,
        CustomPipesModule,
        PDFViewerModule,
        MiningTableModule,
    ],
    declarations: [
        DashboardComponent,
    ]
})

export class DashboardModule {}
