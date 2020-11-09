import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { LocalNotificationService } from '../../services/common/local-notification.service';
import { UtilService } from '../../services/util.service';
import { OntoData } from '../models/onto-data.model';
import { ANALYTICS, MODEL, SOURCE } from '../models/onto-data-types';
import { BaseFormComponent } from '../../shared/forms/base-form.component';

@Component({
    selector: 'app-page-edit',
    templateUrl: './page-edit.component.html',
    styleUrls: ['./page-edit.component.scss'],
})
export class PageEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('modalForm') modalForm;
    formGroup: FormGroup;
    dialogType = ''; // dialog type: edit or new
    data: OntoData;

    public sources = [];
    public models = [];
    public analytics = [];

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<PageEditComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService,
    ) {
        super();

        console.log('PageEditComponent: data = ', data);
        this.dialogType = data.dialogType;
        this.data = { ...data.data };
        this.sources = Object.keys(SOURCE).map((k) => SOURCE[k]);
        this.models = Object.keys(MODEL).map((k) => MODEL[k]);
        this.analytics = Object.keys(ANALYTICS).map((k) => ANALYTICS[k]);
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            title: new FormControl('', [Validators.required]),
            nrow: new FormControl('', [Validators.required]),
            bindVis: new FormArray([]),
        });

        console.log('PageEditComponent: data = ', this.data);
        this.setFormValues(this.data);

        //console.log('PageEditComponent', this.formGroup.value)
        console.log(
            'PageEditComponent: control values = ',
            this.formGroup.controls['title'].value,
            this.formGroup.controls['nrow'].value,
            this.formGroup.controls['bindVis'].value,
        );
    }

    onClickBindVis() {
        console.log('onClickBindVis: ', this.formGroup.get('bindVis'));
        console.log('onClickBindVis: ', this.formGroup.controls['bindVis'].value);

        const bindVis = this.formGroup.get('bindVis') as FormArray;
        bindVis.push(new FormGroup({}));

        console.log('onClickBindVis: value = ', bindVis);
    }

    //
    //
    //

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
