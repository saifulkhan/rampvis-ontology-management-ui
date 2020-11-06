import { Routes } from '@angular/router';

import { PrivateLayoutComponent } from './private-layout.component';
import { Role } from '../../shared/models/role.enum';

export const PrivateLayoutRoutes: Routes = [
	{
		path: '',
		component: PrivateLayoutComponent,
		children: [
			// add all pages for authenticated user navigation
			{
				path: 'dashboard',
				data: { allowedRoles: [Role.ADMIN, Role.USER] },
				loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'experimental-dashboard',
				data: { allowedRoles: [Role.ADMIN] },
				loadChildren: () => import('../../experimental-dashboard/experimental-dashboard.module').then(m => m.ExperimentalDashboardModule)
			},
			{
				path: 'collection',
				data: {
					allowedRoles: [Role.ADMIN, Role.USER]
				},
				loadChildren: () => import('../../scraper/scraper.module').then(m => m.ScraperModule)
			},
			{
				path: 'search',
				data: {
					allowedRoles: [Role.ADMIN, Role.USER]
				},
				loadChildren: () => import('../../search/search.module').then(m => m.SearchModule)
			},
			{
				path: 'admin',
				data: { allowedRoles: [Role.ADMIN] },
				children: [
					{
						path: 'bots',
						loadChildren: () => import('../../bots/bots.module').then(m => m.BotsModule)
					},
					{
						path: 'activities',
						loadChildren: () => import('../../activities/activities.module').then(m => m.ActivitiesModule)
					},
					{
						path: 'users',
						loadChildren: () => import('../../user/user.module').then(m => m.UserModule)
					},
				]
			},
		]
	}
];
