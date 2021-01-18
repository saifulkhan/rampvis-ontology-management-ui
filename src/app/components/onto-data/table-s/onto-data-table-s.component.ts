import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, merge } from 'rxjs';
import { debounceTime, delay, startWith, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

import { TableData } from '../../../models/table.data.interface';
import { OntoDataInspectComponent } from '../inspect/onto-data-inspect.component';
import { OntoDataSearch } from '../../../models/ontology/onto-data.model';
import { OntoDataSearchFilterVm } from '../../../models/ontology/onto-data-search-filter.vm';

@Component({
    selector: 'app-onto-data-table-s',
    templateUrl: './onto-data-table-s.component.html',
    styleUrls: ['./onto-data-table-s.component.scss'],
})
export class OntoDataTableSComponent implements OnInit {
    @Input() data!: OntoDataSearch[];
    @Input() length!: number;
    @Input() searchable!: boolean;
    @Input() showBindings!: boolean;
    @Input() canAddToBasket!: boolean;
    @Input() selectable!: boolean;
    @Output() onClickCreate: EventEmitter<OntoDataSearch> = new EventEmitter<OntoDataSearch>();
    @Output() onClickEdit: EventEmitter<OntoDataSearch> = new EventEmitter<OntoDataSearch>();
    @Output() onClickDelete: EventEmitter<OntoDataSearch> = new EventEmitter<OntoDataSearch>();
    @Output() onClickAddToBasket: EventEmitter<OntoDataSearch> = new EventEmitter<OntoDataSearch>();
    @Output() fetchFilteredData: EventEmitter<OntoDataSearchFilterVm> = new EventEmitter<OntoDataSearchFilterVm>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;

    public dataSource: MatTableDataSource<OntoDataSearch> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['score', 'endpoint', 'dataType', 'description', 'keywords', 'date', 'binding', 'actions'],
        dataRows: [],
    };

    public selection = new SelectionModel<OntoDataSearch>(true, []);
    public spinner = false;

    filterTerm$ = new BehaviorSubject<string>('');
    filterType$ = new BehaviorSubject<string>(''); // dropdown filter not implemented yet

    constructor(private router: Router, private matDialog: MatDialog) {
    }

    ngOnInit(): void {
        this.clearDataSource();
        this.spinner = true;

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
                const ontoDataSearchFilter = {
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    sortBy: this.sort.active,
                    sortOrder: this.sort.direction,
                    dataType: this.filterType$.value,
                    filter: this.filterTerm$.value,
                } as OntoDataSearchFilterVm;

                console.log('OntoDataTableComponentA:ngAfterViewInit: ontoDataFilter = ', ontoDataSearchFilter);
                this.fetchFilteredData.emit(ontoDataSearchFilter);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('OntoDataTableComponentA:ngOnChanges: data = ', this.data);

        if (changes?.data && this.data) {
            this.setDataSource();
        }
    }

    private setDataSource(): void {
        console.log('OntoDataTableComponentA:setDataSource: data = ', this.data);
        this.dataSource.data = this.data;

        this.spinner = false;
        console.log('OntoDataTableComponentA:setDataSource: data = ', this.dataSource.data);
    }

    private clearDataSource(): void {
        if (this.dataSource) {
            this.dataSource.data = [];
        }
    }

    public onClickViewData(data: OntoDataSearch) {
        const dialogOpt = { width: '40%', data: data };
        this.matDialog.open(OntoDataInspectComponent, dialogOpt);
    }

    public onClickShowBindings(pageId: string) {
        const url = this.router.serializeUrl(this.router.createUrlTree(['pages', 'page', `${pageId}`]));
        window.open(url, '_blank');
    }

    //
    // Select
    //

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
    checkboxLabel(row?: OntoDataSearch): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
    }

    public getSelection(): OntoDataSearch[] {
        return this.selection.selected;
    }
}
