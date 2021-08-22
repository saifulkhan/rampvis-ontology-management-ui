import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IBotSettings } from '../../../../services/bots.service';
import { LocalNotificationService } from '../../../../services/local-notification.service';
import { UtilService } from '../../../../services/util.service';

@Component({
    selector: 'app-settings-modal',
    templateUrl: './settings-modal.component.html'
})

export class SettingsModalComponent {
    clonedSettings: IBotSettings;

    constructor(
        private matDialogRef: MatDialogRef<SettingsModalComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private utils: UtilService,
        private localNotificationService: LocalNotificationService,
    ) {
        this.clonedSettings = utils.deepCopy(data);
    }

    submit(): void {
        if (this.validate()) {
            this.matDialogRef.close(this.clonedSettings);
            return;
        }
        this.localNotificationService.error({ message: 'All fields must have an integer value' });
    }

    private validate(): boolean {
        const { p1, p2, p3, def } = this.clonedSettings.schedulerIntervals;
        if (!p1 || !p2 || !p3 || !def) return false;
        return true;
    }
}
