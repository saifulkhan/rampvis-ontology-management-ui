import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { LocalNotificationService } from '../../../services/local-notification.service';
import { UtilService } from '../../../services/util.service';
import { OntoVis } from '../../../models/ontology/onto-vis.model';
import { VIS_TYPE } from '../../../models/ontology/onto-vis-type.enum';
import { DATA_TYPE } from '../../../models/ontology/onto-data-types';

@Component({
    selector: 'app-onto-vis-edit',
    templateUrl: './onto-vis-edit.component.html',
    styleUrls: ['./onto-vis-edit.component.scss'],
})
export class OntoVisEditComponent implements OnInit {
    @ViewChild('modalForm') modalForm!: any;
    form: FormGroup;
    dialogType: string; // dialog type: edit or new
    ontoVis: OntoVis;
    public visTypes: string[];
    public dataTypesAll: string[];

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<OntoVisEditComponent>,
        @Inject(MAT_DIALOG_DATA) dialogData: any,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService,
    ) {
        console.log('OntoVisEditComponent: data = ', dialogData);
        this.dialogType = dialogData.dialogType;
        this.ontoVis = { ...dialogData.ontoVis };
        this.visTypes = (Object.keys(VIS_TYPE) as Array<keyof typeof VIS_TYPE>).map((k) => VIS_TYPE[k]);
        this.dataTypesAll = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((k) => DATA_TYPE[k]);

        this.form = this.fb.group({
            function: [this.ontoVis.function, Validators.required],
            type: [this.ontoVis.type, Validators.required],
            dataTypes: [this.ontoVis.dataTypes, Validators.required],
            description: [this.ontoVis.description, Validators.required],
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
		result.id = this.ontoVis.id;
        this.matDialogRef.close(result);
    }

    close() {
        this.matDialogRef.close();
    }
}
