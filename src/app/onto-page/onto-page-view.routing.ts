import { Routes } from '@angular/router';

import { OntoPageResolverService } from '../services/ontology/onto-page.resolver';
import { OntoPageBindingsComponent } from './bindings/onto-page-bindings.component';
import { OntoPagesListComponent } from './list/onto-pages-list.component';

export const OntoPageViewRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: OntoPagesListComponent,
            },
            {
                path: ':bindingType',
                component: OntoPagesListComponent,
            },
            {
                path: 'page/:pageId',
                component: OntoPageBindingsComponent,
                resolve: { ontoPageExt: OntoPageResolverService },
            },
        ],
    },
];
