import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { NgxDataTableDataSource } from './ngx-data-table-datasource';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OntoPageService } from '../../services/ontology/onto-page.service';

@Component({
    selector: 'ngx-data-table',
    templateUrl: './ngx-data-table.component.html',
    styles: [
        `
            .detail-table {
                display: flex;
                flex-direction: column;
                display: block;
                margin: 10px;
                width: 100%;
            }
            .expand-icon {
                color: rgba(0, 0, 0, 0.44);
                font-size: 12px;
                margin-right: 5px;
                cursor: pointer;
            }
            .col-value:first-child span {
                margin-left: 15px;
            }
            .mat-form-field {
                padding: 10px 10px 0 10px;
                width: calc(100% - 20px);
            }
        `,
    ],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
            state('expanded', style({ height: '*', visibility: 'visible' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class NgxDataTableComponent {
    @Input() data!: any[];
    // @Input()
    // set data(_data: any[]) {
    //     console.log('NgxDataTableComponent: set data: paginator = ', this.paginator, ', _data = ', _data);
    //     if (_data) {
    //         this.dataSource = new NgxDataTableDataSource(this.paginator, _data, this.sort);
    //         this.displayedColumns = Object.keys(_data[0]).filter((key) => key !== 'details');
    //     }
    // }

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    dataSource!: NgxDataTableDataSource;

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns!: Array<string>;
    expandedElement!: Array<string>;
    isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

    /**
     * expand collapse a row
     * @param row
     */
    toggleRow(row: any) {
        if (this.expandedElement === row) {
            this.expandedElement = null as any;
        } else {
            this.expandedElement = row;
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }


    constructor(private ontoPageService: OntoPageService) {

    }
    ngAfterViewInit(): void {
        console.log('NgxDataTableComponent:ngAfterViewInit: paginator = ', this.paginator, ', data = ', this.data);

        if (this.data) {
            this.dataSource = new NgxDataTableDataSource(this.paginator, this.data, this.sort, this.ontoPageService);
            this.displayedColumns = Object.keys(this.data[0]).filter((key) => key !== 'details');
        }
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //     // this.spinner = false;
    //     console.log('NgxDataTableComponent:ngOnChanges: paginator = ', this.paginator, ', data = ', this.data);

    //     if (changes?.data && this.data) {
    //         this.dataSource = new NgxDataTableDataSource(this.paginator, this.data, this.sort);
    //         this.displayedColumns = Object.keys(this.data[0]).filter((key) => key !== 'details');
    //     }
    // }

}
