import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { OntoVisSearch } from '../models/ontology/onto-vis.model';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { DATA_TYPE } from '../models/ontology/onto-data-types';
import { OntoData, OntoDataSearchGroup } from '../models/ontology/onto-data.model';
import { OntoVisMainTableComponent } from '../components/onto-vis/main-table/main-table.component';
import { DialogService } from '../services/common/dialog.service';
import { LocalNotificationService } from '../services/common/local-notification.service';
import { PROPAGATION_TYPE } from '../models/ontology/propagation-type.enum';
import { ErrorHandler2Service } from '../services/common/error-handler-2.service';
import { OntoPageExt, OntoPageExtSearchGroup } from '../models/ontology/onto-page.model';
import { OntoVisSearchFilterVm } from '../models/ontology/onto-vis-search-filter.vm';
import { OntoDataSearchTableComponent } from '../components/onto-data/search-table/search-table.component';
import { OntoPageService } from '../services/ontology/onto-page.service';
import { DataStreamKeywordsArr, DataStreamKeywordsToDropdown } from '../services/ontology/data-stream-keywords.service';

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
        private errorHandler2Service: ErrorHandler2Service,
        private ngxUiLoaderService: NgxUiLoaderService
    ) {
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
        //this.ngOnInit_dataSearch1();
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
    // Build search from using keywords and data-types from example stream and adding new keywords
    //

    // Data search form
    //public ontoDataSearchFormGroup!: FormGroup;
    //allDataTypes: string[] = [];
    // Multi-level selection of keywords
    //grpKeywords = DataStreamKeywordsToDropdown();
    //selectedDataTypes = [];

    // Search data result in group
    public ontoDataMatchingGroups!: any; //OntoDataSearchGroup[];

    // Search page result in group
    public ontoPageExtSearchGroups!: OntoPageExtSearchGroup[];

    // Access selected rows of table (child component)
    // @ViewChild(OntoVisMainTableComponent) ontoVisTableComponent!: OntoVisMainTableComponent;
    // Access by reference as multiple data tables exists
    // @ViewChild('searchedOntoDataTable') ontoDataTableSComponent!: OntoDataSearchTableComponent;

    // ngOnInit_dataSearch1() {
    //     this.ontoDataSearchFormGroup = this.fb.group({
    //         searchDataType: new FormControl('', [Validators.required]),
    //         searchKeywords1: new FormControl('', [Validators.required]),
    //         searchKeywords2: new FormControl('', [Validators.required]),
    //     });
    // }

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    ngOnInit_dataSearch() {
        // keyword
        this.allKeywords = DataStreamKeywordsArr();

        const _filterKeyword = (value: string): string[] => {
            const filterValue = value.toLowerCase();
            return this.allKeywords.filter((d) => d.toLowerCase().indexOf(filterValue) === 0);
        };

        this.filteredKeywords1$ = this.keywordInputCtrl1.valueChanges.pipe(
            startWith(null),
            map((d: string | null) => (d ? _filterKeyword(d) : this.allKeywords.slice()))
        );

        this.filteredKeywords2$ = this.keywordInputCtrl2.valueChanges.pipe(
            startWith(null),
            map((d: string | null) => (d ? _filterKeyword(d) : this.allKeywords.slice()))
        );

        this.filteredKeywords3$ = this.keywordInputCtrl3.valueChanges.pipe(
            startWith(null),
            map((d: string | null) => (d ? _filterKeyword(d) : this.allKeywords.slice()))
        );

        // data type
        this.allDataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);

        const _filterDataType = (value: string): string[] => {
            const filterValue = value.toLowerCase();
            return this.allDataTypes.filter((d) => d.toLowerCase().indexOf(filterValue) === 0);
        };

        this.filteredDataTypes$ = this.dataTypeInputCtrl.valueChanges.pipe(
            startWith(null),
            map((d: string | null) => (d ? _filterDataType(d) : this.allDataTypes.slice()))
        );
    }

    /**
     * Keywords
     * 1: must, 2: should, 3: must not
     */
    allKeywords!: string[];
    selectedKeywords: any = {};
    selectedKeywords1: string[] = [];
    selectedKeywords2: string[] = [];
    selectedKeywords3: string[] = [];

    @ViewChild('keywordInput1') keywordInput1!: ElementRef<HTMLInputElement>;
    //@ViewChild('auto1') matAutocomplete1!: MatAutocomplete;
    keywordInputCtrl1 = new FormControl();
    filteredKeywords1$!: Observable<string[]>;

    @ViewChild('keywordInput2') keywordInput2!: ElementRef<HTMLInputElement>;
    //@ViewChild('auto1') matAutocomplete1!: MatAutocomplete;
    keywordInputCtrl2 = new FormControl();
    filteredKeywords2$!: Observable<string[]>;

    @ViewChild('keywordInput3') keywordInput3!: ElementRef<HTMLInputElement>;
    //@ViewChild('auto1') matAutocomplete1!: MatAutocomplete;
    keywordInputCtrl3 = new FormControl();
    filteredKeywords3$!: Observable<string[]>;

    onUpdateKeywords(kw: any) {
        this.selectedKeywords = kw;
        this.updateSelectedKeywords1();
        this.updateSelectedKeywords2();
        this.updateSelectedKeywords3();
    }

    onClickRemoveKeyword1(kw: string) {
        delete this.selectedKeywords[kw];
        this.updateSelectedKeywords1();
    }

    onClickRemoveKeyword2(kw: string) {
        delete this.selectedKeywords[kw];
        this.updateSelectedKeywords2();
    }

    onClickRemoveKeyword3(kw: string) {
        delete this.selectedKeywords[kw];
        this.updateSelectedKeywords3();
    }

    onInputKeyword1(event: MatAutocompleteSelectedEvent): void {
        const kw = event.option.viewValue;
        console.log('onInputKeyword1: ', kw);

        if (!this.selectedKeywords[kw]) {
            this.selectedKeywords[kw] = { state: 1, from: 'nw' };
        }
        this.updateSelectedKeywords1();

        this.keywordInput1.nativeElement.value = '';
        this.keywordInputCtrl1.setValue(null);
    }

    onInputKeyword2(event: MatAutocompleteSelectedEvent): void {
        const kw = event.option.viewValue;
        console.log('onInputKeyword2: ', kw);

        if (!this.selectedKeywords[kw]) {
            this.selectedKeywords[kw] = { state: 2, from: 'nw' };
        }
        this.updateSelectedKeywords2();

        this.keywordInput2.nativeElement.value = '';
        this.keywordInputCtrl2.setValue(null);
    }

    onInputKeyword3(event: MatAutocompleteSelectedEvent): void {
        const kw = event.option.viewValue;
        console.log('onInputKeyword3: ', kw);

        if (!this.selectedKeywords[kw]) {
            this.selectedKeywords[kw] = { state: 3, from: 'nw' };
        }
        this.updateSelectedKeywords3();

        this.keywordInput3.nativeElement.value = '';
        this.keywordInputCtrl3.setValue(null);
    }

    private updateSelectedKeywords1() {
        this.selectedKeywords1 = Object.keys(this.selectedKeywords).filter((d) => this.selectedKeywords[d].state === 1);
        console.log('updateSelectedKeywords1: ', this.selectedKeywords1);
    }

    private updateSelectedKeywords2() {
        this.selectedKeywords2 = Object.keys(this.selectedKeywords).filter((d) => this.selectedKeywords[d].state === 2);
        console.log('updateSelectedKeywords2: ', this.selectedKeywords2);
    }

    private updateSelectedKeywords3() {
        this.selectedKeywords3 = Object.keys(this.selectedKeywords).filter((d) => this.selectedKeywords[d].state === 3);
        console.log('updateSelectedKeywords3: ', this.selectedKeywords3);
    }

    onEnterAddKeyword1(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        console.log('onEnterAddDataTypeChip: ', input, value);
        // not implemented
    }

    onEnterAddKeyword2(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        console.log('onEnterAddDataTypeChip: ', input, value);
        // not implemented
    }

    onEnterAddKeyword3(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        console.log('onEnterAddDataTypeChip: ', input, value);
        // not implemented
    }

    /**
     * Data-type filter
     */

    allDataTypes!: string[];
    selectedDataTypes: any = {};
    selectedDataTypes_: string[] = [];

    @ViewChild('dataTypeInput') dataTypeInput!: ElementRef<HTMLInputElement>;
    //@ViewChild('auto') matAutocomplete!: MatAutocomplete;
    dataTypeInputCtrl = new FormControl();
    filteredDataTypes$!: Observable<string[]>;

    onUpdateDataTypes(dt: any) {
        this.selectedDataTypes = dt;
        this.updateSelectedDataTypes_();
    }

    onClickRemoveDataType(dt: string) {
        delete this.selectedDataTypes[dt];
        this.updateSelectedDataTypes_();
    }

    onInputDataType(event: MatAutocompleteSelectedEvent): void {
        const dt = event.option.viewValue;
        console.log('onInputDataType: ', dt);

        if (!this.selectedDataTypes[dt]) {
            this.selectedDataTypes[dt] = { state: 1, from: 'nw' };
        }
        this.updateSelectedDataTypes_();

        this.dataTypeInput.nativeElement.value = '';
        this.dataTypeInputCtrl.setValue(null);
    }

    onEnterAddDataType(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        console.log('onEnterAddDataTypeChip: ', input, value);
        // not implemented
    }

    private updateSelectedDataTypes_() {
        this.selectedDataTypes_ = Object.keys(this.selectedDataTypes).filter(
            (d) => this.selectedDataTypes[d].state === 1
        );
        console.log('updateSelectedDataTypes_: ', this.selectedDataTypes_);
    }

    /**
     * Ranking setting
     */

    public keywordFieldWeight: number = 0.9;
    public descriptionFieldWeight: number = 0.1;
    public minimumShouldMatch: number = 1;
    public cluster: boolean = true;
    public numClusters!: number;

    public onClickSearchMatchingGroups() {
        console.log(
            'PropagationComponent:onClickSearchMatchingGroups: ',
            this.selectedKeywords1,
            this.selectedKeywords2,
            this.selectedKeywords3,
            this.selectedDataTypes_
        );
        console.log(
            'PropagationComponent:onClickSearchMatchingGroups: ',
            this.keywordFieldWeight,
            this.descriptionFieldWeight,
            this.minimumShouldMatch,
            this.cluster,
            this.numClusters
        );

        if (!this.ontoVisSearchResult || !this.ontoVisSearchResult[0]?.id) {
            this.localNotificationService.error({ message: 'Select a VIS function' });
        }

        let query = {
            visId: this.ontoVisSearchResult[0]?.id,
            mustKeys: this.selectedKeywords1,
            shouldKeys: this.selectedKeywords2,
            mustNotKeys: this.selectedKeywords3,
            filterKeys: this.selectedDataTypes_,

            minimumShouldMatch: this.minimumShouldMatch,
            alpha: this.keywordFieldWeight,
            beta: this.descriptionFieldWeight,
            cluster: this.cluster,
            numClusters: this.numClusters
        };

        // let selectedDataTypes = this.ontoDataSearchFormGroup.value.searchDataType;
        // let selectedKeywords = this.ontoDataSearchFormGroup.value.ontoDataSearchKeyword;
        // console.log(selectedDataTypes, selectedKeywords);

        this.ngxUiLoaderService.start();

        this.ontoDataService
            .searchMatchingGroups(query)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    this.ngxUiLoaderService.stop();
                    return of([]);
                })
            )
            .subscribe(
                (res: any) => {
                    this.ontoDataMatchingGroups = res;
                    console.log( 'PropagationComponent:search: onClickSearchMatchingData = ', this.ontoDataMatchingGroups );
                    this.ngxUiLoaderService.stop();
                },
                (err) => {}
                // () => (this.spinner = false)
            );

        // this.ontoDataService
        //     .searchGroup(this.ontoVisSearchResult[0]?.id)
        //     .pipe(
        //         catchError((err) => {
        //             this.errorHandler2Service.handleError(err);
        //             return of([]);
        //         })
        //     )
        //     .subscribe(
        //         (res: any) => {
        //             this.ontoDataMatchingGroups = res;
        //             console.log('PropagationComponent:search: ontoDataSearchGroups = ', this.ontoDataMatchingGroups);
        //         },
        //         (err) => {}
        //         // () => (this.spinner = false)
        //     );

        // this.ontoPageService
        //     .searchGroup(this.ontoVisSearchResult[0]?.id)
        //     .pipe(
        //         catchError((err) => {
        //             this.errorHandler2Service.handleError(err);
        //             return of([]);
        //         })
        //     )
        //     .subscribe(
        //         (res: any) => {
        //             this.ontoPageExtSearchGroups = res;
        //             console.log(
        //                 'PropagationComponent:search: ontoPageExtSearchGroups = ',
        //                 this.ontoPageExtSearchGroups
        //             );
        //         },
        //         (err) => {}
        //         // () => (this.spinner = false)
        //     );
    }

    public onClickPropagateOntoDataSearchGroup(idx: number) {
        if (idx >= 0) {
            this.ontoDataMatchingGroups.splice(idx, 1);

            // Propagate
            this.localNotificationService.success({ message: 'Propagated' });
        }
    }

    public onClickRemoveOntoDataSearchGroup(idx: number) {
        if (idx >= 0) {
            let res = this.ontoDataMatchingGroups.splice(idx, 1);
        }
    }

    //
    // Propagation
    //
    public onClickPropagateAll() {
        // const vis = this.ontoVisTableComponent?.getSelection();
        // const data = this.ontoDataTableSComponent?.getSelection();
        // if (!vis || vis.length === 0 || !data || data.length === 0 || !this.propagationType) {
        //     this.localNotificationService.error({
        //         message: 'Is VIS function, data and propagation type are selected?',
        //     });
        //     return;
        // }
        // console.log('PropagationComponent: vis = ', vis, '\ndata = ', data);
        // this.dialogService.warn('Propagate', 'Are you sure you want to propagate this?', 'Propagate').then((result) => {
        //     if (result.value) {
        //     }
        // });
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
