import { Routes } from '@angular/router';

import { OntoPageResolverService } from '../services/ontology/onto-page.resolver';
import { OntoPageBindingsComponent } from './bindings/onto-page-bindings.component';
import { OntoPagesViewComponent } from './view/onto-pages-view.component';

export const OntoPageViewRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: OntoPagesViewComponent,
            },
            {
                path: ':bindingType',
                component: OntoPagesViewComponent,
            },
            {
                path: 'page/:pageId',
                component: OntoPageBindingsComponent,
                resolve: { ontoPageExt: OntoPageResolverService },
            },
        ],
    },
];
