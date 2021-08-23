import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalNotificationService } from '../../../services/local-notification.service';
import { UtilService } from '../../../services/util.service';
import { OntoPage, OntoPageExt } from '../../../models/ontology/onto-page.model';
import { PAGE_TYPE } from '../../../models/ontology/page-type.enum';
import { OntoData } from '../../../models/ontology/onto-data.model';
import { OntoVis } from '../../../models/ontology/onto-vis.model';
import { OntoVisService } from '../../../services/ontology/onto-vis.service';
import { OntoDataService } from '../../../services/ontology/onto-data.service';
import { OntoPageService } from '../../../services/ontology/onto-page.service';
import { OntoPageFilterVm } from '../../../models/ontology/onto-page-filter.vm';

@Component({
    selector: 'app-onto-page-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
})
export class OntoPageEditComponent implements OnInit {
    @ViewChild('modalForm') modalForm!: any;
    formGroup!: FormGroup;
    dialogType: string; // dialog type: edit or new
    ontoPageExt: OntoPageExt;
    public pageTypes: string[] = [];

    ontoVis$!: Observable<OntoVis[]>;
    ontoData$!: Observable<OntoData[]>;
    ontoPages$!: Observable<OntoPage[]>;

    constructor(
        private fb: FormBuilder,
        public matDialogRef: MatDialogRef<OntoPageEditComponent>,
        @Inject(MAT_DIALOG_DATA) dialogData: any,
        private localNotificationService: LocalNotificationService,
        private utilService: UtilService,
        private ontoVisService: OntoVisService,
        private ontoDataService: OntoDataService,
        private ontoPageService: OntoPageService
    ) {

        console.log('PageEditComponent: dialogData = ', dialogData);
        this.dialogType = dialogData.dialogType;
        this.ontoPageExt = { ...dialogData.ontoPageExt };
        this.pageTypes = (Object.keys(PAGE_TYPE) as Array<keyof typeof PAGE_TYPE>).map((k) => PAGE_TYPE[k]);
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            pageType: new FormControl(this.ontoPageExt.pageType, [Validators.required]),
            visId: new FormControl(this.ontoPageExt.visId, [Validators.required]),
            dataIds: new FormControl(this.ontoPageExt.dataIds, [Validators.required]),
            pageIds: new FormControl(this.ontoPageExt.pageIds, []),
        });

        this.ontoVis$ = this.ontoVisService.getAllVis();
        this.ontoData$ = this.ontoDataService
            .getAllData1()
            .pipe(map((d: any) => d.data));

        this.ontoPages$ = this.ontoPageService
            .getAllPages(PAGE_TYPE.EXAMPLE)
            .pipe(
                map((d: any) => {
                    return d.data.map((ontoPageExt: OntoPageExt) => {
                        console.log(ontoPageExt);
                        return { ...ontoPageExt, name: `${ontoPageExt.vis.function} + [${ontoPageExt.data[0].endpoint}, ...${ontoPageExt.data.length - 1}]` };
                    });
                })
            );

        // console.log( 'PageEditComponent: control values = ', this.formGroup.controls['title'].value, this.formGroup.controls['nrows'].value, this.formGroup.controls['bindVis'].value, );
    }

    save() {
        this.formGroup.updateValueAndValidity();
        if (!this.formGroup.valid) {
            this.utilService.getFormValidationErrors(this.formGroup);
            this.localNotificationService.error({ message: 'You must complete the required fields.' });
            return;
        }
        const result = this.formGroup.value;
        result.id = this.ontoPageExt.id;
        console.log('PageEditComponent: save: value = ', this.formGroup.value);
        this.matDialogRef.close(result);
    }

    close() {
        this.matDialogRef.close();
    }
}
