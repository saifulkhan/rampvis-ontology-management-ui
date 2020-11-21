import { Routes } from '@angular/router';
import { DataListComponent } from './data-list/data-list.component';
import { PageListComponent } from './page-list/page-list.component';
import { VisListComponent } from './vis-list/vis-list.component';

export const OntologyRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'vis', component: VisListComponent },
      { path: 'data', component: DataListComponent },
      { path: 'page', component: PageListComponent },
      { path: 'page/:releaseType', component: PageListComponent },
    ]
  }
];
