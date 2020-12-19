import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { LocalNotificationService } from '../../services/common/local-notification.service';
import { UtilService } from '../../services/util.service';
import { Keywords, keywordsArrayToObject, KeywordsMapped, keywordsObjectToArray, OntoData, } from '../../models/ontology/onto-data.model';
import { ANALYTICS, DATA_TYPE, MODEL, SOURCE } from '../../models/ontology/onto-data-types';
import { BaseFormComponent } from '../../components/forms/base-form.component';

@Component({
    selector: 'app-data-edit',
    templateUrl: './data-edit.component.html',
    styleUrls: ['./data-edit.component.scss'],
})
export class DataEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('modalForm') modalForm: any;

    formGroup!: FormGroup;
    dialogType: 'edit' | 'new';
    data: OntoData;
    public dataTypes: string[] = [];

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<DataEditComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService
    ) {
        super();
        this.dialogType = data.dialogType;
        this.data = { ...data.data };
        this.data.keywords = keywordsObjectToArray(this.data.keywords as Keywords);
        this.dataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            urlCode: new FormControl('', [Validators.required]),
            endpoint: new FormControl('', [Validators.required]),
            dataType: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            keywords: new FormArray([], [Validators.required]),
            queryParams: new FormArray([]),
        });

        console.log('DataEditComponent:ngOnInit: data = ', this.data);

        this.setFormValues(this.data);
    }

    public addKeywords() {
        const keywords = this.formGroup.get('keywords') as FormArray;
        keywords.push(new FormGroup({}));
    }

    public addQueryparams() {
        const queryParams = this.formGroup.get('queryParams') as FormArray;
        queryParams.push(new FormGroup({}));
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
        result.keywords = keywordsArrayToObject(result.keywords as KeywordsMapped[]);
        this.matDialogRef.close(result);
    }

    public close() {
        this.matDialogRef.close();
    }
}
