import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { TimelineModule } from '../components/timeline/timeline.module';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { PDFViewerModule } from '../components/pdf-viewer/pdf-viewer.module';

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
    ],
    declarations: [
        DashboardComponent,
    ]
})

export class DashboardModule {}
