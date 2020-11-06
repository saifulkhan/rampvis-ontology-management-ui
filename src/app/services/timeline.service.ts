import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { Mining } from '../shared/models/mining.model';
import { NotificationService } from './notification.service';
import { Notification } from '../shared/models/notification.model';
import { NOTIFICATION_TYPE } from '../shared/models/notification-type.enum';
import { Timeline } from '../shared/timeline/timeline.model';
import { normalizeMiningToTimeline } from '../shared/timeline/helper/timeline.helper';

@Injectable({ 
    providedIn: 'root' 
})
export class TimelineService {
    public timelineStream$: ReplaySubject<Timeline> = new ReplaySubject<null>();
    private timelineStream: Timeline;

    private $miningNotificationSubscription: Subscription;

    constructor(private notificationService: NotificationService) {
        this.subscribeToMiningNotification();
    }

    //
    // Private methods
    //

    private subscribeToMiningNotification(): void {
        console.log('TimelineService: subscribeToMiningNotification:');

        if (!this.$miningNotificationSubscription) {
            this.$miningNotificationSubscription = this.subscribeToNotification()
                .pipe(
                    tap((res: Notification) => {
                        const mining = res.message as Mining;
                        console.log('TimelineService: subscribeToMiningNotification: type = ', res.type);
                        // this.timelineStream.unshift();
                        this.timelineStream$.next(normalizeMiningToTimeline(mining));
                    }),
                )
                .subscribe();
        }
    }

    private subscribeToNotification(): Observable<Notification> {
        console.log('TimelineService: subscribeToNotification:');

        return this.notificationService.listen().pipe(
            filter((res: Notification) => {
                return res.type === NOTIFICATION_TYPE.MINING_CREATE;
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
