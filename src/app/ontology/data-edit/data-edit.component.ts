import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { LocalNotificationService } from '../../services/common/local-notification.service';
import { UtilService } from '../../services/util.service';
import { OntoData } from '../models/onto-data.model';
import { ANALYTICS, MODEL, SOURCE } from '../models/onto-data-types';
import { BaseFormComponent } from '../../shared/forms/base-form.component';

@Component({
    selector: 'app-data-edit',
    templateUrl: './data-edit.component.html',
    styleUrls: ['./data-edit.component.scss'],
})
export class DataEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('modalForm') modalForm;
    formGroup: FormGroup;
    dialogType = ''; // dialog type: edit or new
    data: OntoData;

    public sources = [];
    public models = [];
    public analytics = [];

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<DataEditComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService,
    ) {
        super();

        console.log('VisEditComponent: data = ', data);
        this.dialogType = data.dialogType;
        this.data = { ...data.data };
        this.sources = Object.keys(SOURCE).map((k) => SOURCE[k]);
        this.models = Object.keys(MODEL).map((k) => MODEL[k]);
        this.analytics = Object.keys(ANALYTICS).map((k) => ANALYTICS[k]);

    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            url: new FormControl('', [Validators.required]),
            endpoint: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            source: new FormControl(''),
            model: new FormControl(''),
            analytics: new FormControl(''),
            queryParams: new FormArray([]),
        });

        console.log(this.data);
        this.setFormValues(this.data);
    }

    addQueryparam() {
        const queryParams = this.formGroup.get('queryParams') as FormArray;
        queryParams.push(new FormGroup({}));
        console.log('addQueryparam: value = ', this.formGroup.value);
    }

    removeQueryparam(index: number) {
        const queryParams = this.formGroup.get('queryParams') as FormArray;
        queryParams.removeAt(index);
        console.log('removeQueryparam: value = ', this.formGroup.value);
    }

    save() {
        this.formGroup.updateValueAndValidity();
        if (!this.formGroup.valid) {
            this.utilService.getFormValidationErrors(this.formGroup);
            this.localNotificationService.error({ message: 'You must complete the required fields.' });
            return;
        }
        const result = this.formGroup.value;
        result.id = this.data.id;
        console.log('save: value = ', this.formGroup.value);
        this.matDialogRef.close(result);
    }

    close() {
        this.matDialogRef.close();
    }
}
