import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

import { OntoPageFilterVm } from '../../../models/ontology/onto-page-filter.vm';
import { TableData } from '../../../models/table.data.interface';
import { OntoPageExt } from '../../../models/ontology/onto-page.model';
import { OntoVis } from '../../../models/ontology/onto-vis.model';
import { environment } from '../../../../environments/environment';
import { BINDING_TYPE } from '../../../models/ontology/binding-type.enum';

@Component({
    selector: 'app-onto-page-table',
    templateUrl: './onto-page-table.component.html',
    styleUrls: ['./onto-page-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class OntoPageTableComponent implements OnInit {
    @Input() data!: OntoPageExt[];
    @Input() len!: number;
    @Input() isEditable!: boolean;
    @Output() onClickCreate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClickEdit: EventEmitter<OntoPageExt> = new EventEmitter<OntoPageExt>();
    @Output() onClickDelete: EventEmitter<string> = new EventEmitter<string>();
    @Output() onClickShowBinding: EventEmitter<string> = new EventEmitter<string>();
    @Output() fetchFilteredData: EventEmitter<OntoPageFilterVm> = new EventEmitter<OntoPageFilterVm>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public tableDataSource: MatTableDataSource<OntoPageExt> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['link', 'date', 'bindings', 'actions'],
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

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.spinner = true;
        this.clearTableData();

        this.filterTerm$.next(null as any);
        this.filterType$.next(null as any);
    }

    ngAfterViewInit(): void {
        this.tableDataSource.paginator = this.paginator;
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
                    bindingType: this.filterType$.value as BINDING_TYPE, // always null, not implemented here
                    filter: this.filterTerm$.value,
                } as OntoPageFilterVm;

                console.log('OntoPageTableComponent:ngAfterViewInit: ontoPageFilterVm = ', ontoPageFilterVm);
                this.fetchFilteredData.emit(ontoPageFilterVm);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.data && this.data) {
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
        let link = `${this.visURL}/${pageId}`;
        window.open(link, '_blank');
    }

    // public onClickShowBindings(pageId: string) {
    //     // Open in a new tab
    //     // const url = this.router.serializeUrl(this.router.createUrlTree(['pages', 'page', `${pageId}`]));
    //     // window.open(url, '_blank');

    //     this.router.navigate(['pages', 'page', `${pageId}`]);
    // }

    //
    // Toggle Rows
    //

    // toggleTableRows() {
    //     this.isTableExpanded = !this.isTableExpanded;

    //     this.data.forEach((row: any) => {
    //         row.isExpanded = this.isTableExpanded;
    //     });
    // }

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
}
