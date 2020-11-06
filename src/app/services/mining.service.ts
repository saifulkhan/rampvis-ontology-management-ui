import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { Mining } from '../shared/models/mining.model';
import { APIService } from './api.service';
import { NotificationService } from './notification.service';
import { Notification } from '../shared/models/notification.model';
import { NOTIFICATION_TYPE } from '../shared/models/notification-type.enum';
import { LocalNotificationService } from './common/local-notification.service';

@Injectable({ providedIn: 'root' })
export class MiningService {
    private url = '/mining';

    public $createMinings: ReplaySubject<Mining[]> = new ReplaySubject<[]>();
    private createMinings: Mining[] = [];
    public $checkMinings: ReplaySubject<Mining[]> = new ReplaySubject<[]>();
    private checkMinings: Mining[] = [];

    private $miningNotificationSubscription: Subscription;

    constructor(
        private api: APIService, 
        private notificationService: NotificationService, 
        private localNotificationService: LocalNotificationService,
    ) {
        this.subscribeToMiningNotification();
        this.getCreateMinings().subscribe();
        this.getCheckMinings().subscribe();
    }

    public getMiningResult(miningId: string): Observable<Mining> {
        return this.api.get<Mining>(`${this.url}/${miningId}`);
    }

    public updateCheckedBy(miningId: string): Observable<Mining> {
        return this.api.put<Mining>(`${this.url}/${miningId}`, {} as any);
    }

    public deleteMiningResult(miningId: string): Observable<Mining> {
        return this.api.delete<Mining>(`${this.url}/${miningId}`);
    }

    //
    // Private methods
    //

    public getCreateMinings(): Observable<Mining[]> {
        this.createMinings = [];
        return this.api.get<Mining[]>(`${this.url}/new`).pipe(
            map((res) => {
                res.forEach((d) => this.createMinings.push(d));
                this.$createMinings.next(res);

                return this.createMinings;
            }),
        );
    }

    public getCheckMinings(): Observable<Mining[]> {
        this.checkMinings = [];
        return this.api.get<Mining[]>(`${this.url}/checked`).pipe(
            map((res) => {
                res.forEach((d) => this.checkMinings.push(d));
                this.$checkMinings.next(res);

                return this.checkMinings;
            }),
        );
    }

    private subscribeToMiningNotification(): void {
        console.log('MiningService: subscribeToMiningNotification:');

        if (!this.$miningNotificationSubscription) {
            this.$miningNotificationSubscription = this.subscribeToNotification()
                .pipe(
                    tap((res: Notification) => {
                        const mining = res.message as Mining;
                        console.log('MiningService: subscribeToMiningNotification: type = ', res.type);

                        if (res.type === NOTIFICATION_TYPE.MINING_CREATE) {
                            this.createMinings.unshift(mining);
                            this.$createMinings.next(this.createMinings);
                            this.localNotificationService.attention({ title: `CREATE: ${mining.source.title}`, message: mining.text });
                        } else if (res.type === NOTIFICATION_TYPE.MINING_CHECK) {
                            this.checkMinings.push(mining);
                            this.$checkMinings.next(this.checkMinings);
                            // Remove from newMining
                            this.removeFromNewMining(mining.id);
                            this.localNotificationService.attention({ title: `CHECK: ${mining.source.title}`, message: mining.text });
                        } else if (res.type === NOTIFICATION_TYPE.MINING_DELETE) {
                            // Remove from newMining or checkMining
                            this.removeFromNewMining(mining.id);
                            this.removeFromCheckMining(mining.id);
                            this.localNotificationService.attention({ title: `DELETE: ${mining.source.title}`, message: mining.text });
                        }
                    }),
                )
                .subscribe();
        }
    }

    private removeFromNewMining(id) {
        if (this.createMinings !== null) {
            let index = this.createMinings.findIndex((al) => al.id === id);
            if (index !== -1) {
                this.createMinings.splice(index, 1);
                this.$createMinings.next(this.createMinings);
            }
        }
    }

    private removeFromCheckMining(id) {
        if (this.checkMinings !== null) {
            let index = this.checkMinings.findIndex((al) => al.id === id);
            if (index !== -1) {
                this.checkMinings.splice(index, 1);
                this.$checkMinings.next(this.checkMinings);
            }
        }
    }

    private subscribeToNotification(): Observable<Notification> {
        console.log('MiningService: subscribeToNotification:');

        return this.notificationService.listen().pipe(
            filter((res: Notification) => {
                return (
                    res.type === NOTIFICATION_TYPE.MINING_CREATE || 
                    res.type === NOTIFICATION_TYPE.MINING_CHECK || 
                    res.type === NOTIFICATION_TYPE.MINING_DELETE
                );
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
