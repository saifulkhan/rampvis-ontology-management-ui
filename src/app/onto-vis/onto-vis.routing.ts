import { Routes } from '@angular/router';
import { VisListComponent } from './vis-list/vis-list.component';

export const OntoVisRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: VisListComponent },
    ]
  }
];
