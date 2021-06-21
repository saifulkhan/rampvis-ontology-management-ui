import { Routes } from '@angular/router';
import { PrivateLayoutComponent } from './private-layout.component';
import { Role } from '../../models/role.enum';

export const PrivateLayoutRoutes: Routes = [
    {
        path: '',
        component: PrivateLayoutComponent,
        children: [
            {
                path: 'home',
                data: { allowedRoles: [Role.ADMIN, Role.USER] },
                loadChildren: () => import('../../dashboard/dashboard.module').then((m) => m.DashboardModule),
            },
            {
                path: 'vis',
                data: { allowedRoles: [Role.ADMIN] },
                loadChildren: () => import('../../onto-vis/onto-vis-view.module').then((m) => m.OntoVisViewModule),
            },
            {
                path: 'data',
                data: { allowedRoles: [Role.ADMIN] },
                loadChildren: () => import('../../onto-data/onto-data.view.module').then((m) => m.OntoDataViewModule),
            },
            {
                path: 'propagation',
                data: { allowedRoles: [Role.ADMIN] },
                loadChildren: () => import('../../propagation/propagation.module').then((m) => m.PropagationModule),
            },
            {
                path: 'pages',
                data: { allowedRoles: [Role.ADMIN] },
                loadChildren: () => import('../../onto-page/onto-page-view.module').then((m) => m.OntoPageViewModule),
            },
            {
                path: 'search',
                data: { allowedRoles: [Role.ADMIN, Role.USER] },
                loadChildren: () => import('../../search/search.module').then((m) => m.SearchModule),
            },
            {
                path: 'admin',
                data: { allowedRoles: [Role.ADMIN] },
                children: [
                    {
                        path: 'agents',
                        loadChildren: () => import('../../bots/bots.module').then((m) => m.BotsModule),
                    },
                    {
                        path: 'activities',
                        loadChildren: () =>
                            import('../../activities/activities.module').then((m) => m.ActivitiesModule),
                    },
                    {
                        path: 'users',
                        loadChildren: () => import('../../user/user.module').then((m) => m.UserModule),
                    },
                ],
            },
            {
                path: 'test-components',
                data: { allowedRoles: [Role.ADMIN, Role.USER] },
                loadChildren: () => import('../../test-components/test-components.module').then((m) => m.TestComponentsModule),
            },
        ],
    },
];
