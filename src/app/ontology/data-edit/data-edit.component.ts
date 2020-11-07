import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { LocalNotificationService } from 'src/app/services/common/local-notification.service';
import { UtilService } from '../../services/util.service';
import { OntoData } from '../models/onto-data.model';
import { ANALYTICS, MODEL, SOURCE } from '../models/onto-data-types';
import { BaseFormComponent } from '../nestedforms/base-form.component';

@Component({
    selector: 'app-data-edit',
    templateUrl: './data-edit.component.html',
    styleUrls: ['./data-edit.component.scss'],
})
export class DataEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('modalForm') modalForm;
    form: FormGroup;
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

        this.form = this.fb.group({
            url: [this.data.url, Validators.required],
            endpoint: [this.data.endpoint, Validators.required],
            description: [this.data.description, Validators.required],
            source: [this.data.source],
            model: [this.data.model],
            analytics: [this.data.analytics],
            addresses: this.fb.array([this.initAddress()]),

            notes: new FormArray([]),
        });
    }

    ngOnInit(): void {}

    initAddress() {
        // initialize our address
        return this.fb.group({
            street: ['', Validators.required],
            postcode: [''],
        });
    }

    addAddress() {
        // add address to the list
        const control = <FormArray>this.form.controls['addresses'];
        control.push(this.initAddress());
    }

    removeAddress(i: number) {
        // remove address from the list
        const control = <FormArray>this.form.controls['addresses'];
        control.removeAt(i);
    }

    save() {
        this.form.updateValueAndValidity();

        if (!this.form.valid) {
            this.utilService.getFormValidationErrors(this.form);
            this.localNotificationService.error({ message: 'You must complete the required fields.' });
            return;
        }
        const result = this.form.value;
        result.id = this.data.id;
        this.matDialogRef.close(result);
    }

    close() {
        this.matDialogRef.close();
    }
}
