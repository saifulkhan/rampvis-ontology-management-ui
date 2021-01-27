import { Component, EventEmitter, Input, IterableDiffers, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { TableData } from '../../../models/table.data.interface';
import { OntoData, OntoDataSearchGroup } from '../../../models/ontology/onto-data.model';

@Component({
    selector: 'app-onto-data-group-table',
    templateUrl: './group-table.component.html',
    styleUrls: ['./group-table.component.scss'],
})
export class OntoDataGroupTableComponent implements OnInit {
    @Input() data!: OntoDataSearchGroup[];
    @Output() onClickPropagate: EventEmitter<number> = new EventEmitter<number>();
    @Output() onClickRemove: EventEmitter<number> = new EventEmitter<number>();

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

    iterableDiffer!: any;

    constructor(private iterableDiffers: IterableDiffers) {
        this.iterableDiffer = iterableDiffers.find([]).create(null as any);
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /**
     * Detect changes when array is modified
     *  Ref: https://stackoverflow.com/questions/42962394/angular-2-how-to-detect-changes-in-an-array-input-property
     */
    ngDoCheck() {
        if (this.iterableDiffer.diff(this.data)) {
            console.log('OntoDataGroupTableComponent: ngDoCheck: this.data = ', this.data);

            this.len = this.data.length;
            this.setDataSource();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.data && this.data) {
            console.log('OntoDataGroupTableComponent: ngOnChanges: this.data = ', this.data);

            this.len = this.data.length;
            this.setDataSource();
        }
    }

    private setDataSource(): void {
        this.dataSource.data = this.data;
    }

    drop(event: CdkDragDrop<OntoData[]>) {
        const prevIndex = this.data.findIndex((d) => d === event.item.data);
        moveItemInArray(this.data, prevIndex, event.currentIndex);
        this.table.renderRows();

        console.log('OntoDataGroupTableComponent: dropTable: data = ', this.data);
    }
}
