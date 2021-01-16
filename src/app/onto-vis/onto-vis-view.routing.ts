import { Routes } from '@angular/router';
import { OntoVisComponent } from './onto-vis.component';

export const OntoVisViewRoutes: Routes = [
    {
        path: '',
        children: [
          { path: '', component: OntoVisComponent }
        ],
    },
];
