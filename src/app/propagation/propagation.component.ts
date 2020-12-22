import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, mergeMap, startWith } from 'rxjs/operators';

import { TableData } from '../models/table.data.interface';
import { LocalNotificationService } from '../services/common/local-notification.service';
import { DialogService } from '../services/common/dialog.service';
import { OntoVis } from '../models/ontology/onto-vis.model';
import { OntoVisService } from '../services/ontology/onto-vis.service';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { DATA_TYPE } from '../models/ontology/onto-data-types';
import { OntoDataSearch } from '../models/ontology/onto-data.model';

@Component({
    selector: 'app-propagation',
    templateUrl: './propagation.component.html',
    styleUrls: ['./propagation.component.scss'],
})
export class PropagationComponent implements OnInit {
    public ontoVisArr: OntoVis[] = [];
    public ontoVisArrLength!: number;
    public ontoVisArrLength$: ReplaySubject<OntoVis[]> = new ReplaySubject<OntoVis[]>(1);
    spinner = false;


    // TO REVIEW
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public tableDataSource: MatTableDataSource<OntoVis> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['id', 'function', 'type', 'dataTypes', 'description', 'actions'],
        dataRows: [],
    };

    public visList: OntoVis[] = [];
    public visList$: ReplaySubject<OntoVis[]> = new ReplaySubject<OntoVis[]>(1);
    loading = false;

    public searchTerm!: string;

    filterPublishType$ = new BehaviorSubject<string>('');

    searchForm: FormControl = new FormControl();
    dataTypes: string[] = [];
    dataType!: DATA_TYPE;
    searchQuery!: string;
    suggestedList: OntoDataSearch[] = [];
    searchResults: any = [];
    toHighlight: string = '';


    constructor(
        private route: ActivatedRoute,
        private ontoVisService: OntoVisService,
        private ontoDataService: OntoDataService
    ) {


        this.dataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);

        this.searchForm.valueChanges.subscribe((query) => {
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

        this.loadVisList();
    }

    ngAfterViewInit(): void {
        this.tableDataSource.paginator = this.paginator;
        this.tableDataSource.sort = this.sort;
    }

    
    public search() {
        console.log('PropagationComponent: search: searchQuery = ', this.searchQuery);

        if (!this.searchQuery || this.searchQuery === ' ') {
            return;
        }
        this.spinner = true;
        this.clearResults();

        this.ontoDataService.search(this.searchQuery, this.dataType).subscribe(
            (result) => {
                this.searchResults = result;
                // this.filteredSearchResults = result.filter((f) => f);
                console.log('PropagationComponent: search: searchResults = ', this.searchResults);
            },
            (err) => {},
            () => (this.spinner = false)
        );
    }

    private loadVisList() {
        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.visList = [...res];
                this.visList$.next(res.slice());
                this.setTableData(this.visList);
                console.log( 'PropagationComponent: loadVisList: visList = ', this.visList );
            }
        });
    }

    public onSelectOntoVis(value: any) {
        console.log('PropagationComponent:onSelectVisId: value = ', value);

        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.ontoVisArr = res;
                this.ontoVisArrLength = res.length;
                this.setTableData(this.ontoVisArr);
                console.log('PropagationComponent: loadVisList: visList = ', this.ontoVisArr);
                this.loading = true;
            }
        });
    }

    private setTableData(sources: Array<OntoVis>): void {
        this.tableDataSource.data = sources;
    }
 

    private clearResults(): void {
        this.searchResults.splice(0, this.searchResults.length);
        // this.filteredSearchResults.splice(0, this.filteredSearchResults.length);
        // this.filterValue = "";
    }

    public filterDataSource(): void {
        this.tableDataSource.filter = this.searchTerm.trim().toLowerCase();
    }


    optionSelected(input: HTMLInputElement) {
        input.blur();
        input.setSelectionRange(0, 0);
        input.focus();
    }

    public onClickEdit(vis: OntoVis): void {}
    public onClickDelete(visId: string): void {}
}
