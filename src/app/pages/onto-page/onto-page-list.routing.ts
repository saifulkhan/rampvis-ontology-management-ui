import { Routes } from '@angular/router';

import { OntoPageResolverService } from '../../services/ontology/onto-page.resolver';
import { OntoPageComponent } from './onto-page.component';
import { OntoPageListComponent } from './onto-page-list.component';

export const OntoPageListRoutes: Routes = [
    {
        path: '',
        children: [
            // {
            //     path: '',
            //     component: OntoPageComponent,
            // },
            {
                path: ':pageType',
                component: OntoPageListComponent,
            },
            {
                path: 'page/:pageId',
                component: OntoPageComponent,
                resolve: { ontoPageExt: OntoPageResolverService },
            },
        ],
    },
];
