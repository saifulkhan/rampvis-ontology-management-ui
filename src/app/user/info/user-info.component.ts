import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UserModalData } from '../../models/modal-data.interface';
import { UtilService } from '../../services/util.service';
import { LocalNotificationService } from '../../services/common/local-notification.service';
import { UserService } from '../user.service';
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
    @ViewChild('modalForm') modalForm: any;
    form!: FormGroup;

    type!: string; // dialog type: edit or new
    user!: User;
    newPassword!: string;
    roles: Array<string> = [];

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<UserInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserModalData,
        private utils: UtilService,
        private localNotificationService: LocalNotificationService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.user = this.utils.deepCopy(this.data.user);
        this.type = this.data.assetType;
        this.roles = this.userService.getInternalUserRoles();
        const isEditMode = this.type === 'edit';

        this.form = this.fb.group({
            name: [{ value: this.user.name, disabled: isEditMode }, Validators.required],
            email: [{ value: this.user.email, disabled: isEditMode }, [Validators.required, Validators.email]],
            password: isEditMode ? [this.user.password] : [this.user.password, Validators.required],
            role: isEditMode ? [this.user.role, Validators.required] : [this.user.role],
        });
    }

    public submit(): void {
        this.form.updateValueAndValidity();

        if (!this.form.valid) {
            this.utils.getFormValidationErrors(this.form);
            this.localNotificationService.warning({ message: 'Please provide a dialogType, email, password and phone number for the user' });
            return;
        }

        const result: User = this.form.value;
        result.id = this.data.user.id;

        this.matDialogRef.close(result);
    }

    close() {
        this.matDialogRef.close();
    }
}
