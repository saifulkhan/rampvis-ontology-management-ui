import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TableData } from 'src/app/shared/models/table.data.interface';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

import { mergeMap } from 'rxjs/operators';
import { LocalNotificationService } from '../../services/common/local-notification.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { OntologyService } from '../ontology.service';
import { OntoPage } from '../models/onto-page.model';
import { PageEditComponent } from '../page-edit/page-edit.component';

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
        headerRow: ['id', 'title', 'bindVis', 'actions'],
        dataRows: [],
    };
    public pageList: OntoPage[] = [];
    spinner = false;
    public searchTerm: string;

    constructor(
        private ontologyService: OntologyService,
        private matDialog: MatDialog,
        private localNotificationService: LocalNotificationService,
        private dialogService: DialogService,
    ) {}

    ngOnInit(): void {
        console.log('DataListComponent: ngOnInit:');
        this.loadPageList();
    }

    public filterTableDataSource(): void {
        this.tableDataSource.filter = this.searchTerm.trim().toLowerCase();
    }

    public onClickCreate(): void {
        this.openPageEditModal('new', new OntoPage());
    }

    public onClickEdit(page: OntoPage): void {
        this.openPageEditModal('edit', page);
    }

    public onClickDelete(sourceId: string): void {
        // this.dialogService.warn('Delete Source', 'Are you sure you want to delete this?', 'Delete').then((result) => {
        //     if (result.value) {
        //         this.collectionService.removeSourceFromCollection(this.collection.id, sourceId).subscribe((res: any) => {
        //             this.loadVisList();
        //         });
        //     }
        // });
    }

    //
    // private methods
    //
    private loadPageList() {
        this.ontologyService.getAllPage().subscribe((res: OntoPage[]) => {
            if (res) {
                this.pageList = res;
                this.setTableData(this.pageList);
                console.log('DataListComponent: loadPageList: pageList = ', this.pageList);
            }
        });
    }

    private openPageEditModal(dialogType: string, page: OntoPage): void {
        const dialogOpt = { width: '40%', data: { dialogType, data: page } };
        const matDialogRef = this.matDialog.open(PageEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (source: null | OntoPage): Observable<any> => {
                        if (!source) return of(false);
                        //if (dialogType === 'new') return this.ontologyService.createVis(this.collection.id, source);
                        //if (dialogType === 'edit') return this.sourceService.updateSource(source.id, source);
                        return of(false);
                    },
                ),
            )
            .subscribe((response: OntoPage | false) => {
                if (!response) return;
                this.loadPageList();
            });
    }

    private setTableData(sources: Array<OntoPage>): void {
        this.tableDataSource.data = sources;
    }
}
