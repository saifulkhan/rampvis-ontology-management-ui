import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { LocalNotificationService } from '../../../services/common/local-notification.service';
import { UtilService } from '../../../services/util.service';
import { BaseFormComponent } from '../../forms/base-form.component';
import { OntoPage } from '../../../models/ontology/onto-page.model';
import { BINDING_TYPE } from '../../../models/ontology/binding-type.enum';

@Component({
    selector: 'app-onto-page-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
})
export class OntoPageEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('modalForm') modalForm!: any;
    formGroup!: FormGroup;
    dialogType: string; // dialog type: edit or new
    data: OntoPage;
    public publishTypes: string[] = [];

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<OntoPageEditComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService
    ) {
        super();

        console.log('PageEditComponent: data = ', data);
        this.dialogType = data.dialogType;
        this.data = { ...data.data };
        this.publishTypes = (Object.keys(BINDING_TYPE) as Array<keyof typeof BINDING_TYPE>).map((k) => BINDING_TYPE[k]);
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            bindingType: new FormControl('', [Validators.required]),
            nrows: new FormControl(1, [Validators.required, Validators.min(1)]),
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
