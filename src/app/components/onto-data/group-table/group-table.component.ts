import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';

import { TableData } from '../../../models/table.data.interface';
import { OntoData, OntoDataSearchGroup } from '../../../models/ontology/onto-data.model';
import { OntoDataShowComponent } from '../show/show.component';

@Component({
    selector: 'app-onto-data-group-table',
    templateUrl: './group-table.component.html',
    styleUrls: ['./group-table.component.scss'],
})
export class OntoDataGroupTableComponent implements OnInit {
    @Input() data!: OntoDataSearchGroup[];
    @Input() add!: OntoData;

    len!: number;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;

    public dataSource: MatTableDataSource<OntoDataSearchGroup> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['group', 'actions'],
        dataRows: [],
    };
    public spinner: boolean = false;

    constructor(private matDialog: MatDialog) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.add && this.add) {
            console.log('OntoDataGroupTableComponent: ngOnChanges: this.addData = ', this.add);
            // if (this.data.findIndex((d: OntoDataSearchGroup) => d.id === this.add.id) === -1) {
            //     this.data.push(this.add);
            //     this.table.renderRows();
            // }
        }

        if (changes?.data && this.data) {
            console.log('OntoDataGroupTableComponent: ngOnChanges: this.data = ', this.data);

            this.len = this.data.length;
            this.setDataSource();
        }
    }

    private setDataSource(): void {
        this.dataSource.data = this.data;
    }

    public onClickViewData(data: OntoData) {
        const dialogOpt = { width: '40%', data: data };
        this.matDialog.open(OntoDataShowComponent, dialogOpt);
    }

    drop(event: CdkDragDrop<OntoData[]>) {
        const prevIndex = this.data.findIndex((d) => d === event.item.data);
        moveItemInArray(this.data, prevIndex, event.currentIndex);
        this.table.renderRows();

        console.log('OntoDataGroupTableComponent: dropTable: data = ', this.data);
    }

    onClickRemove(row: OntoDataSearchGroup) {
        console.log('OntoDataGroupTableComponent: onClickRemove: row = ', row);

        //const idx = this.data.findIndex((d: OntoDataSearchGroup) => d.id === row.id);
        // if (idx !== -1) {
        //     this.data.splice(idx, 1);
        // }
        this.table.renderRows();
    }
}
