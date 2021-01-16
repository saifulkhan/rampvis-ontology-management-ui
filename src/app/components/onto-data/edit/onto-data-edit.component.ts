import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { LocalNotificationService } from '../../../services/common/local-notification.service';
import { UtilService } from '../../../services/util.service';
import { OntoData } from '../../../models/ontology/onto-data.model';
import { DATA_TYPE } from '../../../models/ontology/onto-data-types';
import { BaseFormComponent } from '../../forms/base-form.component';

@Component({
    selector: 'app-onto-data-edit',
    templateUrl: './onto-data-edit.component.html',
    styleUrls: ['./onto-data-edit.component.scss'],
})
export class OntoDataEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('modalForm') modalForm: any;

    formGroup!: FormGroup;
    dialogType: 'edit' | 'new';
    data: OntoData;
    public dataTypes: string[] = [];

    // chips related
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<OntoDataEditComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService
    ) {
        super();
        this.dialogType = data.dialogType;
        this.data = { ...data.data };
        this.dataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            urlCode: new FormControl('', [Validators.required]),
            endpoint: new FormControl('', [Validators.required]),
            dataType: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            keywords: new FormControl([], [Validators.required]),
        });

        this.setFormValues(this.data);
    }

    // Remove keywords chip
    remove(k: any): void {
        const index = this.formGroup.get('keywords')?.value.indexOf(k);
        if (index >= 0) this.formGroup.get('keywords')?.value.splice(index, 1);
        this.formGroup.get('keywords')?.updateValueAndValidity();
    }

    // Add keywords chip
    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // add
        if ((value || '').trim()) this.formGroup.get('keywords')?.value.push(value.trim());
        // reset the input value
        if (input) input.value = '';

        this.formGroup.get('keywords')?.updateValueAndValidity();
    }

    public save() {
        this.formGroup.updateValueAndValidity();
        if (!this.formGroup.valid) {
            this.utilService.getFormValidationErrors(this.formGroup);
            this.localNotificationService.error({ message: 'You must complete the required fields.' });
            return;
        }

        const result: OntoData = this.formGroup.value;
        result.id = this.data.id;
        this.matDialogRef.close(result);
    }

    public close() {
        this.matDialogRef.close();
    }
}
