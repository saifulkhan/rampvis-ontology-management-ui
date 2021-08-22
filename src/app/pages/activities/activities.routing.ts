import { Routes } from '@angular/router';
import { ActivitiesListComponent } from './activities-list/activities.list.component';

export const ActivitiesRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ActivitiesListComponent }
    ]
  }
];
