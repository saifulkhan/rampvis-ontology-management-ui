import { Routes } from '@angular/router';
import { PageListComponent } from '../onto-page/page-list/page-list.component';
import { PropagationComponent } from './vis-list/propagation.component';

export const PropagationRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: PropagationComponent },
      { path: ':releaseType', component: PropagationComponent },
    ]
  }
];
