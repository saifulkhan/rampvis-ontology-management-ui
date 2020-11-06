import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { MdModule } from '../md/md.module';
import { MaterialModule } from '../material.module';
import { GridsterModule } from 'angular-gridster2';
import { ExperimentalDashboardComponent } from './experimental-dashboard.component';
import { DashboardRoutes } from './experimental-dashboard.routing';
import { WidgetGridComponent } from './widget-grid/widget-grid.component';
import { ExperimentalTimelineComponent } from './widgets/dashboard-timeline-tile/dashboard-timeline-tile.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    //MdModule,
    MaterialModule,
    GridsterModule,
  ],
  declarations: [
    ExperimentalDashboardComponent,
    WidgetGridComponent,
    ExperimentalTimelineComponent
  ],
  entryComponents: [
    ExperimentalTimelineComponent
  ]
})
export class ExperimentalDashboardModule {}
