import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { LocalNotificationService } from 'src/app/services/common/local-notification.service';
import { SOURCE_TYPE } from '../../shared/models/sourceType.enum';
import { Source } from '../../shared/models/source.model';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'app-source-edit',
    templateUrl: './source-edit.component.html',
    styleUrls: ['./source-edit.component.scss'],
})
export class SourceEditComponent implements OnInit {
    @ViewChild('modalForm') modalForm;
    form: FormGroup;
    dialogType = ''; // dialog type: edit or new
    source: Source;

    public types = [];
    public selectedType = 'Facebook';

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<SourceEditComponent>,
        @Inject(MAT_DIALOG_DATA) data, // { name, title, url, type, login, pass, updatedOn },
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService,
    ) {
        console.log('SourceEditComponent: data = ', data);

        this.dialogType = data.dialogType;
        this.source = { ...data.source };

        this.types = Object.keys(SOURCE_TYPE).map((k) => SOURCE_TYPE[k]);
        const urlPattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

        this.form = this.fb.group({
            title: [this.source.title, Validators.required],
            url: [this.source.url, [Validators.required, Validators.pattern(urlPattern)]],
            type: [this.source.type, Validators.required],
            login: [this.source.login],
            pass: [this.source.pass],
            updatedOn: new Date(),
        });
    }

    ngOnInit(): void {}

    save() {
        this.form.updateValueAndValidity();

        if (!this.form.valid) {
            this.utilService.getFormValidationErrors(this.form);
            this.localNotificationService.error({ message: 'You must complete the required fields.' });
            return;
        }
		const result = this.form.value;
		result.id = this.source.id;
        this.matDialogRef.close(result);
    }

    close() {
        this.matDialogRef.close();
    }
}
