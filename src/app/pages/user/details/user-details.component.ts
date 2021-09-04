import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { flatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { UserService } from '../user.service';
import { User } from '../../../models/user.model';
import { Permissions } from '../../../models/permissions';
import { UserInfoComponent } from '../info/user-info.component';
import { LocalNotificationService } from '../../../services/local-notification.service';

@Component({
	selector: 'app-user-details',
	templateUrl: './user-details.component.html',
	styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
	user: User = new User();
	userClone: User = new User();
	permissions = Permissions;
	isExternalUser!: boolean;

	constructor(
		private userService: UserService,
		private route: ActivatedRoute,
		private matDialog: MatDialog,
		private localNotificationService: LocalNotificationService
	) {
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
            this.userService.getUser(params['id_user']).subscribe(res => {
                this.user = res;
                this.isExternalUser = false;
            });
		});
	}

	public editUser(user: User): void {
		const dialogOpt = {
			data: {
				assetType: 'edit',
				user
			},
			width: '40%'
		};
		const dialogRef = this.matDialog.open(UserInfoComponent, dialogOpt);
		dialogRef.afterClosed()
			.pipe(flatMap((response: User | undefined): Observable<User | false> => {
				if (!response) {
					return of(false);
				}
				return this.userService.updateUser(response);
			}))
			.subscribe((res: User | false) => {
				if (!res) {
					return;
				}
				this.user = res;
				this.localNotificationService.success({ message: 'User successfully updated' });
			});
	}

}
