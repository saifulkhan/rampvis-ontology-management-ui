import { Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, mergeMap, startWith, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

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
    @Input() data!: OntoData[];
    @Input() len!: number;
    @Input() isEditable!: boolean;
    @Output() onClickCreate: EventEmitter<OntoData> = new EventEmitter<OntoData>();
    @Output() onClickEdit: EventEmitter<OntoData> = new EventEmitter<OntoData>();
    @Output() onClickDelete: EventEmitter<OntoData> = new EventEmitter<OntoData>();
    @Output() fetchFilteredData: EventEmitter<OntoDataFilterVm> = new EventEmitter<OntoDataFilterVm>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public dataSource: MatTableDataSource<OntoData> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['date', 'urlCode', 'endpoint', 'description', 'dataType', 'keywords', 'actions'],
        dataRows: [],
    };
    spinner = false;

    filterTerm$ = new BehaviorSubject<string>('');
    filterType$ = new BehaviorSubject<string>(''); // dropdown filter not implemented yet

    selection = new SelectionModel<OntoData>(true, []);

    constructor(private matDialog: MatDialog) {}

    ngOnInit(): void {
        this.spinner = true;
        this.clearDataSource();

        this.filterTerm$.next(null as any);
        this.filterType$.next(null as any);
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
        });

        merge(this.sort.sortChange, this.paginator.page, this.filterTerm$, this.filterType$)
            .pipe(
                tap(() => {
                    if (!this.spinner) {
                        this.spinner = true;
                        this.clearDataSource();
                    }
                }),
                startWith(null),
                debounceTime(1000)
            )
            .subscribe((res) => {
                const ontoDataFilter = {
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    sortBy: this.sort.active,
                    sortOrder: this.sort.direction,
                    dataType: this.filterType$.value,
                    filter: this.filterTerm$.value,
                } as OntoDataFilterVm;

                console.log('OntoDataTableComponent:ngAfterViewInit: ontoDataFilter = ', ontoDataFilter);
                this.fetchFilteredData.emit(ontoDataFilter);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.spinner = false;

        if (changes?.data) {
            this.setDataSource();
        }
    }

    private setDataSource(): void {
        this.dataSource.data = this.data;
        this.spinner = false;
    }

    private clearDataSource(): void {
        if (this.dataSource) {
            this.dataSource.data = [];
        }
    }

    public onClickViewData(data: OntoData) {
        const dialogOpt = { width: '40%', data: data };
        this.matDialog.open(OntoDataInspectComponent, dialogOpt);
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: OntoData): string {
        console.log('OntoDataTableComponent: row = ', row);
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
    }
}
