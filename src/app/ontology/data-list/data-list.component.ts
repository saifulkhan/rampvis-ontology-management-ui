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
import { OntoData } from '../models/onto-data.model';
import { DataEditComponent } from '../data-edit/data-edit.component';

@Component({
    selector: 'app-data-list',
    templateUrl: './data-list.component.html',
    styleUrls: ['./data-list.component.scss'],
})
export class DataListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;
    public tableDataSource: MatTableDataSource<OntoData> = new MatTableDataSource([]);
    public tableData: TableData = {
        headerRow: ['id', 'url', 'endpoint', 'description', 'metadata', 'queryParams', 'actions'],
        dataRows: [],
    };
    public dataList: OntoData[] = [];
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
        this.loadDataList();
    }

    public filterDataSource(): void {
        this.tableDataSource.filter = this.searchTerm.trim().toLowerCase();
    }

    public onClickCreate(): void {
        this.openVisEditModal('new', new OntoData());
    }

    public onClickEdit(data: OntoData): void {
        this.openVisEditModal('edit', data);
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
    private loadDataList() {
        this.ontologyService.getAllData().subscribe((res: OntoData[]) => {
            if (res) {
                this.dataList = res;
                this.setTableData(this.dataList);
                console.log('DataListComponent: loadDataList: dataList = ', this.dataList);
            }
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
                this.loadDataList();
            });
    }

    private setTableData(sources: Array<OntoData>): void {
        this.tableDataSource.data = sources;
    }
}
