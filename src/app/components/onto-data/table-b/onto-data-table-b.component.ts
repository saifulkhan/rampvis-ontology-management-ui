import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { TableData } from '../../../models/table.data.interface';
import { OntoData } from '../../../models/ontology/onto-data.model';
import { OntoDataInspectComponent } from '../inspect/onto-data-inspect.component';

@Component({
    selector: 'app-onto-data-table-b',
    templateUrl: './onto-data-table-b.component.html',
    styleUrls: ['./onto-data-table-b.component.scss'],
})
export class OntoDataTableBComponent implements OnInit {
    @Input() data!: OntoData[];
    @Input() selectable!: boolean;

    len!: number;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public dataSource: MatTableDataSource<OntoData> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['index', 'endpoint', 'dataType', 'description', 'keywords'],
        dataRows: [],
    };

    constructor(private matDialog: MatDialog) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.data && this.data) {
            this.len = this.data.length;
            this.setDataSource();
        }
    }

    private setDataSource(): void {
        this.dataSource.data = this.data;
    }

    public onClickViewData(data: OntoData) {
        const dialogOpt = { width: '40%', data: data };
        this.matDialog.open(OntoDataInspectComponent, dialogOpt);
    }
}
