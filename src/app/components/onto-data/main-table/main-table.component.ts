import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, merge } from 'rxjs';
import { debounceTime, delay, startWith, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

import { TableData } from '../../../models/table.data.interface';
import { OntoData } from '../../../models/ontology/onto-data.model';
import { OntoDataFilterVm } from '../../../models/ontology/onto-data-filter.vm';
import { OntoDataShowComponent } from '../show/show.component';

@Component({
    selector: 'app-onto-data-main-table',
    templateUrl: './main-table.component.html',
    styleUrls: ['./main-table.component.scss'],
})
export class OntoDataMainTableComponent implements OnInit {
    @Input() data!: OntoData[];
    @Input() length!: number;
    @Output() onClickCreate: EventEmitter<OntoData> = new EventEmitter<OntoData>();
    @Output() onClickEdit: EventEmitter<OntoData> = new EventEmitter<OntoData>();
    @Output() onClickDelete: EventEmitter<OntoData> = new EventEmitter<OntoData>();
    @Output() onClickAddToBasket: EventEmitter<OntoData> = new EventEmitter<OntoData>();
    @Output() fetchFilteredData: EventEmitter<OntoDataFilterVm> = new EventEmitter<OntoDataFilterVm>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;

    public dataSource: MatTableDataSource<OntoData> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['urlCode', 'endpoint', 'dataType', 'description', 'keywords', 'date', 'actions'],
        dataRows: [],
    };

    public selection = new SelectionModel<OntoData>(true, []);
    public spinner = false;

    filterTerm$ = new BehaviorSubject<string>('');
    filterType$ = new BehaviorSubject<string>(''); // dropdown filter not implemented yet

    constructor(private router: Router, private matDialog: MatDialog) {
        this.spinner = true;
    }

    ngOnInit(): void {
        this.clearDataSource();

        this.filterTerm$.next(null as any);
        this.filterType$.next(null as any);
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
        });

        merge(this.sort.sortChange, this.paginator.page, this.filterTerm$, this.filterType$)
            .pipe(
                tap(() => {
                    if (!this.spinner) {
                        this.spinner = true;
                        this.clearDataSource();
                    }
                }),
                startWith(null),
                debounceTime(1000)
            )
            .subscribe((res) => {
                const ontoDataFilter = {
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    sortBy: this.sort.active,
                    sortOrder: this.sort.direction,
                    dataType: this.filterType$.value,
                    filter: this.filterTerm$.value,
                } as OntoDataFilterVm;

                console.log('OntoDataMainTableComponent:ngAfterViewInit: ontoDataFilter = ', ontoDataFilter);
                this.fetchFilteredData.emit(ontoDataFilter);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('OntoDataMainTableComponent:ngOnChanges: data = ', this.data);

        if (changes?.data && this.data) {
            this.setDataSource();
        }
    }

    private setDataSource(): void {
        console.log('OntoDataMainTableComponent:setDataSource: data = ', this.data);
        this.dataSource.data = this.data;

        this.spinner = false;
        console.log('OntoDataMainTableComponent:setDataSource: data = ', this.dataSource.data);
    }

    private clearDataSource(): void {
        if (this.dataSource) {
            this.dataSource.data = [];
        }
    }

    public onClickShowData(data: OntoData) {
        const dialogOpt = { width: '60%', data: data };
        this.matDialog.open(OntoDataShowComponent, dialogOpt);
    }

    public onClickShowBindings(pageId: string) {
        const url = this.router.serializeUrl(this.router.createUrlTree(['pages', 'page', `${pageId}`]));
        window.open(url, '_blank');
    }
}
