import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { OntoVisSearch } from '../models/ontology/onto-vis.model';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { DATA_TYPE } from '../models/ontology/onto-data-types';
import { OntoData, OntoDataSearch, OntoDataSearchGroup } from '../models/ontology/onto-data.model';
import { OntoDataFilterVm } from '../models/ontology/onto-data-filter.vm';
import { OntoVisMainTableComponent } from '../components/onto-vis/main-table/main-table.component';
import { DialogService } from '../services/common/dialog.service';
import { LocalNotificationService } from '../services/common/local-notification.service';
import { PROPAGATION_TYPE } from '../models/ontology/propagation-type.enum';
import { ErrorHandler2Service } from '../services/common/error-handler-2.service';
import { OntoPageExt, OntoPageExtSearchGroup } from '../models/ontology/onto-page.model';
import { OntoVisSearchFilterVm } from '../models/ontology/onto-vis-search-filter.vm';
import { OntoDataSearchTableComponent } from '../components/onto-data/search-table/search-table.component';
import { OntoPageService } from '../services/ontology/onto-page.service';
import { DataStreamKeywordsToDropdown } from '../services/ontology/data-stream-keywords.service';

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

    // Example binding data and page
    public exampleOntoData!: OntoData[];
    public exampleLinks!: OntoPageExt[];

    // Propagation
    public propagationTypes!: string[];
    public propagationType!: PROPAGATION_TYPE;

    constructor(
        private fb: FormBuilder,
        private ontoVisService: OntoVisService,
        private ontoDataService: OntoDataService,
        private ontoPageService: OntoPageService,
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

        this.ngOnInit_dataSearch();
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
                    this.getExampleLinks();
                },
                (err) => {}
                // () => (this.spinner = false)
            );
    }

    private getExampleOntoData() {
        if (!this.ontoVisSearchResult || !this.ontoVisSearchResult[0]?.id) {
            return;
        }

        this.ontoVisService
            .getExampleOntoDataBindingVisId(this.ontoVisSearchResult[0].id)
            .subscribe((res: OntoData[]) => {
                console.log('PropagationComponent: getOntoVis: exampleOntoData = ', res);
                this.exampleOntoData = res;
            });
    }

    private getExampleLinks() {
        if (!this.ontoVisSearchResult || !this.ontoVisSearchResult[0]?.id) {
            return;
        }

        this.ontoVisService
            .getExampleLinksBindingVisId(this.ontoVisSearchResult[0].id)
            .subscribe((res: OntoPageExt[]) => {
                console.log('PropagationComponent:getExampleLinks: exampleLinks = ', res);
                this.exampleLinks = res;
            });
    }

    //
    // Search data and link
    //

    // Data search form
    public ontoDataSearchFormGroup!: FormGroup;
    dataTypes: string[] = [];
    // Multi-level selection of keywords
    grpKeywords = DataStreamKeywordsToDropdown();
    selectedDataTypes = [];


    // Search data result in group
    public ontoDataSearchGroups!: OntoDataSearchGroup[];

    // Search page result in group
    public ontoPageExtSearchGroups!: OntoPageExtSearchGroup[];

    // Access selected rows of table (child component)
    @ViewChild(OntoVisMainTableComponent) ontoVisTableComponent!: OntoVisMainTableComponent;
    // Access by reference as multiple data tables exists
    @ViewChild('searchedOntoDataTable') ontoDataTableSComponent!: OntoDataSearchTableComponent;

    ngOnInit_dataSearch() {
        this.dataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);

        this.ontoDataSearchFormGroup = this.fb.group({
            searchDataType: new FormControl('', [Validators.required]),
            searchKeywords1: new FormControl('', [Validators.required]),
            searchKeywords2: new FormControl('', [Validators.required]),
        });

    }

    public onClickSearchOntoData() {
        if (!this.ontoVisSearchResult || !this.ontoVisSearchResult[0]?.id) {
            this.localNotificationService.error({ message: 'Select a VIS function' });
        }

        let selectedDataTypes = this.ontoDataSearchFormGroup.value.searchDataType;
        let selectedKeywords = this.ontoDataSearchFormGroup.value.ontoDataSearchKeyword;
        console.log(selectedDataTypes, selectedKeywords);

        this.ontoDataService
            .searchGroup(this.ontoVisSearchResult[0]?.id)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                })
            )
            .subscribe(
                (res: any) => {
                    this.ontoDataSearchGroups = res;
                    console.log('PropagationComponent:search: ontoDataSearchGroups = ', this.ontoDataSearchGroups);
                },
                (err) => {}
                // () => (this.spinner = false)
            );

        this.ontoPageService
            .searchGroup(this.ontoVisSearchResult[0]?.id)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                })
            )
            .subscribe(
                (res: any) => {
                    this.ontoPageExtSearchGroups = res;
                    console.log(
                        'PropagationComponent:search: ontoPageExtSearchGroups = ',
                        this.ontoPageExtSearchGroups
                    );
                },
                (err) => {}
                // () => (this.spinner = false)
            );
    }

    public onClickPropagateOntoDataSearchGroup(idx: number) {
        if (idx >= 0) {
            this.ontoDataSearchGroups.splice(idx, 1);

            // Propagate
            this.localNotificationService.success({ message: 'Propagated' });
        }
    }

    public onClickRemoveOntoDataSearchGroup(idx: number) {
        if (idx >= 0) {
            let res = this.ontoDataSearchGroups.splice(idx, 1);
        }
    }






    //
    // Propagation
    //
    public onClickPropagateAll() {
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


    /**
     * Used by autocomplete UI
     */
    public optionSelected(input: HTMLInputElement) {
        input.blur();
        input.setSelectionRange(0, 0);
        input.focus();
    }

}
