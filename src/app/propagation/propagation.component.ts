import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { FormControl } from '@angular/forms';

import { OntoVis } from '../models/ontology/onto-vis.model';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { DATA_TYPE } from '../models/ontology/onto-data-types';
import { OntoData, OntoDataSearch } from '../models/ontology/onto-data.model';
import { OntoDataFilterVm } from '../models/ontology/onto-data-filter.vm';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustomSingleSelectionData } from '../components/custom-single-selection/custom-single-selection.component';
import { OntoDataTableComponent } from '../onto-data/display/table/onto-data-table.component';
import { OntoVisTableComponent } from '../onto-vis/display/table/onto-vis-table.component';
import { DialogService } from '../services/common/dialog.service';
import { LocalNotificationService } from '../services/common/local-notification.service';
import { PROPAGATION_TYPE } from '../models/ontology/propagation-type.enum';

@Component({
    selector: 'app-propagation',
    templateUrl: './propagation.component.html',
    styleUrls: ['./propagation.component.scss'],
})
export class PropagationComponent implements OnInit {
    // Vis: All VIS function for dropdown and the selected VIS as array
    public visId!: string;
    public ontoVisArr$: ReplaySubject<CustomSingleSelectionData[]> = new ReplaySubject<CustomSingleSelectionData[]>(1);
    public ontoVisArr: OntoVis[] = [];
    public ontoVisArrLen: number = 0;

    // Example binding data
    public ontoDataArr: OntoData[] = [];
    public ontoDataArrLen: number = 0;

    // data search form
    filterPublishType$ = new BehaviorSubject<string>('');

    searchForm: FormControl = new FormControl();
    dataTypes: string[] = [];
    dataType!: DATA_TYPE;
    searchQuery!: string;
    suggestedList: OntoDataSearch[] = [];
    toHighlight: string = '';

    // data search result
    public searchTerm!: string;
    public ontoDataSearchResult!: OntoData[];
    public ontoDataSearchResultLen!: number;

    // Access selected rows of table (child component)
    @ViewChild(OntoVisTableComponent) ontoVisTableComponent!: OntoVisTableComponent;
    // Access by reference as multiple data tables exists
    @ViewChild('searchedOntoDataTable') ontoDataTableComponent!: OntoDataTableComponent;

    // Propagation
    public propagationTypes!: string[];
    public propagationType!: PROPAGATION_TYPE;

    constructor(
        private route: ActivatedRoute,
        private ontoVisService: OntoVisService,
        private ontoDataService: OntoDataService,
        private dialogService: DialogService,
        private localNotificationService: LocalNotificationService
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
            this.ontoDataService.suggest(query, this.dataType).subscribe((res) => {
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
        this.visId = visId;
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
        this.ontoVisArr = [];
        this.ontoVisArrLen = 0;

        this.ontoDataArr = [];
        this.ontoDataArrLen = 0;

        this.ontoVisService.getOntoVis(this.visId).subscribe((res: OntoVis) => {
            if (res) {
                this.ontoVisArr = [res];
                this.ontoVisArrLen = this.ontoVisArr.length;
                console.log('PropagationComponent: getOntoVis: ontoVisArr = ', this.ontoVisArr);

                // TODO:multiple observable
                this.ontoVisService.getExamplePagesBindingVisId(this.visId).subscribe((ontoData: OntoData[]) => {
                    console.log('PropagationComponent: getOntoVis: ontoData = ', ontoData);
                    this.ontoDataArr = ontoData;
                    this.ontoDataArrLen = this.ontoDataArr.length;
                });
            }
        });
    }

    //
    // Search data and show in a table
    //

    public search() {
        console.log('PropagationComponent: search: searchQuery = ', this.searchQuery);
        this.suggestedList = [];

        if (!this.searchQuery || this.searchQuery === ' ') {
            this.clearDataSearch()
            return;
        }

        this.ontoDataService.search(this.searchQuery, this.dataType, this.visId).subscribe(
            (result) => {
                this.ontoDataSearchResult = result;
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

    public optionSelected(input: HTMLInputElement) {
        input.blur();
        input.setSelectionRange(0, 0);
        input.focus();
    }

    public getOntoData(ontoDataFilter: OntoDataFilterVm) {}

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
