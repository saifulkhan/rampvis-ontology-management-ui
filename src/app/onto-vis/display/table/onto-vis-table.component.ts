import { Component, Input, OnInit, Output, ViewChild, EventEmitter, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { TableData } from '../../../models/table.data.interface';
import { OntoVis } from '../../../models/ontology/onto-vis.model';

@Component({
    selector: 'app-onto-vis-table',
    templateUrl: './onto-vis-table.component.html',
    styleUrls: ['./onto-vis-table.component.scss'],
})
export class OntoVisTableComponent implements OnInit {
    @Input() ontoVisArr!: OntoVis[];
    @Input() ontoVisArrLength!: number;
    @Output() onClickEditOntoVis: EventEmitter<OntoVis> = new EventEmitter<OntoVis>();
    @Output() onClickDeleteOntoVis: EventEmitter<OntoVis> = new EventEmitter<OntoVis>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public tableDataSource: MatTableDataSource<OntoVis> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['id', 'function', 'type', 'dataTypes', 'description', 'actions'],
        dataRows: [],
    };
    spinner = false;
    public searchTerm!: string;

    constructor() {}

    ngOnInit(): void {
        this.spinner = true;
    }

    ngAfterViewInit(): void {
        this.tableDataSource.paginator = this.paginator;
        this.tableDataSource.sort = this.sort;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.ontoVisArr) {
            this.setDataSource();
        }
    }

    public filterDataSource(): void {
        this.tableDataSource.filter = this.searchTerm.trim().toLowerCase();
    }

    private setDataSource(): void {
        this.tableDataSource.data = this.ontoVisArr;
        this.spinner = false;
    }
}
