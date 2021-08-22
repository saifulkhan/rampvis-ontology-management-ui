import { Routes } from '@angular/router';
import { OntoDataListComponent } from './onto-data-list.component';

export const OntoDataListRoutes: Routes = [
    {
        path: '',
        children: [{ path: '', component: OntoDataListComponent }],
    },
];
