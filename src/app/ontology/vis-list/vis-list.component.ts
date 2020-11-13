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
import { OntoVis } from '../models/onto-vis.model';
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
    public tableDataSource: MatTableDataSource<OntoVis> = new MatTableDataSource([]);
    public tableData: TableData = {
        headerRow: ['id', 'function', 'type', 'description', 'actions'],
        dataRows: [],
    };
    public visList: OntoVis[] = [];
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

    public onClickCreate(): void {
        this.openVisEditModal('new', new OntoVis());
    }

    public onClickEdit(vis: OntoVis): void {
        this.openVisEditModal('edit', vis);
    }

    public onClickDelete(visId: string): void {
        this.dialogService.warn('Delete Vis', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.ontologyService.deleteVis(visId).subscribe((res: any) => {
                    this.loadVisList();
                });
            }
        });
    }

    //
    // private methods
    //
    private loadVisList() {
        this.ontologyService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.visList = res;
                this.setTableData(this.visList);
                console.log('VisListComponent: loadVisList: visList = ', this.visList);
            }
        });
    }

    private openVisEditModal(dialogType: string, vis: OntoVis): void {
        const dialogOpt = { width: '40%', data: { dialogType, vis } };
        const matDialogRef = this.matDialog.open(VisEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (ontoVis: null | OntoVis): Observable<any> => {
                        if (!ontoVis) return of(false);
                            if (dialogType === 'new') return this.ontologyService.createVis(ontoVis);
                            if (dialogType === 'edit') return this.ontologyService.updateVis(ontoVis);
                        return of(false);
                    },
                ),
            )
            .subscribe((response: OntoVis | false) => {
                if (!response) return;
                this.loadVisList();
            });
    }

    private setTableData(sources: Array<OntoVis>): void {
        this.tableDataSource.data = sources;
    }
}
