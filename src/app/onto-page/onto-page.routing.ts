import { Routes } from '@angular/router';
import { PageListComponent } from './page-list/page-list.component';

export const OntologyRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: PageListComponent },
            { path: ':releaseType', component: PageListComponent },
        ],
    },
];
