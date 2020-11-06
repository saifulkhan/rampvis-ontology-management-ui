import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { mergeMap } from 'rxjs/operators';

import { TableData } from '../../shared/models/table.data.interface';
import { CollectionEditComponent } from '../collection-edit/collection-edit.component';
import { Collection } from '../../shared/models/collection.model';
import { CollectionService } from '../../services/collection.service';
import { COLLECTION_STATE } from 'src/app/shared/models/collection-state.enum';
import { DialogService } from 'src/app/services/common/dialog.service';

@Component({
    selector: 'app-collection-list',
	templateUrl: './collection-list.component.html',
	styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements OnInit {
    public collections: Array<Collection> = [];
    public editEnabled: boolean;
    public spinner: boolean;
    public searchTerm: string;

    public dataSource: MatTableDataSource<Collection> = new MatTableDataSource([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;
    public dataTable: TableData = {
        headerRow: ['title', 'tags', 'numSources', 'state', 'actions'],
        dataRows: [],
    };

	constructor(
		private collectionService: CollectionService, 
		private router: Router, 
        private matDialog: MatDialog,
        private zone: NgZone,
        private dialogService: DialogService
	) {}

    ngOnInit(): void {
        this.loadCollection();

        this.dataSource.filterPredicate = (event: any, filter: string) => {
            const queryList = filter.split(' ');
            const results = queryList.map((query) => this.searchObjectForQuery(event, query));
            return results.includes(false) ? false : true;
        };

        this.collectionService.$collections.subscribe((res: Collection[]) => {
            if (res) {
                this.zone.run(() => this.collections = [...res]);
                this.setTableData(this.collections);
            }
        });
    }

    public filterDataSource(): void {
        this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    }

    public deleteCollection(collectionId: string): void {
        this.dialogService.warn('Delete Collection', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.collectionService.deleteCollection(collectionId).subscribe((res: Collection) => this.loadCollection())
            }
        });
     }
 
     public isRunning(state: COLLECTION_STATE) {
         if (state === COLLECTION_STATE.RUNNING) return true;
         else return false
     }

    public createCollection(): void {
        this.openSourceEditModal('new', new Collection());
    }

    public editCollection(collection: Collection): void {
        this.openSourceEditModal('edit', collection);
    }

    //
    // private methods
    //

    private openSourceEditModal(dialogType: string, collection: Collection): void {
        const dialogOpt = { 
            width: '40%', 
            data: { dialogType, collection } 
        };
        const matDialogRef = this.matDialog.open(CollectionEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (res: null | Collection): Observable<any> => {
                        if (!res) return of(false);
                        if (dialogType === 'new') return this.collectionService.createCollection(res);
                        if (dialogType === 'edit') return this.collectionService.updateCollection(res);;
                        return of(false);
                    },
                ),
            )
            .subscribe((response: Collection | false) => {
                if (!response) return;
                this.loadCollection();
            });
    }
    
    private loadCollection() {
        this.collectionService.getAllCollection().subscribe(
            (response: Array<Collection>) => {
                this.collections = response;
                this.setTableData(this.collections);
                console.log('CollectionListComponent: ngOnInit: collection = ', this.collections);
            }
        );
    }

    private setTableData(collectionList: Array<Collection>): void {
        this.dataSource.data = collectionList;
    }

    public showSources(collectionId: string): void {
        this.router.navigate(['collection', `${collectionId}`, 'source']);
    }

    private searchObjectForQuery(object: any, filter: string): boolean {
        const title = object.title.toLowerCase();
        const tags = object.tags.map((item) => item.toLowerCase()).join(', ');
        return title.includes(filter) || tags.includes(filter) ? true : false;
    }
}
