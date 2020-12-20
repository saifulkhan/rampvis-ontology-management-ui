import { Routes } from '@angular/router';
import { OntoDataComponent } from './onto-data.component';

export const OntoDataRoutes: Routes = [
    {
        path: '',
        children: [{ path: '', component: OntoDataComponent }],
    },
];
