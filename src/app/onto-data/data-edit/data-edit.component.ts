import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { LocalNotificationService } from '../../services/common/local-notification.service';
import { UtilService } from '../../services/util.service';
import { OntoData } from '../../models/ontology/onto-data.model';
import { ANALYTICS, DATA_TYPE, MODEL, SOURCE } from '../../models/ontology/onto-data-types';
import { BaseFormComponent } from '../../shared/forms/base-form.component';

@Component({
    selector: 'app-data-edit',
    templateUrl: './data-edit.component.html',
    styleUrls: ['./data-edit.component.scss'],
})
export class DataEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('modalForm') modalForm: any;
 
    formGroup!: FormGroup;
    dialogType = ''; // dialogType: edit or new
    data: OntoData;

    public dataTypes: string[] = [];
    public sources: string[] = [];
    public models: string[] = [];
    public analytics: string[] = [];

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<DataEditComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService,
    ) {
        super();

        console.log('DataEditComponent: data = ', data);
        this.dialogType = data.dialogType;
        this.data = { ...data.data };

        this.dataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);
        this.sources = (Object.keys(SOURCE) as Array<keyof typeof SOURCE>).map((k) => SOURCE[k]);
        this.models = (Object.keys(MODEL) as Array<keyof typeof MODEL>).map((k) => MODEL[k]);
        this.analytics = (Object.keys(ANALYTICS) as Array<keyof typeof ANALYTICS>).map((k) => ANALYTICS[k]);

    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            urlCode: new FormControl('', [Validators.required]),
            endpoint: new FormControl('', [Validators.required]),
            dataType: new FormControl('', [Validators.required]),
            source: new FormControl(),
            model: new FormControl(),
            analytics: new FormControl(),
            description: new FormControl('', [Validators.required]),
            queryParams: new FormArray([]),
        });

        console.log('DataEditComponent: data = ', this.data, 'queryParams = ', this.data.queryParams);
        this.setFormValues(this.data);
    }

    public addQueryparams() {
        const queryParams = this.formGroup.get('queryParams') as FormArray;
        queryParams.push(new FormGroup({}));
        console.log('addQueryparam: value = ', this.formGroup.value);
    }

    public save() {
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

    public close() {
        this.matDialogRef.close();
    }
}
