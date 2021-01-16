import { Routes } from '@angular/router';
import { OntoDataViewComponent } from './onto-data-view.component';

export const OntoDataViewRoutes: Routes = [
    {
        path: '',
        children: [{ path: '', component: OntoDataViewComponent }],
    },
];
