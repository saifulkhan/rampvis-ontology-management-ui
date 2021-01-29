import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { of, ReplaySubject } from 'rxjs';

import { CustomSingleSelectionData } from '../components/custom-single-selection/custom-single-selection.component';
import { OntoVis } from '../models/ontology/onto-vis.model';
import { DialogService } from '../services/common/dialog.service';
import { OntoVisService } from '../services/ontology/onto-vis.service';

import * as _ from 'lodash';
import { OntoData, OntoDataSearch } from '../models/ontology/onto-data.model';
import { OntoDataSearchFilterVm } from '../models/ontology/onto-data-search-filter.vm';
import { DATA_TYPE } from '../models/ontology/onto-data-types';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { ErrorHandler2Service } from '../services/common/error-handler-2.service';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

@Component({
    selector: 'app-test-components',
    templateUrl: './test-components.component.html',
    styleUrls: ['./test-components.component.scss'],
})
export class TestComponentsComponent {
    constructor(
        private fb: FormBuilder,
        private ontoVisService: OntoVisService,
        private ontoDataService: OntoDataService,
        private errorHandler2Service: ErrorHandler2Service
    ) {}

    ngOnInit() {
        this.ngOnInit_CustomSelection();
        this.ngOnInit_MultipleTableDragAndDrop();
        this.ngOnInit_OntoDataSearchAndAddToBasket();
    }

    //
    // Custom Selection test
    //

    formGroup!: FormGroup;
    public ontoVisArr!: OntoVis[];
    public ontoVisArrLength!: number;
    public data$: ReplaySubject<CustomSingleSelectionData[]> = new ReplaySubject<CustomSingleSelectionData[]>(1);

    ngOnInit_CustomSelection() {
        this.formGroup = new FormGroup({
            visId: new FormControl(''),
        });
        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.ontoVisArr = res;
                this.ontoVisArrLength = res.length;
                this.data$.next(
                    res.map((d: OntoVis) => {
                        return {
                            id: d.id,
                            name: d.function,
                        };
                    })
                );
            }
        });
    }

    public onSelectOntoVis(value: any) {
        console.log('TestComponentsComponent:onSelectOntoVis: value = ', value);
    }

    //
    // Multiple drag and drop table experiment
    //

    @ViewChild('table1') table1!: MatTable<any>;
    @ViewChild('table2') table2!: MatTable<any>;
    @ViewChild('list1') list1!: CdkDropList;
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    ELEMENT_DATA!: PeriodicElement[];
    ELEMENT_DATA2!: PeriodicElement[];
    dataSource!: any;
    dataSource2!: any;

    ngOnInit_MultipleTableDragAndDrop() {
        this.ELEMENT_DATA = [
            { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
            { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
            { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
            { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
        ];

        this.ELEMENT_DATA2 = [
            { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
            { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
            { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
            { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
            { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
        ];

        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource2 = new MatTableDataSource(this.ELEMENT_DATA2);
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }

        // updates moved data and table, but not dynamic if more dropzones
        this.dataSource.data = _.cloneDeep(this.dataSource.data);
        this.dataSource2.data = _.cloneDeep(this.dataSource2.data);
    }

    //
    // - Search data
    // - Add data to basket
    //

    public ontoDataSearchFormGroup!: FormGroup;
    dataTypes: string[] = [];
    suggestedOntoData!: OntoDataSearch[];
    highlightOntoDataSearchSuggestion!: string;
    public ontoDataSearchResult: OntoData[] = [];
    public ontoDataSearchResultTotalCount: number = 0;

    public ontoDataBasket: OntoData[] = [];

    ngOnInit_OntoDataSearchAndAddToBasket() {
        this.dataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);
        this.dataTypes.unshift('Select All');

        this.ontoDataSearchFormGroup = this.fb.group({
            ontoDataSearchDataType: new FormControl('', [Validators.required]),
            ontoDataSearchQuery: new FormControl('', [Validators.required]),
        });

        this.ontoDataSearchFormGroup
            .get('ontoDataSearchQuery')
            ?.valueChanges.pipe(debounceTime(0), distinctUntilChanged())
            .subscribe((query) => {
                if (!query || query === ' ') {
                    return;
                }

                this.highlightOntoDataSearchSuggestion = query;
                this.ontoDataService.suggest(query).subscribe((res) => {
                    this.suggestedOntoData = res;
                    console.log('PropagationComponent: suggestedOntoData = ', this.suggestedOntoData);
                });
            });
    }

    public onClickSearchOntoData() {
        this.suggestedOntoData = [];
        this.ontoDataSearchResult = [];
        this.ontoDataSearchResultTotalCount = 0;

        this.ontoDataSearchFormGroup.updateValueAndValidity();
        if (!this.ontoDataSearchFormGroup.valid) {
            return;
        }

        const ontoDataSearchFilterVm: OntoDataSearchFilterVm = {
            query: this.ontoDataSearchFormGroup.value.ontoDataSearchQuery,
            dataType:
                this.ontoDataSearchFormGroup.value.ontoDataSearchDataType === 'Select All'
                    ? null
                    : this.ontoDataSearchFormGroup.value.ontoDataSearchDataType,
        } as OntoDataSearchFilterVm;

        console.log(
            'TestComponentsComponent: onClickSearchOntoData: ontoDataSearchFilterVm = ',
            ontoDataSearchFilterVm
        );

        this.ontoDataService
            .search(ontoDataSearchFilterVm)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                })
            )
            .subscribe(
                (res: any) => {
                    this.ontoDataSearchResult = res.data;
                    this.ontoDataSearchResultTotalCount = res.totalCount;
                    //this.ontoDataSearchResultLen = this.ontoDataSearchResult.length;
                    console.log('TestComponentsComponent:search: ontoDataSearchResult = ', this.ontoDataSearchResult);
                },
                (err) => {}
                // () => (this.spinner = false)
            );
    }

    // add data to basket
    addData!: OntoData;
    public addOntoDataToBasket(row: OntoData) {
        console.log('TestComponentsComponent:addOntoDataToBasket: row = ', row);
        this.addData = row;
        console.log('TestComponentsComponent:addOntoDataToBasket: ontoDataBasket = ', this.ontoDataBasket);
    }

    public optionSelected(input: HTMLInputElement) {
        input.blur();
        input.setSelectionRange(0, 0);
        input.focus();
    }

}
