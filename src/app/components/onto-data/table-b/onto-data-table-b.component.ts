import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';

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
    @Input() add!: OntoData;
    @Input() editBasket!: boolean;

    len!: number;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;

    public dataSource: MatTableDataSource<OntoData> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['index', 'endpoint', 'dataType', 'description', 'keywords', 'actions'],
        dataRows: [],
    };

    constructor(private matDialog: MatDialog) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.add && this.add) {
            console.log('OntoDataTableBComponent: ngOnChanges: this.addData = ', this.add);
            if (this.data.findIndex((d: OntoData) => d.id === this.add.id) === -1) {
                this.data.push(this.add);
                this.table.renderRows();
            }
        }

        if (changes?.data && this.data) {
            console.log('OntoDataTableBComponent: ngOnChanges: this.data = ', this.data);

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

    drop(event: CdkDragDrop<OntoData[]>) {
        const prevIndex = this.data.findIndex((d) => d === event.item.data);
        moveItemInArray(this.data, prevIndex, event.currentIndex);
        this.table.renderRows();

        console.log('OntoDataTableBComponent: dropTable: data = ', this.data);
    }

    onClickRemove(row: OntoData) {
        console.log('OntoDataTableBComponent: onClickRemove: row = ', row);

        const idx = this.data.findIndex((d: OntoData) => d.id === row.id);
        if (idx !== -1) {
            this.data.splice(idx, 1);
        }
        this.table.renderRows();
    }
}
