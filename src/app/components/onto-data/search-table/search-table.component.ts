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
import { OntoDataShowComponent } from '../show/show.component';
import { OntoDataSearch } from '../../../models/ontology/onto-data.model';
import { OntoDataSearchFilterVm } from '../../../models/ontology/onto-data-search-filter.vm';

@Component({
    selector: 'app-onto-data-search-table',
    templateUrl: './search-table.component.html',
    styleUrls: ['./search-table.component.scss'],
})
export class OntoDataSearchTableComponent implements OnInit {
    @Input() data!: OntoDataSearch[];
    @Input() length!: number;
    @Input() searchable!: boolean;
    @Input() showBindings!: boolean;
    @Input() canAddToBasket!: boolean;
    @Input() selectable!: boolean;
    @Output() onClickAddToBasket: EventEmitter<OntoDataSearch> = new EventEmitter<OntoDataSearch>();

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

    public filterTerm!: string;

    constructor(private router: Router, private matDialog: MatDialog) {
        this.spinner = true;
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('OntoDataSearchTableComponent:ngOnChanges: data = ', this.data);
        if (changes?.data && this.data) {
            this.setDataSource();
        }
    }

    public filterDataSource(): void {
        this.dataSource.filter = this.filterTerm.trim().toLowerCase();
    }

    private setDataSource(): void {
        console.log('OntoDataSearchTableComponent:setDataSource: data = ', this.data);
        this.dataSource.data = this.data;
        this.spinner = false;
    }

    public onClickViewData(data: OntoDataSearch) {
        const dialogOpt = { width: '40%', data: data };
        this.matDialog.open(OntoDataShowComponent, dialogOpt);
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
