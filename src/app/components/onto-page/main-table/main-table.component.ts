import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { OntoPageFilterVm } from '../../../models/ontology/onto-page-filter.vm';
import { TableData } from '../../../models/table.data.interface';
import { OntoPageExt } from '../../../models/ontology/onto-page.model';
import { OntoVis } from '../../../models/ontology/onto-vis.model';
import { environment } from '../../../../environments/environment';
import { PAGE_TYPE } from '../../../models/ontology/page-type.enum';

@Component({
    selector: 'app-onto-page-main-table',
    templateUrl: './main-table.component.html',
    styleUrls: ['./main-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class OntoPageMainTableComponent implements OnInit {
    @Input() data!: OntoPageExt[];
    @Input() totalCount!: number;
    @Input() isEditable!: boolean;
    @Input() pageType!: PAGE_TYPE;
    @Output() onClickCreate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClickEdit: EventEmitter<OntoPageExt> = new EventEmitter<OntoPageExt>();
    @Output() onClickDelete: EventEmitter<string> = new EventEmitter<string>();
    @Output() onClickRelease: EventEmitter<string> = new EventEmitter<string>();
    @Output() onClickShowBinding: EventEmitter<string> = new EventEmitter<string>();
    @Output() fetchFilteredData: EventEmitter<OntoPageFilterVm> = new EventEmitter<OntoPageFilterVm>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public tableDataSource: MatTableDataSource<OntoPageExt> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['link', 'date', 'function', 'description', 'numDataStreams', 'numLinks', 'actions'],
        dataRows: [],
    };
    spinner = false;
    isTableExpanded = false;

    filterTerm$ = new BehaviorSubject<string>('');
    filterType$ = new BehaviorSubject<string>(''); // dropdown filter not implemented yet

    expandedElement: OntoPageExt[] = [];
    ontoVisArr: OntoVis[] = [];
    ontoVisArrLen = 0;

    public visURL = environment.components.VIS_URL;

    constructor() {}

    ngOnInit(): void {
        console.log('OntoPageMainTableComponent:ngOnInit:  data = ', this.data, 'totalCount = ', this.totalCount);

        this.spinner = true;
        this.clearTableData();

        this.filterTerm$.next(null as any);
        this.filterType$.next(null as any);
    }

    ngAfterViewInit(): void {
        this.tableDataSource.sort = this.sort;

        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
        });

        merge(this.sort.sortChange, this.paginator.page, this.filterTerm$, this.filterType$)
            .pipe(
                tap(() => {
                    if (!this.spinner) {
                        this.spinner = true;
                        this.clearTableData();
                    }
                }),
                startWith(null),
                debounceTime(1000)
            )
            .subscribe((res) => {
                const ontoPageFilterVm = {
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    sortBy: this.sort.active,
                    sortOrder: this.sort.direction,
                    filterId: this.filterTerm$.value,
                } as OntoPageFilterVm;

                console.log('OntoPageMainTableComponent:ngAfterViewInit: ontoPageFilterVm = ', ontoPageFilterVm);
                this.fetchFilteredData.emit(ontoPageFilterVm);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.data && this.data) {
            console.log('OntoPageMainTableComponent:ngOnChanges: data = ', this.data, 'totalCount = ', this.totalCount);
            this.setDataSource();
        }
    }

    private setDataSource(): void {
        this.tableDataSource.data = this.data;
        this.spinner = false;
    }

    private clearTableData(): void {
        if (this.tableDataSource) {
            this.tableDataSource.data = [];
        }
    }

    public onClickNavigatePage(pageId: string) {
        let link = `${this.visURL}${pageId}`;
        window.open(link, '_blank');
    }

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

    public isBindingTypeReview() {
        return this.pageType === PAGE_TYPE.REVIEW;
    }
}
