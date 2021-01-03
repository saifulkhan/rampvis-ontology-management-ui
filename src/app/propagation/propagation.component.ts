import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { OntoVis } from '../models/ontology/onto-vis.model';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { DATA_TYPE } from '../models/ontology/onto-data-types';
import { OntoData, OntoDataSearch } from '../models/ontology/onto-data.model';
import { OntoDataFilterVm } from '../models/ontology/onto-data-filter.vm';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustomSingleSelectionData } from '../components/custom-single-selection/custom-single-selection.component';

@Component({
    selector: 'app-propagation',
    templateUrl: './propagation.component.html',
    styleUrls: ['./propagation.component.scss'],
})
export class PropagationComponent implements OnInit {
    // Vis: All VIS function for dropdown and the selected VIS as array
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

    constructor(
        private route: ActivatedRoute,
        private ontoVisService: OntoVisService,
        private ontoDataService: OntoDataService
    ) {
        this.dataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);

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
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            console.log('PropagationComponent: ngOnInit: route releaseType = ', this.route.snapshot.params.releaseType);
            this.filterPublishType$.next(this.route.snapshot.params.releaseType);
        });
        this.getAllOntoVis();
    }

    ngAfterViewInit(): void {}

    public search() {
        console.log('PropagationComponent: search: searchQuery = ', this.searchQuery);

        if (!this.searchQuery || this.searchQuery === ' ') {
            this.clearDataSearch();
            return;
        }

        this.ontoDataService.search(this.searchQuery, this.dataType).subscribe(
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
        this.suggestedList = [];
    }

    //
    // Vis
    //
    public onSelectOntoVis(value: any) {
        console.log('PropagationComponent:onSelectOntoVis: value = ', value);
        this.getOntoVis(value);
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

    private getOntoVis(visId: string) {
        this.ontoVisService.getOntoVis(visId).subscribe((res: OntoVis) => {
            if (res) {
                this.ontoVisArr = [res];
                this.ontoVisArrLen = this.ontoVisArr.length;
                console.log('PropagationComponent: getOntoVis: ontoVisArr = ', this.ontoVisArr);

                // TODO:
                this.ontoVisService.getExamplePagesBindingVisId(visId).subscribe((ontoData: OntoData[]) => {
                    console.log('PropagationComponent: getOntoVis: ontoData = ', ontoData);
                    this.ontoDataArr = ontoData;
                    this.ontoDataArrLen = this.ontoDataArr.length;
                });
            }
        });
    }

    public onClickEdit(vis: OntoVis): void {}
    public onClickDelete(visId: string): void {}

    //
    // Data
    //

    public optionSelected(input: HTMLInputElement) {
        input.blur();
        input.setSelectionRange(0, 0);
        input.focus();
    }

    public getOntoData(ontoDataFilter: OntoDataFilterVm) {}
}
