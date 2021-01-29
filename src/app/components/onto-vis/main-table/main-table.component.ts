import { Component, Input, OnInit, Output, ViewChild, EventEmitter, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { TableData } from '../../../models/table.data.interface';
import { OntoVis } from '../../../models/ontology/onto-vis.model';

@Component({
    selector: 'app-onto-vis-main-table',
    templateUrl: './main-table.component.html',
    styleUrls: ['./main-table.component.scss'],
})
export class OntoVisMainTableComponent implements OnInit {
    @Input() data!: OntoVis[];
    @Input() length!: number;
    @Input() editable!: boolean;
    @Input() selectable!: boolean;
    @Output() onClickCreate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClickEdit: EventEmitter<OntoVis> = new EventEmitter<OntoVis>();
    @Output() onClickDelete: EventEmitter<OntoVis> = new EventEmitter<OntoVis>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public dataSource: MatTableDataSource<OntoVis> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['function', 'type', 'dataTypes', 'description', 'actions', 'select'],
        dataRows: [],
    };

    public selection = new SelectionModel<OntoVis>(true, []);
    public spinner = false;

    public filterTerm!: string;

    constructor() {
        this.spinner = true;
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.data && this.data) {
            this.setDataSource();
        }
    }

    public filterDataSource(): void {
        this.dataSource.filter = this.filterTerm.trim().toLowerCase();
    }

    private setDataSource(): void {
        this.dataSource.data = this.data;
        this.spinner = false;
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

    public getSelection(): OntoVis[] {
        return this.selection.selected;
    }
}
