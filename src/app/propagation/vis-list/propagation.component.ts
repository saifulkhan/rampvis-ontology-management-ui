import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TableData } from '../../models/table.data.interface';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { mergeMap } from 'rxjs/operators';
import { LocalNotificationService } from '../../services/common/local-notification.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { OntoVis } from '../../models/ontology/onto-vis.model';
import { OntoVisService } from 'src/app/services/ontology/onto-vis.service';

@Component({
    selector: 'app-propagation',
    templateUrl: './propagation.component.html',
    styleUrls: ['./propagation.component.scss'],
})
export class PropagationComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    public tableDataSource: MatTableDataSource<OntoVis> = new MatTableDataSource();
    public tableData: TableData = {
        headerRow: ['id', 'function', 'type', 'dataTypes', 'description', 'actions'],
        dataRows: [],
    };
    public visList: OntoVis[] = [];
    spinner = false;
    public searchTerm!: string;

    filterPublishType$ = new BehaviorSubject<string>('');

    constructor(
        private route: ActivatedRoute,
        private ontoVisService: OntoVisService,
        private matDialog: MatDialog,
        private localNotificationService: LocalNotificationService,
        private dialogService: DialogService,
    ) {
       
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            console.log('PropagationComponent: ngOnInit: route releaseType = ', this.route.snapshot.params.releaseType);
            this.filterPublishType$.next(this.route.snapshot.params.releaseType);
        });

        console.log('VisListComponent: ngOnInit:');
        // this.loadVisList();
    }

    ngAfterViewInit(): void {
        this.tableDataSource.paginator = this.paginator;
        this.tableDataSource.sort = this.sort;
    }

    public filterDataSource(): void {
        this.tableDataSource.filter = this.searchTerm.trim().toLowerCase();
    }

    public onClickCreate(): void {
     }

    public onClickEdit(vis: OntoVis): void {
     }

    public onClickDelete(visId: string): void {
        this.dialogService.warn('Delete Vis', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.ontoVisService.deleteVis(visId).subscribe((res: any) => {
                    this.loadVisList();
                });
            }
        });
    }

    //
    // private methods
    //
    private loadVisList() {
        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.visList = res;
                this.setTableData(this.visList);
                console.log('VisListComponent: loadVisList: visList = ', this.visList);
            }
        });
    }

 

    private setTableData(sources: Array<OntoVis>): void {
        this.tableDataSource.data = sources;
    }
}
