import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { LocalNotificationService } from '../../services/common/local-notification.service';
import { DialogService } from '../../services/common/dialog.service';
import { TableData } from '../../models/table.data.interface';
import { JQ_TOKEN } from '../../services/common/jQuery.service';
import { UserService } from '../user.service';
import { User } from '../../models/user.model';
import { Permissions } from '../../models/permissions';
import { Role } from '../../models/role.enum';
import { UserInfoComponent } from '../info/user-info.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['user-list.component.scss'],
})
export class UserListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    usersTable: TableData = {
        headerRow: ['name', 'email', 'createdAt', 'expireOn', 'role', 'actions'],
        dataRows: [],
    };
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    users: Array<User> = new Array<User>();
    user: User = new User();
    userType!: Role;
    permissions = Permissions;

    constructor(
        private usersService: UserService,
        private localNotificationService: LocalNotificationService,
        private dialogService: DialogService,
        @Inject(JQ_TOKEN) private $: any,
        private matDialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.loadUsers(this.userType);
    }

    loadUsers(type: Role) {
        this.usersService.getUsers(type).subscribe((res) => {
            this.users = res;
            this.setDataTable(this.users);
        });
    }

    createUser(): void {
        this.user.role = this.userType;
        const dialogOpt = {
            data: {
                assetType: 'new',
                user: this.user,
            },
            width: '40%',
        };
        const dialogRef = this.matDialog.open(UserInfoComponent, dialogOpt);
        dialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (response: User | undefined): Observable<User | false> => {
                        if (!response) {
                            return of(false);
                        }
                        return this.usersService.createUser(response);
                    },
                ),
            )
            .subscribe((res: User | false) => {
                if (!res) {
                    return;
                }
                this.loadUsers(this.userType);
                this.user = new User();
                this.localNotificationService.success({ message: 'User successfully created' });
            });
    }

    public editUser(user: User): void {
        const dialogOpt = {
            data: {
                assetType: 'edit',
                user,
            },
            width: '40%',
        };
        const dialogRef = this.matDialog.open(UserInfoComponent, dialogOpt);
        dialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (response: User | undefined): Observable<User | false> => {
                        if (!response) {
                            return of(false);
                        }
                        return this.usersService.updateUser(response);
                    },
                ),
            )
            .subscribe((res: User | false) => {
                if (!res) {
                    return;
                }
                this.loadUsers(this.userType);
                this.user = new User();
                this.localNotificationService.success({ message: 'User successfully updated' });
            });
    }

    enableOrDisableUser(user: User): void {
        let state: string;
        if (user.deleted) {
            state = 'Enable';
        } else {
            state = 'Disable';
        }

        let title = `${state} User`;
        let text = `Are you sure you want to ${state.toLocaleLowerCase()} this user ?`;

        this.dialogService.warn(title, text, state).then((result) => {
            if (result.value) {
                this.usersService.enableOrDisableUser(user.id).subscribe((res) => {
                    this.localNotificationService.success({ message: `User successfully ${state.toLocaleLowerCase()}d` });
                    user.deleted = res.deleted;
                });
            }
        });
    }

    onSearchUsers(searchText: string) {
        this.dataSource.filter = searchText.trim().toLocaleLowerCase();
    }

    setDataTable(data: Array<User>): void {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }
}
