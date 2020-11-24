import { Component, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DialogService } from '../services/common/dialog.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    constructor(
        private zone: NgZone,
        private matDialog: MatDialog,
        private dialogService: DialogService,
    ) {}

    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {}
 
}
