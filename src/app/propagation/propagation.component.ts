import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { OntoVisSearch } from '../models/ontology/onto-vis.model';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { DATA_TYPE } from '../models/ontology/onto-data-types';
import { OntoData, OntoDataSearch } from '../models/ontology/onto-data.model';
import { OntoDataFilterVm } from '../models/ontology/onto-data-filter.vm';
import { OntoVisTableComponentA } from '../components/onto-vis/table-a/onto-vis-table-a.component';
import { DialogService } from '../services/common/dialog.service';
import { LocalNotificationService } from '../services/common/local-notification.service';
import { PROPAGATION_TYPE } from '../models/ontology/propagation-type.enum';
import { OntoDataSearchFilterVm } from '../models/ontology/onto-data-search-filter.vm';
import { ErrorHandler2Service } from '../services/common/error-handler-2.service';
import { OntoPage } from '../models/ontology/onto-page.model';
import { OntoVisSearchFilterVm } from '../models/ontology/onto-vis-search-filter.vm';
import { OntoDataTableSComponent } from '../components/onto-data/table-s/onto-data-table-s.component';

@Component({
    selector: 'app-propagation',
    templateUrl: './propagation.component.html',
    styleUrls: ['./propagation.component.scss'],
})
export class PropagationComponent implements OnInit {
    //
    // Search VIS function
    //
    public ontoVisSearchFormGroup!: FormGroup;
    public searchOntoVisQuery!: string;
    public highlightOntoVisSearchSuggestion!: string;
    public suggestedOntoVis!: OntoVisSearch[];
    public ontoVisSearchResult: OntoVisSearch[] = [];

    // Example binding data
    public exampleOntoData!: OntoData[];

    // Example links
    public exampleOntoPages!: OntoPage[];

    //
    // Search data
    //
    // Data search form
    public ontoDataSearchFormGroup!: FormGroup;
    //public filterData: FormControl = new FormControl();
    dataTypes: string[] = [];
    suggestedOntoData!: OntoDataSearch[];
    highlightOntoDataSearchSuggestion!: string;
    //searchOntoDataType!: DATA_TYPE;
    //searchOntoDataQuery!: string;

    filterPublishType$ = new BehaviorSubject<string>('');

    // Search data result
    public ontoDataSearchResult: OntoData[] = [];
    public ontoDataSearchResultTotalCount: number = 0;
    private ontoDataFilterVm!: OntoDataFilterVm;

    // Access selected rows of table (child component)
    @ViewChild(OntoVisTableComponentA) ontoVisTableComponent!: OntoVisTableComponentA;
    // Access by reference as multiple data tables exists
    @ViewChild('searchedOntoDataTable') ontoDataTableSComponent!: OntoDataTableSComponent;

    //
    public ontoDataBasket: OntoData[] = [];

    // Propagation
    public propagationTypes!: string[];
    public propagationType!: PROPAGATION_TYPE;

