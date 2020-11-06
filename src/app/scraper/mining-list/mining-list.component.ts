import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { TableData } from '../../shared/models/table.data.interface';
import { Mining } from '../../shared/models/mining.model';
import { Source } from '../../shared/models/source.model';
import { PDFViewerComponent } from '../../shared/pdf-viewer/pdf-viewer.component';
import { SourceService } from '../../services/source.service';
import { MiningService } from '../../services/mining.service';
import { DialogService } from '../../services/common/dialog.service';
import { LocalNotificationService } from '../../services/common/local-notification.service';

@Component({
    selector: 'app-mining-list',
    templateUrl: './mining-list.component.html',
    styleUrls: ['./mining-list.component.scss'],
})
export class MiningListComponent implements OnInit {
    public dataSource: MatTableDataSource<Mining> = new MatTableDataSource([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;
    public dataTable: TableData = {
        headerRow: ['minedOn', 'updatedOn', 'text', 'by', 'actions'],
        dataRows: [],
    };
    public spinner: boolean;
    collectionId: string;
    sourceId: string;
    source: Source;
    public minings: Mining[] = [];

    constructor(
        private route: ActivatedRoute,
        private sourceService: SourceService,
        private miningService: MiningService,
        private matDialog: MatDialog,
        private dialogService: DialogService,
        private localNotificationService: LocalNotificationService,
    ) {}

    ngOnInit(): void {
        const { params, data } = this.route.snapshot;
        this.collectionId = params.collectionId;
        this.sourceId = params.sourceId;
        this.source = data.source;

        this.sourceService.getMinings(this.sourceId).subscribe((response: Mining[]) => {
            console.log('MiningListComponent: ngOnInit: response = ', response);
            this.minings = response;
            this.setTableData(this.minings);
            this.spinner = false;
        });
    }

    private setTableData(data: Mining[]): void {
        this.dataSource.data = data;
    }

    showPdf(miningId: string) {
        this.spinner = true;
        this.miningService.getMiningResult(miningId).subscribe((response: any) => {
            this.spinner = false;
            const dialogOpt = {
                data: { pdfString: `data:application/pdf;base64,${response.pdf}` },
                width: '90%',
                height: '90%',
            };
            this.matDialog.open(PDFViewerComponent, dialogOpt);
            this.spinner = false;
        });
    }

    check(miningId: string) {
        console.log('MiningListComponent: check: miningId = ', miningId);
        this.miningService.updateCheckedBy(miningId).subscribe((response: Mining) => {
            this.minings = this.minings.filter((d) => d.id !== miningId)
            this.minings.push(response);
            this.setTableData(this.minings);
        });
    }

    remove(miningId: string) {
        this.dialogService.warn('Delete Mining', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.miningService.deleteMiningResult(miningId).subscribe((response: Mining) => {
                    this.minings = this.minings.filter((d) => d.id !== response.id);
                    this.setTableData(this.minings);
                });
            }
        });
    }
}
