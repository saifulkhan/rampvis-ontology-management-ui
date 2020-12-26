import { Routes } from '@angular/router';
import { OntoPageComponent } from './onto-page.component';

export const OntoPageRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: OntoPageComponent },
            { path: ':bindingType', component: OntoPageComponent },
        ],
    },
];
