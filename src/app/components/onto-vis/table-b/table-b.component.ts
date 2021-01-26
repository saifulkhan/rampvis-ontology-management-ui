import { Component, Input, OnInit, Output, ViewChild, EventEmitter, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { TableData } from '../../../models/table.data.interface';
import { OntoVis } from '../../../models/ontology/onto-vis.model';

@Component({
    selector: 'app-onto-vis-table-b',
    templateUrl: './table-b.component.html',
    styleUrls: ['./table-b.component.scss'],
})
export class OntoVisTableBComponent implements OnInit {
    @Input() data!: OntoVis[];

    len!: number;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public dataSource: MatTableDataSource<OntoVis> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['index', 'function', 'type', 'dataTypes', 'description', 'actions'],
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
        this.len = this.data.length;

        this.spinner = false;
    }
}
