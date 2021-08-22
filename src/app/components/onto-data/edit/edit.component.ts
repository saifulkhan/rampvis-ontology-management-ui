import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { LocalNotificationService } from '../../../services/local-notification.service';
import { UtilService } from '../../../services/util.service';
import { OntoData } from '../../../models/ontology/onto-data.model';
import { DATA_TYPE } from '../../../models/ontology/onto-data-types';
import { DataStreamKeywordsToDropdown } from '../../../services/ontology/data-stream-keywords.service';

@Component({
    selector: 'app-onto-data-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
})
export class OntoDataEditComponent implements OnInit {
    @ViewChild('modalForm') modalForm: any;

    formGroup!: FormGroup;
    dialogType: 'edit' | 'new';
    ontoData: OntoData;
    public dataTypes: string[] = [];
    public keywords: string[] = [];

    // chips related
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    // Multi-level selection of keywords
    grpKeywords = DataStreamKeywordsToDropdown();

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<OntoDataEditComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService
    ) {
        this.dialogType = data.dialogType;
        this.ontoData = { ...data.data };
        this.dataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            urlCode: new FormControl(this.ontoData.urlCode, [Validators.required]),
            endpoint: new FormControl(this.ontoData.endpoint, [Validators.required]),
            dataType: new FormControl(this.ontoData.dataType, [Validators.required]),
            description: new FormControl(this.ontoData.description, [Validators.required]),
            keywords: new FormControl(this.ontoData.keywords, [Validators.required]),
        });
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
        result.id = this.ontoData.id;
        this.matDialogRef.close(result);
    }

    public close() {
        this.matDialogRef.close();
    }
}
