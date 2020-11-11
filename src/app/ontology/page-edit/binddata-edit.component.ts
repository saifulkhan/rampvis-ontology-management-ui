import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';

import { BaseNestedform } from '../../shared/forms/base.nestedform';
import { OntologyService } from '../ontology.service';
import { OntoData } from '../models/onto-data.model';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-binddata-edit',
    templateUrl: './binddata-edit.component.html',
    styleUrls: ['./binddata-edit.component.scss'],
})
export class BindDataEditComponent extends BaseNestedform {
    dataIds: string[] = [];

    // Control for the MatSelect filter keyword.
    public dataIdFilterCtrl: FormControl = new FormControl();
    // List of OntoVis filtered by search keyword for multi-selection.
    public filteredDataId: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    // Subject that emits when the component has been destroyed.
    private _onDestroy = new Subject<void>();

    constructor(private ontologyService: OntologyService) {
        super();

        this.nestedFormGroup = new FormGroup({
            dataId: new FormControl('', [Validators.required]),
            queryParams: new FormArray([]),
        });

        this.loadDataList();
    }

    private loadDataList() {
        this.ontologyService.getAllData().subscribe((res: OntoData[]) => {
            if (res) {
                this.dataIds = res.map((d) => d.id);
                console.log('BindDataEditComponent: loadDataList: dataIds = ', this.dataIds);

                // load the initial dataIds list
                this.filteredDataId.next(this.dataIds.slice());
                // listen for search field value changes
                this.dataIdFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                    this.filterDataIds();
                });

                this.setInitialValue();
            }
        });
    }

    /**
     * Sets the initial value after the filteredDataIds are loaded initially
     */
    protected setInitialValue() {
        this.filteredDataId.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredDataIds are loaded initially
            // and after the mat-option elements are available
            this.singleSelect.compareWith = (a: string, b: string) => a && b && a === b;
        });
    }

    protected filterDataIds() {
        if (!this.dataIds) {
            return;
        }
        // get the search keyword
        let search = this.dataIdFilterCtrl.value;

        // console.log('filterDataIds:',search, this.dataIds.filter((visIs) => visIs.toLowerCase().indexOf(search) > -1), );
        
        if (!search) {
            this.filteredDataId.next(this.dataIds.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the dataIds
        this.filteredDataId.next(this.dataIds.filter((visId) => visId.toLowerCase().indexOf(search) > -1));
    }

    onClickBindQueryParams() {
        console.log('onClickBindQueryParams: ', this.formGroup.get('queryParams'));
        console.log('onClickBindQueryParams: ', this.formGroup.controls['queryParams'].value);

        const ctl = this.formGroup.get('queryParams') as FormArray;
        ctl.push(new FormGroup({}));
        console.log('onClickBindQueryParams: value = ', ctl);
    }
}
