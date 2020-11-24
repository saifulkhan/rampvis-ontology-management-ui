import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { LocalNotificationService } from 'src/app/services/common/local-notification.service';
import { UtilService } from '../../services/util.service';
import { OntoVis } from '../../models/ontology/onto-vis.model';
import { VIS_TYPE } from '../../models/ontology/onto-vis-type.enum';

@Component({
    selector: 'app-vis-edit',
    templateUrl: './vis-edit.component.html',
    styleUrls: ['./vis-edit.component.scss'],
})
export class VisEditComponent implements OnInit {
    @ViewChild('modalForm') modalForm!: any;
    form: FormGroup;
    dialogType = ''; // dialog type: edit or new
    vis: OntoVis;
    public types: string[] = [];

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<VisEditComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService,
    ) {
        console.log('VisEditComponent: data = ', data);
        this.dialogType = data.dialogType;
        this.vis = { ...data.vis };
        this.types = (Object.keys(VIS_TYPE) as Array<keyof typeof VIS_TYPE>).map((k) => VIS_TYPE[k]);

        this.form = this.fb.group({
            function: [this.vis.function, Validators.required],
            type: [this.vis.type, Validators.required],
            description: [this.vis.description, Validators.required],
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
		result.id = this.vis.id;
        this.matDialogRef.close(result);
    }

    close() {
        this.matDialogRef.close();
    }
}
