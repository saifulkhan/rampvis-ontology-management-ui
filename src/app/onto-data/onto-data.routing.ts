import { Routes } from '@angular/router';
import { DataListComponent } from './data-list/data-list.component';

export const OntoDataRoutes: Routes = [
    {
        path: '',
        children: [{ path: '', component: DataListComponent }],
    },
];
