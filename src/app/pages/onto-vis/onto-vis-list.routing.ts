import { Routes } from '@angular/router';
import { OntoVisListComponent } from './onto-vis-list.component';

export const OntoVisViewRoutes: Routes = [
    {
        path: '',
        children: [
          { path: '', component: OntoVisListComponent }
        ],
    },
];
