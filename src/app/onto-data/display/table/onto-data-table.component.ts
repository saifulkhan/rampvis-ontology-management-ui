import { Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, mergeMap, startWith, tap } from 'rxjs/operators';

import { TableData } from '../../../models/table.data.interface';
import { OntoData } from '../../../models/ontology/onto-data.model';
import { OntoDataFilterVm } from '../../../models/ontology/onto-data-filter.vm';
import { OntoDataInspectComponent } from '../inspect/onto-data-inspect.component';

@Component({
    selector: 'app-onto-data-table',
    templateUrl: './onto-data-table.component.html',
    styleUrls: ['./onto-data-table.component.scss'],
})
export class OntoDataTableComponent implements OnInit {
    @Input() ontoDataArr!: OntoData[];
    @Input() ontoDataArrLength!: number;
    @Input() isEditable!: boolean;
    @Output() onClickEditOntoData: EventEmitter<OntoData> = new EventEmitter<OntoData>();
    @Output() onClickDeleteOntoData: EventEmitter<OntoData> = new EventEmitter<OntoData>();
    @Output() fetchOntoData: EventEmitter<OntoDataFilterVm> = new EventEmitter<OntoDataFilterVm>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public tableDataSource: MatTableDataSource<OntoData> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['id', 'date', 'urlCode', 'endpoint', 'description', 'dataType', 'keywords', 'actions'],
        dataRows: [],
    };
    spinner = false;

    filterTerm$ = new BehaviorSubject<string>('');
    filterDataType$ = new BehaviorSubject<string>(''); // dropdown filter not implemented yet

    constructor(private matDialog: MatDialog) {}

    ngOnInit(): void {
        // this.spinner = true;
        this.clearDataSource();

        this.filterTerm$.next(null as any);
        this.filterDataType$.next(null as any);
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
        });

        console.log('OntoDataTableComponent:ngAfterViewInit:');

        merge(this.sort.sortChange, this.paginator.page, this.filterTerm$, this.filterDataType$)
            .pipe(
                tap(() => {
                    if (!this.spinner) {
                        //this.spinner = true;
                        this.clearDataSource();
                    }
                }),
                startWith(null),
                debounceTime(1000)
            )
            .subscribe((res) => {
                const ontoDataFilter = {
                    page: this.paginator.pageIndex,
                    pageCount: this.paginator.pageSize,
                    sortBy: this.sort.active,
                    sortOrder: this.sort.direction,
                    dataType: this.filterDataType$.value,
                    filter: this.filterTerm$.value,
                } as OntoDataFilterVm;

                console.log('OntoDataTableComponent:ngAfterViewInit: ontoDataFilter = ', ontoDataFilter);

                this.fetchOntoData.emit(ontoDataFilter);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.spinner = false;

        if (changes?.ontoDataArr) {
            this.setDataSource();
        }
    }

    public onClickViewData(data: OntoData) {
        const dialogOpt = { width: '40%', data: data };
        this.matDialog.open(OntoDataInspectComponent, dialogOpt);
    }

    private setDataSource(): void {
        this.tableDataSource.data = this.ontoDataArr;
        this.spinner = false;
    }

    private clearDataSource(): void {
        if (this.tableDataSource) {
            this.tableDataSource.data = [];
        }
    }
}
