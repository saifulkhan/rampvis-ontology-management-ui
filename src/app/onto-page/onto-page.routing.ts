import { Routes } from '@angular/router';

import { OntoPageResolverService } from '../services/ontology/onto-page.resolver';
import { OntoPageExtComponent } from '../components/onto-page/ext/onto-page-ext.component';
import { OntoPageComponent } from './onto-page.component';

export const OntoPageRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: OntoPageComponent,
            },
            {
                path: ':bindingType',
                component: OntoPageComponent,
            },
            {
                path: 'page/:pageId',
                component: OntoPageExtComponent,
                resolve: { ontoPageExt: OntoPageResolverService },
            },
        ],
    },
];
