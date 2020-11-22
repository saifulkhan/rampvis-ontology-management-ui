import { Component, NgZone, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TableData } from 'src/app/shared/models/table.data.interface';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { catchError, debounceTime, mergeMap, startWith, tap } from 'rxjs/operators';
import { LocalNotificationService } from '../../services/common/local-notification.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { OntoPageService } from '../../services/ontology/onto-page.service';
import { OntoPage, PUBLISH_TYPE } from '../../models/ontology/onto-page.model';
import { PageEditComponent } from '../page-edit/page-edit.component';
import { OntoPageFilterVm } from '../../models/ontology/onto-page-filter.vm';
import { ErrorHandler2Service } from '../../services/common/error-handler-2.service';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'app-page-list',
    templateUrl: './page-list.component.html',
    styleUrls: ['./page-list.component.scss'],
})
export class PageListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;
    public tableDataSource: MatTableDataSource<OntoPage> = new MatTableDataSource([]);
    public tableData: TableData = {
        headerRow: ['id', 'date', 'title', 'bindVis', 'actions'],
        dataRows: [],
    };

    public ontoPages: OntoPage[] = [];
    pageListLength = 0;
    publishType: PUBLISH_TYPE;
    publishTypes = [];

    filterPublishType$ = new BehaviorSubject<string>('');
    searchTerm$ = new BehaviorSubject<string>('');

    spinner = false;

    constructor(
        private route: ActivatedRoute,
        private ontologyService: OntoPageService,
        private matDialog: MatDialog,
        private localNotificationService: LocalNotificationService,
        private dialogService: DialogService,
        private errorHandler2Service: ErrorHandler2Service,
        private utilService: UtilService,
    ) {}

    ngOnInit(): void {
        console.log('PageListComponent: ngOnInit:');
        // this.loadPageList();
        this.publishTypes = Object.keys(PUBLISH_TYPE);

        this.spinner = true;
        this.clearTableData();
        // this.searchTerm$.next(null);
        // this.filterPublishType$.next(null);

        this.route.params.subscribe((params) => {
            console.log('PageListComponent: ngOnInit: route releaseType = ', this.route.snapshot.params.releaseType);
            this.filterPublishType$.next(this.route.snapshot.params.releaseType);
        });
    }

    ngAfterViewInit(): void {
        this.tableDataSource.paginator = this.paginator;
        this.tableDataSource.sort = this.sort;

        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
        });

        merge(this.sort.sortChange, this.paginator.page, this.searchTerm$, this.filterPublishType$)
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
                this.loadOntoPages(this.getFilters());
            });
    }

    public filterTableDataSource(): void {
        // this.tableDataSource.filter = this.searchTerm.trim().toLowerCase();
    }

    public onClickCreate(): void {
        this.openPageEditModal('new', new OntoPage());
    }

    public onClickEdit(page: OntoPage): void {
        this.openPageEditModal('edit', page);
    }

    public onClickDelete(pageId: string): void {
        this.dialogService.warn('Delete', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.ontologyService.deletePage(pageId).subscribe((res: any) => {
                    this.localNotificationService.success({ message: 'Page template successfully deleted' });
                    this.ontoPages = this.ontoPages.filter(d => d.id !== pageId);

                    this.setTableData()
                });
            }
        });
    }

    //
    // private methods
    //

    private getFilters():OntoPageFilterVm {
        return {
            page: this.paginator.pageIndex,
            pageCount: this.paginator.pageSize,
            sortBy: this.sort.active,
            sortOrder: this.sort.direction,
            publishType: this.filterPublishType$.value,
            filter: this.searchTerm$.value,
        } as OntoPageFilterVm
    }

    private loadOntoPages(ontoPageFilter: OntoPageFilterVm) {
        this.ontologyService
            .getPages(ontoPageFilter)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                }),
            )
            .subscribe((response: any) => {
                this.ontoPages = response.data;
                this.pageListLength = response.totalCount;

                this.setTableData()
            });
    }

    private openPageEditModal(dialogType: string, ontoPage: OntoPage): void {
        console.log('PageListComponent: openPageEditModal: ontoPage = ', ontoPage);

        const dialogOpt = { width: '40%', data: { dialogType, data: this.utilService.clone(ontoPage) } };
        const matDialogRef = this.matDialog.open(PageEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (ontoPage: null | OntoPage): Observable<any> => {
                        if (!ontoPage) return of(false);

                        console.log('PageListComponent: openPageEditModal: dialog afterClosed, ontoPage = ', ontoPage);

                        if (dialogType === 'new') return this.ontologyService.createPage(ontoPage);
                        if (dialogType === 'edit') return this.ontologyService.updatePage(ontoPage);
                        return of(false);
                    },
                ),
            )
            .subscribe((response: OntoPage | false) => {    
                if (!response) return;

                this.localNotificationService.success({ message: 'Page template successfully created or updated' });
                this.loadOntoPages(this.getFilters());
            });
    }

    private setTableData(): void {
        this.tableDataSource.data = this.ontoPages;
        this.spinner = false;
    }

    private clearTableData(): void {
        if (this.tableDataSource) {
            this.tableDataSource.data = [];
        }
    }
}
