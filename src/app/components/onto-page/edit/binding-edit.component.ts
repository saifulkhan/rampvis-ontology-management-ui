import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import { BaseNestedform } from '../../forms/base.nestedform';
import { OntoVis } from '../../../models/ontology/onto-vis.model';
import { OntoVisService } from '../../../services/ontology/onto-vis.service';
import { OntoData } from '../../../models/ontology/onto-data.model';
import { OntoDataService } from '../../../services/ontology/onto-data.service';
import { OntoPageService } from '../../../services/ontology/onto-page.service';
import { OntoPage } from '../../../models/ontology/onto-page.model';
import { BINDING_TYPE } from '../../../models/ontology/binding-type.enum';
import { OntoPageFilterVm } from '../../../models/ontology/onto-page-filter.vm';

@Component({
    selector: 'app-binding-edit',
    templateUrl: './binding-edit.component.html',
    styleUrls: ['./binding-edit.component.scss'],
})
export class BindingEditComponent extends BaseNestedform {
    ontoVis$!: Observable<OntoVis[]>;
    ontoData$!: Observable<OntoData[]>;
    ontoPages$!: Observable<OntoPage[]>;

    constructor(
        private ontoVisService: OntoVisService,
        private ontoDataService: OntoDataService,
        private ontoPageService: OntoPageService
    ) {
        super();

        this.nestedFormGroup = new FormGroup({
            visId: new FormControl(null, [Validators.required]),
            dataIds: new FormControl([], [Validators.required]),
            pageIds: new FormControl([], []),
        });

        this.ontoVis$ = this.ontoVisService.getAllVis();
        this.ontoData$ = this.ontoDataService.getAllData1().pipe(map((d: any) => d.data));
        this.ontoPages$ = this.ontoPageService
            .getAllPages({ bindingType: BINDING_TYPE.EXAMPLE } as OntoPageFilterVm)
            .pipe(map((d: any) => d.data));
    }

    ngAfterViewInit() {}

    ngOnDestroy() {}

    // public onClickBindData() {
    //     // console.log('onClickBindData: ', this.formGroup.get('bindData'), this.formGroup.controls['bindData'].value);
    //     const bindDataG = this.formGroup.get('bindData') as FormArray;
    //     bindDataG.push(new FormGroup({}));
    //     // console.log('onClickBindData: value = ', bindDataG);
    // }
}
