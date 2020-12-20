import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { LocalNotificationService } from '../../services/common/local-notification.service';
import { UtilService } from '../../services/util.service';
import { ANALYTICS, MODEL, SOURCE } from '../../models/ontology/onto-data-types';
import { BaseFormComponent } from '../../components/forms/base-form.component';
import { OntoPage, PUBLISH_TYPE } from '../../models/ontology/onto-page.model';

@Component({
    selector: 'app-page-edit',
    templateUrl: './page-edit.component.html',
    styleUrls: ['./page-edit.component.scss'],
})
export class PageEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('modalForm') modalForm!: any;
    formGroup!: FormGroup;
    dialogType: string; // dialog type: edit or new
    data: OntoPage;
    public publishTypes: string[] = [];

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<PageEditComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService,
    ) {
        super();

        console.log('PageEditComponent: data = ', data);
        this.dialogType = data.dialogType;
        this.data = { ...data.data };
        this.publishTypes = (Object.keys(PUBLISH_TYPE) as Array<keyof typeof PUBLISH_TYPE>).map((k) => PUBLISH_TYPE[k]);
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            publishType: new FormControl('', [Validators.required]),
            nrows: new FormControl(null, [Validators.required, Validators.min(1)]),
            bindings: new FormArray([]),
        });

        console.log('PageEditComponent: data = ', this.data);
        this.setFormValues(this.data);
        // console.log( 'PageEditComponent: control values = ', this.formGroup.controls['title'].value, this.formGroup.controls['nrows'].value, this.formGroup.controls['bindVis'].value, );
    }

    onClickBindVis() {
        // console.log('onClickBindVis: ', this.formGroup.get('bindVis'));
        // console.log('onClickBindVis: ', this.formGroup.controls['bindVis'].value);
        const bindings = this.formGroup.get('bindings') as FormArray;
        bindings.push(new FormGroup({}));
        // console.log('onClickBindVis: value = ', bindVis);
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
        console.log('PageEditComponent: save: value = ', this.formGroup.value);
        this.matDialogRef.close(result);
    }

    close() {
        this.matDialogRef.close();
    }
}