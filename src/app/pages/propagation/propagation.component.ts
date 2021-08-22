import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { OntoVisSearch } from '../../models/ontology/onto-vis.model';
import { OntoVisService } from '../../services/ontology/onto-vis.service';
import { OntoDataService } from '../../services/ontology/onto-data.service';
import { DATA_TYPE } from '../../models/ontology/onto-data-types';
import { OntoData } from '../../models/ontology/onto-data.model';
import { LocalNotificationService } from '../../services/local-notification.service';
import { PROPAGATION_TYPE } from '../../models/ontology/propagation-type.enum';
import { ErrorHandler2Service } from '../../services/error-handler-2.service';
import { OntoPageExt, OntoPageExtSearchGroup } from '../../models/ontology/onto-page.model';
import { OntoVisSearchFilterVm } from '../../models/ontology/onto-vis-search-filter.vm';
import { OntoPageService } from '../../services/ontology/onto-page.service';
import { DataStreamKeywordsArr } from '../../services/ontology/data-stream-keywords.service';
import { PAGE_TYPE } from '../../models/ontology/page-type.enum';
import { SEL_KW_STATE } from '../../models/selected-kw-state';
import { SEL_DATATYPE_STATE } from '../../models/selected-datatype-state';


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
    public referenceOntoVis: OntoVisSearch[] = [];

    // Example binding data and page
    public referenceOntoData: OntoData[] = [];
    public exampleLinks: OntoPageExt[] = [];

    // Propagation
    public propagationTypes!: string[];
    public propagationType!: PROPAGATION_TYPE;

    constructor(
        private fb: FormBuilder,
        private ontoVisService: OntoVisService,
        private ontoDataService: OntoDataService,
        private localNotificationService: LocalNotificationService,
        private errorHandler2Service: ErrorHandler2Service,
        private ngxUiLoaderService: NgxUiLoaderService,
        private ontoPageService: OntoPageService
    ) {
        this.propagationTypes = (Object.keys(PROPAGATION_TYPE) as Array<keyof typeof PROPAGATION_TYPE>).map((d) => PROPAGATION_TYPE[d]);
    }

    ngOnInit(): void {
        this.ngOnInitVisSearch();
        this.ngOnInit_dataSearch();
    }

    ngAfterViewInit(): void {
        //this.ngAfterViewInitOntoDataSearchForm();
    }

    //
    // VIS function search, example data, and example links
    //

    ngOnInitVisSearch(): void {

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
    }

    public onClickSearchOntoVis() {

        this.ontoVisSearchFormGroup.updateValueAndValidity();
        if (!this.ontoVisSearchFormGroup.valid) {
            return;
        }

        // Clear everything
        this.suggestedOntoVis = [];
        this.referenceOntoVis = [];
        this.referenceOntoData = [];
        this.discoveredOntoDataGroups = [];
        this.datatypeSelectionStateMap = {}
        this.keywordSelectionStateMap = {}

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
                    this.referenceOntoVis = res;
                    console.log('PropagationComponent:searchOntoVis: ontoVisSearchResult = ', this.referenceOntoVis);
                    if (!this.referenceOntoVis || this.referenceOntoVis.length <= 0 || !this.referenceOntoVis[0]?.id) {
                        this.localNotificationService.error({ message: 'No matching VIS function found' });
                        return;
                    }
                    this.getReferenceOntoData();
                    this.getExampleLinks();
                },
                (err) => {}
                // () => (this.spinner = false)
            );
    }

    private getReferenceOntoData() {
        this.ontoVisService.getExampleOntoDataBindingVisId(this.referenceOntoVis[0].id).subscribe((res: OntoData[]) => {
            console.log('PropagationComponent:getReferenceOntoData: referenceOntoData = ', res);
            this.referenceOntoData = res;
        });
    }

    private getExampleLinks() {
        if (!this.referenceOntoVis || !this.referenceOntoVis[0]?.id) {
            return;
        }

        this.ontoVisService.getReferencePagesBindingVisId(this.referenceOntoVis[0].id).subscribe((res: OntoPageExt[]) => {
            console.log('PropagationComponent:getExampleLinks: exampleLinks = ', res);
            this.exampleLinks = res;
        });
    }

    //
    // Build search from using keywords and data-types from example stream and adding new keywords
    //

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

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    allKeywords!: string[];
    allDataTypes!: string[];

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

        // Mock data
        // this.ontoDataMatchingGroups = this.ontoDataService.getMockMatchingData();
    }

    /**
     * Keyword in search form, the state of the keywords are are,
     * 1 => must, 2 => should, 3 => must not
     */

    keywordSelectionStateMap: any = {};
    selectedKeywords1: string[] = [];
    selectedKeywords2: string[] = [];
    selectedKeywords3: string[] = [];

    getSelectedKeywords(state: SEL_KW_STATE): string[] {
        return Object.keys(this.keywordSelectionStateMap).filter((d) => this.keywordSelectionStateMap[d].state === state);
    }

    onChangeKeywords(_keywordSelectionStateMap: any) {
        this.keywordSelectionStateMap = _keywordSelectionStateMap;
    }

    onClickRemoveKeyword(kw: string) {
        delete this.keywordSelectionStateMap[kw];
    }

    onAddKeyword(event: MatAutocompleteSelectedEvent, state: SEL_KW_STATE): void {
        const kw = event.option.viewValue;
        console.log('onAddKeyword: keyword = ', kw, ', state = ', state);

        this.keywordSelectionStateMap[kw] = { state: state, from: 'nw' };

        // Clear the typed words
        this.keywordInput1.nativeElement.value = '';
        this.keywordInputCtrl1.setValue(null);
        this.keywordInput2.nativeElement.value = '';
        this.keywordInputCtrl2.setValue(null);
        this.keywordInput3.nativeElement.value = '';
        this.keywordInputCtrl3.setValue(null);
    }

    onEnterAddKeyword(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        console.log('onEnterAddKeyword: ', input, value);
        // not implemented
    }


    /**
     * Data-type filter
     */

    datatypeSelectionStateMap: any = {};

    @ViewChild('dataTypeInput') dataTypeInput!: ElementRef<HTMLInputElement>;
    //@ViewChild('auto') matAutocomplete!: MatAutocomplete;
    dataTypeInputCtrl = new FormControl();
    filteredDataTypes$!: Observable<string[]>;

    getSelectedDataTypes(state: SEL_DATATYPE_STATE = 1): string[] {
        return Object.keys(this.datatypeSelectionStateMap).filter((d) => this.datatypeSelectionStateMap[d].state === state);
    }

    onChangeDataTypes(_datatypeSelectionStateMap: any) {
        this.datatypeSelectionStateMap = _datatypeSelectionStateMap;
    }

    onClickRemoveDataType(dt: string) {
        delete this.datatypeSelectionStateMap[dt];
    }

    onInputDataType(event: MatAutocompleteSelectedEvent): void {
        const dt = event.option.viewValue;
        console.log('onInputDataType: dataType = ', dt);

        this.datatypeSelectionStateMap[dt] = { state: SEL_DATATYPE_STATE.FILTER, from: 'nw' };

        this.dataTypeInput.nativeElement.value = '';
        this.dataTypeInputCtrl.setValue(null);
    }

    // not implemented
    onEnterAddDataType(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        console.log('onEnterAddDataTypeChip: ', input, value);
    }

    // Search data result in group
    public discoveredOntoDataGroups!: any; //OntoDataSearchGroup[];
    // Search page result in group
    public ontoPageExtSearchGroups!: OntoPageExtSearchGroup[];

    // Ranking parameters
    public alpha: number = 1.0;
    public beta: number = 0.0;
    public theta: number = 0.0;
    public minimumShouldMatch: number = 1;
    public cluster: boolean = true;
    clusteringAlgorithm: string = 'Spectral Graph';
    clusteringAlgorithms: string[] = ['Brute-force', 'Spectral Graph'];

    public onClickSearchMatchingGroups() {
        if (!this.referenceOntoVis || !this.referenceOntoVis[0]?.id) {
            this.localNotificationService.error({ message: 'Search a VIS function and its reference data streams.' });
        }

        let query = {
            visId: this.referenceOntoVis[0]?.id,
            mustKeys: this.getSelectedKeywords(SEL_KW_STATE.MUST),
            shouldKeys: this.getSelectedKeywords(SEL_KW_STATE.SHOULD),
            mustNotKeys: this.getSelectedKeywords(SEL_KW_STATE.MUST_NOT),
            filterKeys: this.getSelectedDataTypes(),

            minimumShouldMatch: this.minimumShouldMatch,
            alpha: this.alpha,
            beta: this.beta,
            theta: this.theta,
            clusteringAlgorithm: this.clusteringAlgorithm,
        };

        console.log('PropagationComponent:onClickSearchMatchingGroups: query = ', query);

        this.ngxUiLoaderService.start();

        this.ontoDataService
            .searchMatchingGroups(query, this.referenceOntoData)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    this.ngxUiLoaderService.stop();
                    return of([]);
                })
            )
            .subscribe(
                (res: any) => {
                    this.discoveredOntoDataGroups = res;
                    console.log('PropagationComponent:search: onClickSearchMatchingData = ', this.discoveredOntoDataGroups);
                    this.ngxUiLoaderService.stop();
                },
                (err) => {}
                // () => (this.spinner = false)
            );
    }

    // Propagation

    public onClickPropagate(idx: number) {
        if (!this.referenceOntoVis[0]?.id || idx < 0) {
            return;
        }

        const group = this.discoveredOntoDataGroups.splice(idx, 1);
        if (!group[0]) {
            return;
        }

        console.log('PropagationComponent:onClickPropagate: group = ', group);

        const ontoPage: any = {
            pageType: PAGE_TYPE.REVIEW,
            visId: this.referenceOntoVis[0]?.id,
            dataIds: group[0].group.map((d: any) => d.id),
        };

        this.ontoPageService.createPage(ontoPage).subscribe(
            (res: any) => {
                console.log('PropagationComponent:onClickPropagate: res = ', res);
                this.localNotificationService.success({ message: 'Propagated' });
            }
        );
    }

    public onClickRemove(idx: number) {
        if (idx >= 0) {
            let res = this.discoveredOntoDataGroups.splice(idx, 1);
        }
    }

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
