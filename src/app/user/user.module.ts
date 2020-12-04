import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

import { UsersRoutes } from './user.routing';
import { UserService } from './user.service';
import { UserListComponent } from './list/user-list.component';
import { DirectivesModule } from '../directives/directives.module';
import { UserInfoComponent } from './info/user-info.component';
import { UserDetailsComponent } from './details/user-details.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    UserListComponent,
    UserInfoComponent,
    UserDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UsersRoutes),
    FormsModule,
    MaterialModule,
    DirectivesModule,
		MatFormFieldModule,
		ReactiveFormsModule
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }





