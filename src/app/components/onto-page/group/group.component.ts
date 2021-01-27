import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { TableData } from '../../../models/table.data.interface';
import { OntoPageExt } from '../../../models/ontology/onto-page.model';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-onto-page-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class OntoPageGroupComponent implements OnInit {
    @Input() data!: OntoPageExt[];
    @Input() selectable!: boolean;
    @Input() add!: OntoPageExt;
    @Input() editBasket!: boolean;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;

    public dataSource: MatTableDataSource<OntoPageExt> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['index', 'link', 'bindings', 'actions'],
        dataRows: [],
    };

    isTableExpanded = false;
    expandedElement: OntoPageExt[] = [];

    public visURL = environment.components.VIS_URL;

    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        console.log('OntoPageGroupComponent:', this.data)
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.add && this.add) {
            console.log('OntoPageGroupComponent: ngOnChanges: this.addData = ', this.add);
            if (this.data.findIndex((d: OntoPageExt) => d.id === this.add.id) === -1) {
                this.data.push(this.add);
                this.table.renderRows();
            }
        }

        if (changes?.data && this.data) {
            console.log('OntoPageGroupComponent: ngOnChanges: this.data = ', this.data);
            this.setDataSource();
        }
    }

    private setDataSource(): void {
        this.dataSource.data = this.data;
    }


    //
    // Toggle Rows
    //

    checkExpanded(element: any): boolean {
        let flag = false;
        this.expandedElement.forEach((e) => {
            if (e === element) {
                flag = true;
            }
        });
        return flag;
    }

    pushPopElement(element: any) {
        const index = this.expandedElement.indexOf(element);
        // console.log(index, element);

        if (index === -1) {
            this.expandedElement.push(element);
        } else {
            this.expandedElement.splice(index, 1);
        }
    }

    //



    drop(event: CdkDragDrop<OntoPageExt[]>) {
        const prevIndex = this.data.findIndex((d) => d === event.item.data);
        moveItemInArray(this.data, prevIndex, event.currentIndex);
        this.table.renderRows();

        console.log('OntoDataGroupComponent: dropTable: data = ', this.data);
    }

    onClickRemove(row: OntoPageExt) {
        console.log('OntoDataGroupComponent: onClickRemove: row = ', row);

        const idx = this.data.findIndex((d: OntoPageExt) => d.id === row.id);
        if (idx !== -1) {
            this.data.splice(idx, 1);
        }
        this.table.renderRows();
    }

    public onClickNavigatePage(pageId: string) {
        let link = `${this.visURL}/${pageId}`;
        window.open(link, '_blank');
    }
}
