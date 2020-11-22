import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { from, interval, Observable, of, timer } from 'rxjs';
import { flatMap, map, take, tap } from 'rxjs/operators';
import { LocalNotificationService } from 'src/app/services/common/local-notification.service';

import { BotsService, IBotSettings } from '../../services/bots.service';
import { SCHEDULER_STATE } from '../../models/scheduler-state.enum';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';

@Component({
    selector: 'app-bots-status',
    templateUrl: 'bots-status.component.html',
    styleUrls: ['./bots-status.component.scss']
})
export class BotsStatusComponent implements OnInit, AfterViewInit {
    public logStream$;
    schedulerStatus: SCHEDULER_STATE;
    settings: IBotSettings;
    displayedColumns: string[] = ['name', 'p1', 'p2', 'p3', 'default', 'threads', 'edit'];

    //
    // Test the time-line component with fake data
    //
    // public logs: LogMessage[] = [];
    // logs: LogMessage[] = [
    //   { message: 'A simple log message' },
    //   { message: 'A success message', type: 'SUCCESS' },
    //   { message: 'A warning message', type: 'WARN' },
    //   { message: 'An error message', type: 'ERR' },
    //   { message: 'An info message', type: 'INFO' }
    // ];
    // logStream$ = timer(0, 1000).pipe(
    //     take(this.logs.length),
    //     map((i) => this.logs[i]),
    // );

    constructor(
        private botsService: BotsService, 
        private matDialog: MatDialog,
        private localNotifications: LocalNotificationService
    ) {}

    ngOnInit() {
        // TEST CONFIGS ONLY - DELETE
        this.schedulerStatus = SCHEDULER_STATE.STATE_ERROR;

        
        this.botsService.getSettings().subscribe(res => this.settings = res);
        // TODO better way to combine line #44- 58
        this.botsService.status()
        .subscribe((res: any) => {
            console.log('BotsStatusComponent: ngOnInit: status = ', res);
            this.schedulerStatus = res.status;
        });

        interval(2 * 60 * 1000)
            .pipe(
                flatMap(() => this.botsService.status())
            )
            .subscribe((res: any) => {         
                this.schedulerStatus = res.status;
                console.log('BotsStatusComponent: ngOnInit: status = ', res);
            });
    
        this.logStream$ = this.botsService.$log;

        //
        // Test the time-line component with fake data
        // logStream$ = timer(0, 1000).pipe(
        //   take(this.logs.length),
        //   map((i) => this.logs[i]),
        // );

    }

    ngAfterViewInit() {}

    status(): void {
        this.botsService.status().subscribe((res: any) => {
            console.log('BotsStatusComponent: ngOnInit: status = ', res);
            this.schedulerStatus = res.status;
        });
    }

    start() {
        this.schedulerStatus = SCHEDULER_STATE.STATE_RUNNING;
        this.botsService.start().subscribe((res: any) => {
            console.log('BotsStatusComponent: start: status = ', res);
            this.schedulerStatus = res.status;
        });
    }

    pause() {
        this.schedulerStatus = SCHEDULER_STATE.STATE_PAUSED;
        this.botsService.pause().subscribe((res: any) => {
            console.log('BotsStatusComponent: pause: status = ', res);
            this.schedulerStatus = res.status;
        });
    }

    resume() {
        this.schedulerStatus = SCHEDULER_STATE.STATE_RUNNING;
        this.botsService.resume().subscribe((res: any) => {
            console.log('BotsStatusComponent: resume: status = ', res);
            this.schedulerStatus = res.status;
        });
    }

    editBotSettings(): void {
        const dialogOpt = {
            data: this.settings
        };
        const dialogRef = this.matDialog.open(SettingsModalComponent, dialogOpt);
        dialogRef.afterClosed()
            .pipe(
                flatMap((response: IBotSettings): Observable<IBotSettings | false> => {
                    if (response) {
                        this.settings = response;
                        return this.botsService.updateSettings(response);
                    }
                    return of(false);
            }))
            .subscribe((res) => {
                if (res) this.localNotifications.success({ message: 'Bot settings updated' })
            });
    }
}