    constructor(
        private fb: FormBuilder,
        private ontoVisService: OntoVisService,
        private ontoDataService: OntoDataService,
        private dialogService: DialogService,
        private localNotificationService: LocalNotificationService,
        private errorHandler2Service: ErrorHandler2Service
    ) {
        this.dataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);
        this.propagationTypes = (Object.keys(PROPAGATION_TYPE) as Array<keyof typeof PROPAGATION_TYPE>).map(
            (d) => PROPAGATION_TYPE[d]
        );
    }

    ngOnInit(): void {
        // Vis search form and suggestion

        this.ontoVisSearchFormGroup = this.fb.group({
            ontoVisSearchQuery: new FormControl('', [Validators.required]),
        });

        this.ontoVisSearchFormGroup
            .get('ontoVisSearchQuery')
            ?.valueChanges.pipe(debounceTime(0), distinctUntilChanged())
            .subscribe((query) => {
                if (!query || query === ' ') {
                    return;
                }

                this.highlightOntoVisSearchSuggestion = query;
                this.ontoVisService.suggest(query).subscribe((res) => {
                    this.suggestedOntoVis = res;
                    console.log('PropagationComponent: suggestedOntoVis = ', this.suggestedOntoVis);
                });
            });

        // Data search form and suggestion

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

        //this.ontoDataSearchFormGroup.get('ontoDataSearchDataType')?.setValue('Select all');
    }

    ngAfterViewInit(): void {}

    //
    // VIS function search, example data, and example links
    //

    public onClickSearchOntoVis() {
        this.ontoVisSearchFormGroup.updateValueAndValidity();
        if (!this.ontoVisSearchFormGroup.valid) {
            return;
        }

        this.suggestedOntoVis = [];
        this.ontoVisSearchResult = [];

        const ontoVisSearchFilterVm: OntoVisSearchFilterVm = {
            query: this.ontoVisSearchFormGroup.value.ontoVisSearchQuery,
        } as OntoVisSearchFilterVm;

        console.log('PropagationComponent: onClickSearchOntoVis: ontoVisSearchFilterVm = ', ontoVisSearchFilterVm);

        this.ontoVisService
            .search(ontoVisSearchFilterVm)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                })
            )
            .subscribe(
                (res: any) => {
                    this.ontoVisSearchResult = res;
                    console.log('PropagationComponent:searchOntoVis: ontoVisSearchResult = ', this.ontoVisSearchResult);
                    this.getExampleOntoData();
                },
                (err) => {}
                // () => (this.spinner = false)
            );
    }

    private getExampleOntoData() {
        if (!this.ontoVisSearchResult || !this.ontoVisSearchResult[0]?.id) {
            return;
        }

        this.ontoVisService.getExamplePagesBindingVisId(this.ontoVisSearchResult[0].id).subscribe((res: OntoData[]) => {
            console.log('PropagationComponent: getOntoVis: exampleOntoData = ', res);
            this.exampleOntoData = res;
        });
    }

    //
    // Search data and show in a table
    //

    public filterAndSearchOntoData(_ontoDataFilterVm: OntoDataFilterVm) {
        console.log('OntoDataComponent:filterOntoData: ontoDataFilterVm = ', _ontoDataFilterVm);
        this.ontoDataFilterVm = _ontoDataFilterVm;
        this.onClickSearchOntoData();
    }

    public onClickSearchOntoData() {
        this.ontoDataSearchFormGroup.updateValueAndValidity();
        if (!this.ontoDataSearchFormGroup.valid) {
            return;
        }

        this.suggestedOntoData = [];
        this.ontoDataSearchResult = [];
        this.ontoDataSearchResultTotalCount = 0;

        if (!this.ontoVisSearchResult || !this.ontoVisSearchResult[0]?.id) {
            this.localNotificationService.error({ message: 'Select a VIS function' });
        }

        const ontoDataSearchFilterVm: OntoDataSearchFilterVm = {
            ...this.ontoDataFilterVm,
            query: this.ontoDataSearchFormGroup.value.ontoDataSearchQuery,
            dataType:
                this.ontoDataSearchFormGroup.value.ontoDataSearchDataType === DATA_TYPE.ALL
                    ? null
                    : this.ontoDataSearchFormGroup.value.ontoDataSearchDataType,
            visId: this.ontoVisSearchResult[0]?.id,
        } as OntoDataSearchFilterVm;

        console.log('PropagationComponent: onClickSearchOntoData: ontoDataSearchFilterVm = ', ontoDataSearchFilterVm);

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
                    console.log('PropagationComponent:search: ontoDataSearchResult = ', this.ontoDataSearchResult);
                },
                (err) => {}
                // () => (this.spinner = false)
            );
    }

    /**
     *
     */
    public optionSelected(input: HTMLInputElement) {
        input.blur();
        input.setSelectionRange(0, 0);
        input.focus();
    }

    /**
     *
     */
    addData!: OntoData;
    public addOntoDataToBasket(row: OntoData) {
        console.log('PropagationComponent:addOntoDataToBasket: row = ', row);
        this.addData = row;
        console.log('PropagationComponent:addOntoDataToBasket: ontoDataBasket = ', this.ontoDataBasket);
    }

    //
    // Propagation
    //
    public onClickPropagate() {
        const vis = this.ontoVisTableComponent?.getSelection();
        const data = this.ontoDataTableSComponent?.getSelection();

        if (!vis || vis.length === 0 || !data || data.length === 0 || !this.propagationType) {
            this.localNotificationService.error({
                message: 'Is VIS function, data and propagation type are selected?',
            });
            return;
        }

        console.log('PropagationComponent: vis = ', vis, '\ndata = ', data);

        this.dialogService.warn('Propagate', 'Are you sure you want to propagate this?', 'Propagate').then((result) => {
            if (result.value) {
            }
        });
    }
}
