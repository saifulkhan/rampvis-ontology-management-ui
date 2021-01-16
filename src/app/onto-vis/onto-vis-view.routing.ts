import { Routes } from '@angular/router';
import { OntoVisViewComponent } from './onto-vis-view.component';

export const OntoVisViewRoutes: Routes = [
    {
        path: '',
        children: [
          { path: '', component: OntoVisViewComponent }
        ],
    },
];
