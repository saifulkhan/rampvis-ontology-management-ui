import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs/internal/observable/of';

import { OntoPageExt } from '../../models/ontology/onto-page.model';
import { OntoPageService } from '../../services/ontology/onto-page.service';
import { OntoData, OntoDataSearch } from '../../models/ontology/onto-data.model';
import { DATA_TYPE } from '../../models/ontology/onto-data-types';
import { OntoDataService } from '../../services/ontology/onto-data.service';
import { OntoDataSearchFilterVm } from '../../models/ontology/onto-data-search-filter.vm';
import { ErrorHandler2Service } from '../../services/error-handler-2.service';
import { OntoVisSearch } from '../../models/ontology/onto-vis.model';
import { OntoVisSearchFilterVm } from '../../models/ontology/onto-vis-search-filter.vm';
import { OntoVisService } from '../../services/ontology/onto-vis.service';
import { LocalNotificationService } from '../../services/local-notification.service';


@Component({
    selector: 'app-onto-page',
    templateUrl: './onto-page.component.html',
    styleUrls: ['./onto-page.component.scss'],
})
export class OntoPageComponent implements OnInit {
    pageId!: string;
    ontoPageExt!: OntoPageExt;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private ontoVisService: OntoVisService,
        private ontoDataService: OntoDataService,
        private ontoPageService: OntoPageService,
        private errorHandler2Service: ErrorHandler2Service,
        private localNotificationService: LocalNotificationService,
    ) {}

    ngOnInit(): void {
        this.pageId = this.route.snapshot.params.pageId;
        this.ontoPageExt = this.route.snapshot.data.ontoPageExt;

        console.log('OntoPageBindingsComponent:ngOnInit: pageId = ', this.pageId, ', ontoPageExt = ', this.ontoPageExt);

        this.ngOnInit_OntoDataSearchAndAddToBasket();
        this.ngOnInit_OntoVisSearchAndSelect();
    }

    //
    // VIS
    //
    public ontoVisSearchFormGroup!: FormGroup;
    public searchOntoVisQuery!: string;
    public highlightOntoVisSearchSuggestion!: string;
    public suggestedOntoVis!: OntoVisSearch[];
    public ontoVisSearchResult!: OntoVisSearch[];

    private ngOnInit_OntoVisSearchAndSelect() {
        if (this.ontoPageExt?.vis) {
            this.ontoVisSearchResult = [this.ontoPageExt?.vis as any];
        }

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
                    console.log('OntoPageBindingsComponent: suggestedOntoVis = ', this.suggestedOntoVis);
                });
            });
    }

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

        console.log('OntoPageBindingsComponent: onClickSearchOntoVis: ontoVisSearchFilterVm = ', ontoVisSearchFilterVm);

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
                    console.log('OntoPageBindingsComponent:searchOntoVis: ontoVisSearchResult = ', this.ontoVisSearchResult);
                },
                (err) => {}
                // () => (this.spinner = false)
            );
    }

    //
    // Data
    //

    public ontoDataSearchFormGroup!: FormGroup;
    dataTypes: string[] = [];
    suggestedOntoData!: OntoDataSearch[];
    highlightOntoDataSearchSuggestion!: string;
    public ontoDataSearchResult: OntoData[] = [];
    public ontoDataSearchResultTotalCount: number = 0;

    public ontoDataBasket: OntoData[] = [];

    private ngOnInit_OntoDataSearchAndAddToBasket() {
        this.ontoDataBasket = this.ontoPageExt?.data;

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
                    console.log('OntoPageBindingsComponent: suggestedOntoData = ', this.suggestedOntoData);
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
                this.ontoDataSearchFormGroup.value.ontoDataSearchDataType === "Select All"
                    ? null
                    : this.ontoDataSearchFormGroup.value.ontoDataSearchDataType,
        } as OntoDataSearchFilterVm;

        console.log('OntoPageBindingsComponent: onClickSearchOntoData: ontoDataSearchFilterVm = ', ontoDataSearchFilterVm);

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
                    console.log('OntoPageBindingsComponent:search: ontoDataSearchResult = ', this.ontoDataSearchResult);
                },
                (err) => {}
                // () => (this.spinner = false)
            );
    }

    // add data to basket
    addData!: OntoData;
    public addOntoDataToBasket(row: OntoData) {
        console.log('OntoPageBindingsComponent:addOntoDataToBasket: row = ', row);
        this.addData = row;
        console.log('OntoPageBindingsComponent:addOntoDataToBasket: ontoDataBasket = ', this.ontoDataBasket);
    }

    public optionSelected(input: HTMLInputElement) {
        input.blur();
        input.setSelectionRange(0, 0);
        input.focus();
    }

    public onClickSaveData() {
        const dataIds = this.ontoDataBasket.map(d => d.id);
        this.ontoPageService.updatePageDataIds(this.pageId, dataIds).subscribe(res => {
            if (res.modifiedCount) {
                this.localNotificationService.success({ message: `Updated ${res.modifiedCount} page` });
            }
        });
    }
}
