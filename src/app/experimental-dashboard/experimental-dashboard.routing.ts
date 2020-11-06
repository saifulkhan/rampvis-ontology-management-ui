import { Routes } from '@angular/router';
import { ExperimentalDashboardComponent } from './experimental-dashboard.component';

export const DashboardRoutes: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: ExperimentalDashboardComponent
        }]
    }
];
