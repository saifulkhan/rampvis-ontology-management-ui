import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';

import { TableData } from '../../../models/table.data.interface';
import { OntoData } from '../../../models/ontology/onto-data.model';
import { OntoDataShowComponent } from '../show/show.component';

@Component({
    selector: 'app-onto-data-matched',
    templateUrl: './matched.component.html',
    styleUrls: ['./matched.component.scss'],
})
export class OntoDataMatchedComponent implements OnInit {
    @Input() data!: OntoData[];
    @Input() selectable!: boolean;
    @Input() add!: OntoData;
    @Input() editBasket!: boolean;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;

    public dataSource: MatTableDataSource<OntoData> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['index', 'keywords', 'dataType', 'description', 'actions'],
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
            // console.log('OntoDataMatchedComponent: ngOnChanges: this.addData = ', this.add);
            if (this.data.findIndex((d: OntoData) => d.id === this.add.id) === -1) {
                this.data.push(this.add);
                this.table.renderRows();
            }
        }

        if (changes?.data && this.data) {
            // console.log('OntoDataMatchedComponent: ngOnChanges: this.data = ', this.data);
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

        console.log('OntoDataMatchedComponent: dropTable: data = ', this.data);
    }

    onClickRemove(row: OntoData) {
        console.log('OntoDataMatchedComponent: onClickRemove: row = ', row);

        const idx = this.data.findIndex((d: OntoData) => d.id === row.id);
        if (idx !== -1) {
            this.data.splice(idx, 1);
        }
        this.table.renderRows();
    }
}
