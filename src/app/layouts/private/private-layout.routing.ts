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
                loadChildren: () => import('../../pages/home/home.module').then((m) => m.DashboardModule),
            },
            {
                path: 'vis',
                data: { allowedRoles: [Role.ADMIN] },
                loadChildren: () => import('../../pages/onto-vis/onto-vis-list.module').then((m) => m.OntoVisListModule),
            },
            {
                path: 'data',
                data: { allowedRoles: [Role.ADMIN] },
                loadChildren: () => import('../../pages/onto-data/onto-data.list.module').then((m) => m.OntoDataListModule),
            },
            {
                path: 'propagation',
                data: { allowedRoles: [Role.ADMIN] },
                loadChildren: () => import('../../pages/propagation/propagation.module').then((m) => m.PropagationModule),
            },
            {
                path: 'pages',
                data: { allowedRoles: [Role.ADMIN] },
                loadChildren: () => import('../../pages/onto-page/onto-page-list.module').then((m) => m.OntoPageListModule),
            },
            {
                path: 'admin',
                data: { allowedRoles: [Role.ADMIN] },
                children: [
                    {
                        path: 'agents',
                        loadChildren: () => import('../../pages/bots/bots.module').then((m) => m.BotsModule),
                    },
                    {
                        path: 'activities',
                        loadChildren: () =>
                            import('../../pages/activities/activities.module').then((m) => m.ActivitiesModule),
                    },
                    {
                        path: 'users',
                        loadChildren: () => import('../../pages/user/user.module').then((m) => m.UserModule),
                    },
                ],
            },
            {
                path: 'test-components',
                data: { allowedRoles: [Role.ADMIN, Role.USER] },
                loadChildren: () => import('../../pages/test-components/test-components.module').then((m) => m.TestComponentsModule),
            },
        ],
    },
];
