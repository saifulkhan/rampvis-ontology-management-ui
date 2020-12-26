import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, merge } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';

import { OntoPageFilterVm } from '../../../models/ontology/onto-page-filter.vm';
import { TableData } from '../../../models/table.data.interface';
import { OntoPage, BINDING_TYPE } from '../../../models/ontology/onto-page.model';

@Component({
    selector: 'app-onto-page-table',
    templateUrl: './onto-page-table.component.html',
    styleUrls: ['./onto-page-table.component.scss'],
})
export class OntoPageTableComponent implements OnInit {
    @Input() data!: OntoPage[];
    @Input() len!: number;
    @Input() isEditable!: boolean;
    @Output() onClickCreate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClickEdit: EventEmitter<OntoPage> = new EventEmitter<OntoPage>();
    @Output() onClickDelete: EventEmitter<OntoPage> = new EventEmitter<OntoPage>();
    @Output() fetchFilteredData: EventEmitter<OntoPageFilterVm> = new EventEmitter<OntoPageFilterVm>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public tableDataSource: MatTableDataSource<OntoPage> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['date', 'bindings', 'actions'],
        dataRows: [],
    };
    spinner = false;

    filterTerm$ = new BehaviorSubject<string>('');
    filterType$ = new BehaviorSubject<string>(''); // dropdown filter not implemented yet

    constructor(private matDialog: MatDialog) {}

    ngOnInit(): void {
        this.spinner = true;
        this.clearTableData();

        this.filterTerm$.next(null as any);
        this.filterType$.next(null as any);
    }

    ngAfterViewInit(): void {
        this.tableDataSource.paginator = this.paginator;
        this.tableDataSource.sort = this.sort;

        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
        });

        merge(this.sort.sortChange, this.paginator.page, this.filterTerm$, this.filterType$)
            .pipe(
                tap(() => {
                    if (!this.spinner) {
                        this.spinner = true;
                        this.clearTableData();
                    }
                }),
                startWith(null),
                debounceTime(1000)
            )
            .subscribe((res) => {
                const ontoPageFilterVm = {
                    page: this.paginator.pageIndex,
                    pageCount: this.paginator.pageSize,
                    sortBy: this.sort.active,
                    sortOrder: this.sort.direction,
                    bindingType: this.filterType$.value as BINDING_TYPE, // always null, not implemented here
                    filter: this.filterTerm$.value,
                } as OntoPageFilterVm;

                console.log('OntoPageTableComponent:ngAfterViewInit: ontoPageFilterVm = ', ontoPageFilterVm);
                this.fetchFilteredData.emit(ontoPageFilterVm);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.spinner = false;

        if (changes?.data) {
            this.setDataSource();
        }
    }

    private setDataSource(): void {
        this.tableDataSource.data = this.data;
        this.spinner = false;
    }

    private clearTableData(): void {
        if (this.tableDataSource) {
            this.tableDataSource.data = [];
        }
    }
}
