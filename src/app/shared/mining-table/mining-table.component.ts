import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { merge } from 'rxjs';
import { MatSort } from '@angular/material/sort';

import { Mining } from '../../shared/models/mining.model';
import { TableData } from '../models/table.data.interface';
 
@Component({
    selector: 'app-mining-table',
    templateUrl: './mining-table.component.html',
    styleUrls: ['./mining-table.component.scss'],
})
export class MiningTableComponent implements OnChanges, AfterViewInit, OnChanges {
    @Input() data: Array<Mining>;
    @Output() check: EventEmitter<string> = new EventEmitter<string>()
    @Output() showPdf: EventEmitter<string> = new EventEmitter<string>()
    @Output() remove: EventEmitter<string> = new EventEmitter<string>()

    dataSource: MatTableDataSource<Mining> = new MatTableDataSource([]);;
    public dataTable: TableData = {
        headerRow: ['type', 'title', 'tags', 'minedOn', 'updatedOn', 'by', 'actions'],
        dataRows: [],
    };
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    public searchTerm: string;
    spinner = false;

    constructor() {}

    ngOnInit(): void {}
    
    ngAfterViewInit(): void {
        merge(this.sort.sortChange, this.paginator.page).subscribe((data) => {
            // API call to get page/sorted data
            console.log('API call to get page/sorted data', { data });
        });
    }

    ngOnChanges() {
        this.setDataSource()
    }
   
    public filterDataSource(): void {
        this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    }


    private setDataSource(): void {
        this.dataSource = new MatTableDataSource<Mining>(this.data);

        this.dataSource.filterPredicate = (event: any, filter: string) => {
            const queryList = filter.split(' ');
            const results = queryList.map((query) => this.searchObjectForQuery(event, query));
            return results.includes(false) ? false : true;
        };
        this.spinner = false;
    }

    private searchObjectForQuery(object: Mining, filter: string): boolean {
        // debug console.log('searchObjectForQuery: object = ', object, ', filter = ', filter);
        const title = object.source.title.toLowerCase();
        const tags = object.collection.tags.map((d) => d.toLowerCase()).join(" ");
        return title.includes(filter) || tags.includes(filter) ? true : false;
    }
}
