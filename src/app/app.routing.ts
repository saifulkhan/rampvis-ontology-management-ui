import { Routes } from '@angular/router';

import { NotFoundComponent } from './errors/404';
import { AnonymousGuard } from './guards/anonymous.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { Role } from './shared/models/role.enum';
import { LoginComponent } from './pages/login/login.component';
import { PublicLayoutComponent } from './layouts/public/public-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        canActivate: [AuthorizationGuard],
        canActivateChild: [AuthorizationGuard],
        data: {
            allowedRoles: [Role.ADMIN, Role.USER],
        },
        children: [
            {
                path: '',
                loadChildren: () => import('./layouts/private/private-layout.module').then((m) => m.PrivateLayoutModule),
            },
        ],
    },
    {
        path: '',
        component: LoginComponent, // TODO! Debug as it should use PublicLayoutComponent
        canActivate: [AnonymousGuard] /* to make sure if authenticated it takes user to dashboard instead of login page */,
        canActivateChild: [AnonymousGuard] /* to make sure if authenticated it takes user to dashboard/some_path instead of login page */,
        children: [
            {
                path: 'login',
                loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
            },
        ],
    },
    { path: '**', component: NotFoundComponent },
];
