import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import { BaseNestedform } from '../../components/forms/base.nestedform';
import { OntoVis } from '../../models/ontology/onto-vis.model';
import { OntoVisService } from '../../services/ontology/onto-vis.service';
import { OntoData } from '../../models/ontology/onto-data.model';
import { OntoDataService } from '../../services/ontology/onto-data.service';
import { OntoDataFilterVm } from '../../models/ontology/onto-data-filter.vm';

@Component({
    selector: 'app-binding-edit',
    templateUrl: './binding-edit.component.html',
    styleUrls: ['./binding-edit.component.scss'],
})
export class BindingEditComponent extends BaseNestedform {
    ontoVisList: OntoVis[] = [];
    public visList$: ReplaySubject<OntoVis[]> = new ReplaySubject<OntoVis[]>(1);

    public visIdFilterCtrl: FormControl = new FormControl(); // Control for the MatSelect filter keyword.
    public filteredVisId: ReplaySubject<OntoVis[]> = new ReplaySubject<OntoVis[]>(1); // List of OntoVis filtered by search keyword for multi-selection.
    @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
    private _onDestroy = new Subject<void>(); // Subject that emits when the component has been destroyed.

    ontoDataList: OntoData[] = [];
    public dataIdFilterCtrl: FormControl = new FormControl(); // Control for the MatSelect filter keyword.
    public filteredDataIds: ReplaySubject<OntoData[]> = new ReplaySubject<OntoData[]>(1); // List of OntoVis filtered by search keyword for multi-selection.
    @ViewChild('multiSelect', { static: true }) multiSelect!: MatSelect;

    constructor(private ontoVisService: OntoVisService, private ontoDataService: OntoDataService) {
        super();

        this.nestedFormGroup = new FormGroup({
            visId: new FormControl('', [Validators.required]),
            dataIds: new FormControl('', [Validators.required]),
        });

        this.loadDataList();
        this.loadVisList();
    }

    ngAfterViewInit() {}

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    private loadVisList() {
        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.ontoVisList = res;
                console.log('BindingEditComponent: loadVisList: ontoVisList = ', this.ontoVisList);

                // load the initial visIds list
                this.filteredVisId.next(this.ontoVisList.slice());
                // listen for search field value changes
                this.visIdFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                    this.filterVisIds();
                });

                this.visList$.next(res.slice());

                this.setInitialVisValue();
            }
        });
    }

    // Sets the initial value after the filteredVisIds are loaded initially
    protected setInitialVisValue() {
        this.filteredVisId.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredVisIds are loaded initially
            // and after the mat-option elements are available
            this.singleSelect.compareWith = (a: OntoVis, b: OntoVis) => a && b && a === b;
        });
    }

    protected filterVisIds() {
        if (!this.ontoVisList) {
            return;
        }
        // get the search keyword
        let search = this.visIdFilterCtrl.value;
        if (!search) {
            this.filteredVisId.next(this.ontoVisList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the visIds
        // console.log('search = ', search, ', filter = ', this.ontoVisList.filter((visId) => visId.function.toLowerCase().indexOf(search) > -1));
        this.filteredVisId.next(this.ontoVisList.filter((visId) => visId.function.toLowerCase().indexOf(search) > -1));
    }

    private loadDataList() {
        this.ontoDataService.getAllData1().subscribe((res: any) => {
            if (res) {
                this.ontoDataList = res.data;
                console.log('BindVisEditComponent: loadDataList: dataIds = ', this.ontoDataList);

                // load the initial dataIds list
                this.filteredDataIds.next(this.ontoDataList.slice());
                // listen for search field value changes
                this.dataIdFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                    this.filterDataIds();
                });

                this.setInitialDataValue();
            }
        });
    }

    // Sets the initial value after the filteredDataIds are loaded initially
    protected setInitialDataValue() {
        this.filteredDataIds.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredDataIds are loaded initially
            // and after the mat-option elements are available
            this.singleSelect.compareWith = (a: OntoData, b: OntoData) => a && b && a === b;
        });
    }

    protected filterDataIds() {
        if (!this.ontoDataList) {
            return;
        }
        // get the search keyword
        let search = this.dataIdFilterCtrl.value;

        console.log('BindVisEditComponent: filterDataIds: search = ', search);

        if (!search) {
            this.filteredDataIds.next(this.ontoDataList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the dataIds
        // console.log('filterDataIds:',search, this.dataIds.filter((visIs) => visIs.toLowerCase().indexOf(search) > -1), );
        this.filteredDataIds.next(
            this.ontoDataList.filter((ontoData) => ontoData.endpoint.toLowerCase().indexOf(search) > -1)
        );
    }

    public onClickBindData() {
        // console.log('onClickBindData: ', this.formGroup.get('bindData'));
        // console.log('onClickBindData: ', this.formGroup.controls['bindData'].value);
        const bindDataG = this.formGroup.get('bindData') as FormArray;
        bindDataG.push(new FormGroup({}));
        // console.log('onClickBindData: value = ', bindDataG);
    }
}
