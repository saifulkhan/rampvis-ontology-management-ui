import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { OntoVis } from '../models/ontology/onto-vis.model';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { DATA_TYPE } from '../models/ontology/onto-data-types';
import { OntoData, OntoDataSearch } from '../models/ontology/onto-data.model';
import { OntoDataFilterVm } from '../models/ontology/onto-data-filter.vm';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustomSingleSelectionData } from '../components/custom-single-selection/custom-single-selection.component';
import { OntoDataTableAComponent } from '../components/onto-data/table-a/onto-data-table-a.component';
import { OntoVisTableComponentA } from '../components/onto-vis/table-a/onto-vis-table-a.component';
import { DialogService } from '../services/common/dialog.service';
import { LocalNotificationService } from '../services/common/local-notification.service';
import { PROPAGATION_TYPE } from '../models/ontology/propagation-type.enum';
import { OntoDataSearchFilterVm } from '../models/ontology/onto-data-search-filter.vm';
import { ErrorHandler2Service } from '../services/common/error-handler-2.service';
import { OntoPage } from '../models/ontology/onto-page.model';

@Component({
    selector: 'app-propagation',
    templateUrl: './propagation.component.html',
    styleUrls: ['./propagation.component.scss'],
})
export class PropagationComponent implements OnInit {
    // Select VIS function dropdown and the selected VIS table
    public selectedVisId!: string;
    public ontoVisArr$: ReplaySubject<CustomSingleSelectionData[]> = new ReplaySubject<CustomSingleSelectionData[]>(1);
    public selectedOntoVisArr: OntoVis[] = [];
    public selectedOntoVisArrLen: number = 0;

    // Example binding data
    public exampleOntoDataArr!: OntoData[];

    // Example links/pages
    public exampleOntoPages!: OntoPage[];

    // Data search form
    filterPublishType$ = new BehaviorSubject<string>('');

    searchForm: FormControl = new FormControl();
    dataTypes: string[] = [];
    selectedDataType!: DATA_TYPE;
    searchQuery!: string;
    suggestedList: OntoDataSearch[] = [];
    toHighlight: string = '';

    // Data search result
    public searchTerm!: string;
    public ontoDataSearchResult: OntoData[] = [];
    public ontoDataSearchResultLen: number = 0;
    private ontoDataFilterVm!: OntoDataFilterVm;

    // Access selected rows of table (child component)
    @ViewChild(OntoVisTableComponentA) ontoVisTableComponent!: OntoVisTableComponentA;
    // Access by reference as multiple data tables exists
    @ViewChild('searchedOntoDataTable') ontoDataTableComponent!: OntoDataTableAComponent;

    // Propagation
    public propagationTypes!: string[];
    public propagationType!: PROPAGATION_TYPE;

    constructor(
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

        this.searchForm.valueChanges.pipe(debounceTime(0), distinctUntilChanged()).subscribe((query) => {
            if (!query || query === ' ') {
                return;
            }

            this.toHighlight = query;
            this.ontoDataService.suggest(query, this.selectedDataType).subscribe((res) => {
                this.suggestedList = res;
                console.log('PropagationComponent: suggested = ', res);
            });
        });

        this.getAllOntoVis();
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    //
    // VIS function
    //
    public onSelectOntoVis(visId: any) {
        console.log('PropagationComponent:onSelectOntoVis: visId = ', visId);
        this.selectedVisId = visId;
        this.getOntoVis();
    }

    private getAllOntoVis() {
        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.ontoVisArr$.next(
                    res.map((d: OntoVis) => {
                        return {
                            id: d.id,
                            name: d.function,
                        };
                    })
                );
                console.log('PropagationComponent: getAllOntoVis: ontoVisArr$ = ', res);
            }
        });
    }

    private getOntoVis() {
        this.selectedOntoVisArr = [];
        this.selectedOntoVisArrLen = 0;

        this.exampleOntoDataArr = [];

        this.ontoVisService.getOntoVis(this.selectedVisId).subscribe((res: OntoVis) => {
            if (res) {
                this.selectedOntoVisArr = [res];
                this.selectedOntoVisArrLen = this.selectedOntoVisArr.length;
                console.log('PropagationComponent: getOntoVis: ontoVisArr = ', this.selectedOntoVisArr);

                // TODO:multiple observable
                this.ontoVisService
                    .getExamplePagesBindingVisId(this.selectedVisId)
                    .subscribe((ontoData: OntoData[]) => {
                        console.log('PropagationComponent: getOntoVis: ontoData = ', ontoData);
                        this.exampleOntoDataArr = ontoData;
                    });
            }
        });
    }

    //
    // Search data and show in a table
    //

    public filterAndSearchOntoData(_ontoDataFilterVm: OntoDataFilterVm) {
        console.log('OntoDataComponent:filterOntoData: ontoDataFilterVm = ', _ontoDataFilterVm);
        this.ontoDataFilterVm = _ontoDataFilterVm;
        this.search();
    }

    public search() {
        console.log('PropagationComponent: search: searchQuery = ', this.searchQuery);
        this.suggestedList = [];

        if (!this.searchQuery || this.searchQuery === ' ') {
            this.clearDataSearch();
            return;
        }

        const ontoDataSearchFilterVm: OntoDataSearchFilterVm = {
            ...this.ontoDataFilterVm,
            query: this.searchQuery,
            dataType: this.selectedDataType,
            visId: this.selectedVisId,
        } as OntoDataSearchFilterVm;

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
                    this.ontoDataSearchResultLen = this.ontoDataSearchResult.length;
                    console.log('PropagationComponent:search: ontoDataSearchResult = ', this.ontoDataSearchResult);
                },
                (err) => {}
                // () => (this.spinner = false)
            );
    }

    private clearDataSearch(): void {
        this.ontoDataSearchResult = [];
        this.ontoDataSearchResultLen = 0;
    }

    /**
     *
     */
    public optionSelected(input: HTMLInputElement) {
        input.blur();
        input.setSelectionRange(0, 0);
        input.focus();
    }


    //
    // Propagation
    //
    public onClickPropagate() {
        const vis = this.ontoVisTableComponent?.getSelection();
        const data = this.ontoDataTableComponent?.getSelection();

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
