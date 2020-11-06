import { Injectable } from '@angular/core';
import { from, Observable, ReplaySubject, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { APIService } from './api.service';
import { NotificationService } from './notification.service';
import { NOTIFICATION_TYPE } from '../shared/models/notification-type.enum';
import { Notification } from '../shared/models/notification.model';
import { LogMessage } from '../shared/log-monitor/models/log-message.model';
import { environment } from '../../environments/environment';

export interface IBotSettings {
    schedulerIntervals: { p1: number, p2: number, p3: number, def: number };
    threadOptions: Array<number>;
    threads: number;
}

@Injectable()
export class BotsService {
    private url = environment.components.apiPy + '/scheduler';

    public $log: ReplaySubject<LogMessage> = new ReplaySubject<null>();
    private logs: LogMessage[] = [];
    private $logNotificationSubscription: Subscription;

    private settings: IBotSettings = {
        schedulerIntervals: {
            p1: 60,
            p2: 360,
            p3: 720,
            def: 1440
        },
        threadOptions: [4, 8, 16],
        threads: 4
    };

    constructor(
        private api: APIService, 
        private notificationService: NotificationService
    ) {
        this.subscribeToLogNotification();
    }

    //
    // Scheduler
    //
    public status(): Observable<any> {
        return this.api.get<any>(`${this.url}/status`);
    }
    public start(): Observable<any> {
        return this.api.get<any>(`${this.url}/start`);
    }
    public pause(): Observable<any> {
        return this.api.get<any>(`${this.url}/pause`);
    }
    public resume(): Observable<any> {
        return this.api.get<any>(`${this.url}/resume`);
    }

    //
    // Settings
    //
    public updateSettings(settings: IBotSettings): Observable<IBotSettings> {
        console.log('This should send the new settings for the automated bot to the server');
        this.settings = settings;
        return from([this.settings]);
    }

    public getSettings(): Observable<IBotSettings> {
        return from([this.settings]);
    }

    //
    // Logs
    // Private methods
    //

    private subscribeToLogNotification(): void {
        console.log('BotsService: subscribeToLogNotification:');

        if (!this.$logNotificationSubscription) {
            this.$logNotificationSubscription = this.subscribeToNotification()
                .pipe(
                    tap((res: Notification) => {
                        const log = res.message as LogMessage;
                        console.log('BotsService: subscribeToLogNotification: log = ', log);
                        this.logs.push(log);
                        this.$log.next(log);
                    }),
                )
                .subscribe();
        }
    }

    private subscribeToNotification(): Observable<Notification> {
        console.log('BotsService: subscribeToNotification:');

        return this.notificationService.listen().pipe(
            filter((res: Notification) => {
                return res.type === NOTIFICATION_TYPE.MINING_EVENT || res.type === NOTIFICATION_TYPE.SCHEDULER_EVENT;
            }),
            map((res: Notification) => res),
        );
    }

    //
    // Cleanup
    //

    ngOnDestroy(): void {
        // TODO
    }
}
