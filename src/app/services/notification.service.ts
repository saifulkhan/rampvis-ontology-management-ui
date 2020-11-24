import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { APIService } from './api.service';
import { Notification } from '../models/notification.model';
import { NOTIFICATION_TOPIC } from '../models/notification-topic.enum';

@Injectable()
export class NotificationService {
    private registrationToken!: string;
    private url = '/notification';

    $notificationSubject: Subject<any> = new Subject<any>();

    constructor(
        private angularFireMessaging: AngularFireMessaging,
        private api: APIService
    ) {
        this.angularFireMessaging.messages.subscribe((message) => {
            console.log('NotificationService: message: ', message);
        });
    }

    //
    // Request permission
    // Registration process
    //
    register() {
        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                this.registrationToken = token as string;
                console.log('NotificationService: register: registrationToken = ', this.registrationToken );
                this.subscribe(this.registrationToken);
            },
            (err) => {
                console.error('NotificationService: register: Unable to get permission to notify. err = ', err );
            }
        );
    }

    subscribe(registrationToken: string): Observable<any> {
        // TODO not a best way

        const promise: Observable<any> = this.api.post<any>(
            `${this.url}/subscribe`,
            {
                registrationToken,
                topics: [NOTIFICATION_TOPIC.FACEBOOK, NOTIFICATION_TOPIC.LOG],
            }
        );
        promise.subscribe(
            () => {
                // console.log('NotificationService: subscribe: success');
                this.receiveMessage();
            },
            (err) => {
                console.log('NotificationService: subscribe: error =  ', err);
                this.unsubscribe(registrationToken);
            }
        );

        return promise;
    }

    unsubscribe(registrationToken: string): Observable<any> {
        if (!registrationToken) {
            return of(false);
        }

        // TODO not a best way
        const promise: Observable<any> = this.api.post<any>(
            `${this.url}/unsubscribe`,
            {
                registrationToken,
                topics: [NOTIFICATION_TOPIC.FACEBOOK, NOTIFICATION_TOPIC.LOG],
            }
        );
        promise.subscribe(
            () => {
                this.registrationToken = null as any;
            },
            (err) => {
                this.registrationToken = null as any;
                console.log('NotificationService: unsubscribe: error =  ', err);
            }
        );

        return promise;
    }

    getRegistrationToken(): string {
        return this.registrationToken;
    }

    //
    // Listen to notification reception in f/g
    //

    private receiveMessage() {
        this.angularFireMessaging.messages.subscribe((payload: any) => {
            const notificationData: any = new Notification().deserialize( payload.data );
            console.log( 'NotificationService: receiveMessage: payload = ', payload );
            console.log( 'NotificationService: receiveMessage: notification = ', notificationData );

            this.$notificationSubject.next(notificationData);
        });
    }

    public listen(): Observable<Notification> {
        return this.$notificationSubject.asObservable();
    }

    //
    // Cleanup
    //

    ngOnDestroy(): void {
        // TODO
    }
}
