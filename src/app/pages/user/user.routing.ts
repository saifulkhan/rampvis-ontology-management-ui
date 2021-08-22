import { Routes } from '@angular/router';
import { UserListComponent } from './list/user-list.component';
import { UserDetailsComponent } from './details/user-details.component';

export const UsersRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: UserListComponent },
      { path: ':id_user', component: UserDetailsComponent },
    ]
  }
];
