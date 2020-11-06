import { Component, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DialogService } from '../services/common/dialog.service';
import { MiningService } from '../services/mining.service';
import { TimelineService } from '../services/timeline.service';
import { Mining } from '../shared/models/mining.model';
import { Timeline } from '../shared/timeline/timeline.model';
import { PDFViewerComponent } from '../shared/pdf-viewer/pdf-viewer.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    public timelineStream;
    public newMinings: Mining[] = [];
    public checkedMinings: Mining[] = [];

    constructor(
        private miningService: MiningService, 
        private timelineService: TimelineService, 
        private zone: NgZone,
        private matDialog: MatDialog,
        private dialogService: DialogService,
    ) {}

    ngOnInit(): void {
        this.miningService.$createMinings.subscribe((res: Mining[]) => {
            if (res) {
                this.zone.run(() => this.newMinings = [...res]);
            }
        });

        this.miningService.$checkMinings.subscribe((res: Mining[]) => {
            if (res) {
                this.zone.run(() => this.checkedMinings = [...res]);
            }
        });

        this.timelineService.timelineStream$.subscribe((res: Timeline) => {
            if (res) {
                this.zone.run(() => this.timelineStream = res);
            }
        });
    }

    ngOnDestroy(): void {}


    public check(miningId: string) {
        console.log('MiningTableComponent: check: miningId = ', miningId);
        this.miningService.updateCheckedBy(miningId).subscribe((response: Mining) => {
            console.log('MiningTableComponent: check: response = ', response);
        });
    }

    public showPdf(miningId: string): void {
        console.log(miningId)
        this.miningService.getMiningResult(miningId).subscribe((res: any) => {
            const dialogOpt = {
                data: { pdfString: `data:application/pdf;base64,${res.pdf}` },
                width: '90%',
                height: '90%',
            };
            const dialogRef = this.matDialog.open(PDFViewerComponent, dialogOpt);
        });
    }

    public remove(miningId: string) {
        this.dialogService.warn('Delete Mining', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.miningService.deleteMiningResult(miningId).subscribe();
            }
        });
    }
}
