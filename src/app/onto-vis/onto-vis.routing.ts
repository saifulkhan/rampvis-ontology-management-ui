import { Routes } from '@angular/router';
import { OntoVisComponent } from './onto-vis.component';

export const OntoVisRoutes: Routes = [
    {
        path: '',
        children: [
          { path: '', component: OntoVisComponent }
        ],
    },
];
