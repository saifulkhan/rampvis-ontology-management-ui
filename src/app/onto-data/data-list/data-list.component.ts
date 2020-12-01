import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TableData } from '../../models/table.data.interface';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, mergeMap, startWith, tap } from 'rxjs/operators';

import { LocalNotificationService } from '../../services/common/local-notification.service';
import { DialogService } from '../../services/common/dialog.service';
import { OntoDataService } from '../../services/ontology/onto-data.service';
import { DataEditComponent } from '../data-edit/data-edit.component';
import { OntoData } from '../../models/ontology/onto-data.model';
import { DataViewComponent } from '../data-view/data-view.component';
import { OntoDataFilterVm } from '../../models/ontology/onto-data-filter.vm';
import { ErrorHandler2Service } from '../../services/common/error-handler-2.service';
import { PaginationModel } from 'src/app/models/pagination.model';

@Component({
    selector: 'app-data-list',
    templateUrl: './data-list.component.html',
    styleUrls: ['./data-list.component.scss'],
})
export class DataListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public tableDataSource: MatTableDataSource<OntoData> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['id', 'urlCode', 'endpoint', 'date', 'dataType', 'metadata', 'productDesc', 'streamDesc', 'actions'],
        dataRows: [],
    };

    public dataList: OntoData[] = [];
    public dataListLength = 0;
   
    searchTerm$ = new BehaviorSubject<string>('');
    filterDataType$ = new BehaviorSubject<string>('');
    spinner = false;

    constructor(
        private ontologyService: OntoDataService,
        private matDialog: MatDialog,
        private localNotificationService: LocalNotificationService,
        private dialogService: DialogService,
        private errorHandler2Service: ErrorHandler2Service,
    ) {}

    ngOnInit(): void {
        console.log('DataListComponent: ngOnInit:');

        this.spinner = true;
        this.clearTableData();
        // this.searchTerm$.next(null);
        // this.filterDataType$.next(null);
    }

    ngAfterViewInit(): void {
        this.tableDataSource.paginator = this.paginator;
        this.tableDataSource.sort = this.sort;

        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
        });

        merge(this.sort.sortChange, this.paginator.page, this.searchTerm$, this.filterDataType$)
            .pipe(
                tap(() => {
                    if (!this.spinner) {
                        this.spinner = true;
                        this.clearTableData();
                    }
                }),
                startWith(null),
                debounceTime(1000),
            )
            .subscribe((res) => {
                this.loadDataList(this.getFilters());
            });
    }

    public filterDataSource(): void {
        // this.tableDataSource.filter = this.searchTerm.trim().toLowerCase();
    }

    public onClickCreate(): void {
        this.openVisEditModal('new', new OntoData());
    }

    public onClickEdit(data: OntoData): void {
        this.openVisEditModal('edit', data);
    }

    public onClickDelete(dataId: string): void {
        this.dialogService.warn('Delete Data', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.ontologyService.deleteData(dataId).subscribe((res: any) => {
                    this.loadDataList(this.getFilters());
                });
            }
        });
    }

    public onClickViewData(data: OntoData){
        console.log(data);
        const dialogOpt = { width: '40%', data: data };
        this.matDialog.open(DataViewComponent, dialogOpt);
    }

    //
    // private methods
    //
    
    private getFilters():OntoDataFilterVm {
        return {
            page: this.paginator.pageIndex,
            pageCount: this.paginator.pageSize,
            sortBy: this.sort.active,
            sortOrder: this.sort.direction,
            dataType: this.filterDataType$.value,
            filter: this.searchTerm$.value,
        } as OntoDataFilterVm;
    }

    private loadDataList(ontoDataFilter: OntoDataFilterVm) {

        this.ontologyService
        .getAllData(ontoDataFilter)
        .pipe(
            catchError((err) => {
                this.errorHandler2Service.handleError(err);
                return of([]);
            }),
        )
        .subscribe((response: any) => {
            this.dataList = response.data;
            this.dataListLength = response.totalCount;

            this.setTableData()
        });
    }

    private openVisEditModal(dialogType: string, data: OntoData): void {
        const dialogOpt = { width: '40%', data: { dialogType, data: data } };
        const matDialogRef = this.matDialog.open(DataEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (ontoData: null | OntoData): Observable<any> => {
                        if (!ontoData) return of(false);
                        if (dialogType === 'new') return this.ontologyService.createData(ontoData);
                        if (dialogType === 'edit') return this.ontologyService.updateData(ontoData);
                        return of(false);
                    },
                ),
            )
            .subscribe((response: OntoData | false) => {
                if (!response) return;
                this.loadDataList(this.getFilters());
            });
    }

    private setTableData(): void {
        this.tableDataSource.data = this.dataList;
        this.spinner = false;
    }

    private clearTableData(): void {
        if (this.tableDataSource) {
            this.tableDataSource.data = [];
        }
    }
}
