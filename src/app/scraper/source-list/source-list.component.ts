import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TableData } from 'src/app/shared/models/table.data.interface';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

import { CollectionService } from '../../services/collection.service';
import { SourceEditComponent } from '../source-edit/source-edit.component';
import { mergeMap } from 'rxjs/operators';
import { Collection } from '../../shared/models/collection.model';
import { Source } from '../../shared/models/source.model';
import { LocalNotificationService } from '../../services/common/local-notification.service';
import { SourceService } from '../../services/source.service';
import { DialogService } from 'src/app/services/common/dialog.service';

@Component({
    selector: 'app-source-list',
    templateUrl: './source-list.component.html',
    styleUrls: ['./source-list.component.scss'],
})
export class SourceListComponent implements OnInit {
    public dataSource: MatTableDataSource<Source> = new MatTableDataSource([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;
    public dataTable: TableData = {
        headerRow: ['title', 'url', 'type', 'lastMinedOn', 'lastUpdatedOn', 'actions'],
        dataRows: [],
    };
    spinner = false;

    collectionId: string;
    public collection: Collection;
    public sources: Source[] = [];
    public searchTerm: string;

    constructor(
        private zone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        private collectionService: CollectionService,
        private sourceService: SourceService,
        private matDialog: MatDialog,
        private localNotificationService: LocalNotificationService,
        private dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.collectionId = this.route.snapshot.params.collectionId;
        this.collection = this.route.snapshot.data.collection;
        console.log('SourcesComponent: ngOnInit: collectionId = ', this.collectionId, 'collection = ', this.collection);
        this.loadSources();

        this.collectionService.$sources.subscribe((res: Source[]) => {
            if (res) {
                this.zone.run(() => this.sources = [...res]);
                this.setTableData(this.sources);
            }
        });
    }

    public filterDataSource(): void {
        this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    }

    public onClickCreateSource(): void {
        this.openSourceEditModal('new', new Source());
    }

    public editSource(source: Source): void {
        this.openSourceEditModal('edit', source);
    }

    public deleteSource(sourceId: string): void {
        this.dialogService.warn('Delete Source', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.collectionService.removeSourceFromCollection(this.collection.id, sourceId).subscribe((res: any) => {
                    this.loadSources();
                });
            }
        });
    }

    public onClickMine(): void {
        this.localNotificationService.info({ message: 'A new mining operation has begun.' });
        this.collectionService.startMiningOfCollection((this.collection as any).id).subscribe();
    }

    public navigateMiningResult(sourceId: any) {
        this.router.navigate(['collection', `${this.collection.id}`, 'source', `${sourceId}`, 'mining']);
    }

    //
    // private methods
    //
    private loadSources() {
        this.collectionService.getSourcesOfCollection(this.collectionId).subscribe(
            (response: Array<Source>) => {
                this.sources = response;
                this.setTableData(this.sources);
                console.log('SourcesComponent: ngOnInit: sources = ', this.sources);
            }
        );
    }

    private openSourceEditModal(dialogType: string, source: Source): void {
        const dialogOpt = { width: '40%', data: { dialogType, source } };
        const matDialogRef = this.matDialog.open(SourceEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (source: null | Source): Observable<any> => {
                        if (!source) return of(false);
                        if (dialogType === 'new') return this.collectionService.createSource(this.collection.id, source);
                        if (dialogType === 'edit') return this.sourceService.updateSource(source.id, source);
                        return of(false);
                    },
                ),
            )
            .subscribe((response: Source | false) => {
                if (!response) return;
                this.loadSources();
            });
    }

    private setTableData(sources: Array<Source>): void {
        this.dataSource.data = sources;
    }
}
