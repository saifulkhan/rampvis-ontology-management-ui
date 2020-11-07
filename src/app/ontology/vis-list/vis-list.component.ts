import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TableData } from 'src/app/shared/models/table.data.interface';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

import { mergeMap } from 'rxjs/operators';
import { LocalNotificationService } from '../../services/common/local-notification.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { Vis } from '../models/vis.model';
import { OntologyService } from '../ontology.service';
import { VisEditComponent } from '../vis-edit/vis-edit.component';

@Component({
    selector: 'app-vis-list',
    templateUrl: './vis-list.component.html',
    styleUrls: ['./vis-list.component.scss'],
})
export class VisListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;
    public tableDataSource: MatTableDataSource<Vis> = new MatTableDataSource([]);
    public tableData: TableData = {
        headerRow: ['id', 'function', 'type', 'description', 'actions'],
        dataRows: [],
    };
    public visList: Vis[] = [];
    spinner = false;
    public searchTerm: string;

    constructor(
        private ontologyService: OntologyService,
        private matDialog: MatDialog,
        private localNotificationService: LocalNotificationService,
        private dialogService: DialogService,
    ) {}

    ngOnInit(): void {
        console.log('VisListComponent: ngOnInit:');
        this.loadVisList();
    }

    public filterDataSource(): void {
        this.tableDataSource.filter = this.searchTerm.trim().toLowerCase();
    }

    public onClickCreateVis(): void {
        this.openVisEditModal('new', new Vis());
    }

    public onClickEditVis(vis: Vis): void {
        this.openVisEditModal('edit', vis);
    }

    public onClickDeleteVis(sourceId: string): void {
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
    private loadVisList() {
        this.ontologyService.getAllVis().subscribe((res: Vis[]) => {
            if (res) {
                this.visList = res;
                this.setTableData(this.visList);
                console.log('VisListComponent: loadVisList: visList = ', this.visList);
            }
        });
    }

    private openVisEditModal(dialogType: string, vis: Vis): void {
        const dialogOpt = { width: '40%', data: { dialogType, vis } };
        const matDialogRef = this.matDialog.open(VisEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (source: null | Vis): Observable<any> => {
                        if (!source) return of(false);
                        //if (dialogType === 'new') return this.ontologyService.createVis(this.collection.id, source);
                        //if (dialogType === 'edit') return this.sourceService.updateSource(source.id, source);
                        return of(false);
                    },
                ),
            )
            .subscribe((response: Vis | false) => {
                if (!response) return;
                this.loadVisList();
            });
    }

    private setTableData(sources: Array<Vis>): void {
        this.tableDataSource.data = sources;
    }
}
