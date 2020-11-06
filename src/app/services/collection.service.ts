import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { APIService } from './api.service';
import { Collection } from '../shared/models/collection.model';
import { Source } from '../shared/models/source.model';
import { Mining } from '../shared/models/mining.model';
import { NotificationService } from './notification.service';
import { NOTIFICATION_TYPE } from '../shared/models/notification-type.enum';
import { Notification } from '../shared/models/notification.model';

@Injectable({
    providedIn: 'root',
})
export class CollectionService {
    private url = '/collection';

    // All collections
    public $collections: ReplaySubject<Collection[]> = new ReplaySubject<[]>();
    private collections: Collection[] = [];

    // Selected sources
    public $sources: ReplaySubject<Source[]> = new ReplaySubject<[]>();
    private sources: Source[] = [];

    private $notificationSubscription: Subscription;

    constructor(
        private api: APIService,
        private notificationService: NotificationService, 
    ) {
        this.subscribeToNotification();
    }

    //
    // Collection
    //
    public getAllCollection(): Observable<Array<Collection>> {
        return this.api.get<Array<Collection>>(`${this.url}`).pipe(
            map((result) => {
                this.collections = result;
                this.$collections.next(this.collections);

                return this.collections;
            }),
        );
    }

    public createCollection(data: Collection): Observable<Collection> {
        return this.api.post<Collection>(`${this.url}`, data);
    }

    public getCollection(collectionId: string): Observable<Collection> {
        return this.api.get<Collection>(`${this.url}/${collectionId}`);
    }

    public updateCollection(collection: Collection): any {
        return this.api.put<any>(`${this.url}/${collection.id}`, collection);
    }

    public deleteCollection(collectionId: string): any {
        return this.api.delete<any>(`${this.url}/${collectionId}`);
    }

    //
    // Source
    //

    public getSourcesOfCollection(id: string): Observable<Array<Source>> {
        this.sources = [];
        this.$sources.next(this.sources);

        return this.api.get<Array<Source>>(`${this.url}/${id}/source`).pipe(
            map((result) => {
                this.sources = result;
                this.$sources.next(this.sources);
                return this.sources;
            }),
        );
    }

    public createSource(id: string, data: Source): Observable<Source> {
        return this.api.post<Source>(`${this.url}/${id}/source`, data);
    }

    public removeSourceFromCollection(collectionId: string, sourceId: string): Observable<any> {
        return this.api.delete<any>(`${this.url}/${collectionId}/source/${sourceId}`);
    }

    //
    // Mining
    //
    public getMiningMetadata(collectionId: string, sourceId: string): Observable<Mining[]> {
        return this.api.get<Mining[]>(`${this.url}/${collectionId}/source/${sourceId}/mining`);
    }

    public getMiningData(collectionId: string, sourceId: string, miningId: string): Observable<Mining[]> {
        return this.api.get<Mining[]>(`${this.url}/${collectionId}/source/${sourceId}/mining/${miningId}`);
    }

    public startMiningOfCollection(collectionId: string): Observable<void> {
        return this.api.post<void>(`${this.url}/${collectionId}/mining`, {} as any);
    }


    //
    // Notification handle
    //


    private subscribeToNotification(): void {
        console.log('CollectionService: subscribeToNotification:');

        if (!this.$notificationSubscription) {
            this.$notificationSubscription = this.receiveNotification()
                .pipe(
                    tap((res: Notification) => {
                        console.log('CollectionService: subscribeToNotification: type = ', res.type);

                        if (res.type === NOTIFICATION_TYPE.COLLECTION_UPDATE) {
                            const collection = res.message as Collection;

                            if (this.collections !== null) {
                                let index = this.collections.findIndex((al) => al.id === collection.id);
                                if (index !== -1) {
                                    this.collections[index] = collection;
                                    this.$collections.next(this.collections);
                                }
                            }
                        } 

                        if (res.type === NOTIFICATION_TYPE.SOURCE_UPDATE) {
                            const source = res.message as Source;

                            if (this.sources !== null) {
                                let index = this.sources.findIndex((al) => al.id === source.id);
                                if (index !== -1) {
                                    this.sources[index] = source;
                                    this.$sources.next(this.sources);
                                }
                            }
                        } 
                    }),
                )
                .subscribe();
        }
    }

    private receiveNotification(): Observable<Notification> {
        console.log('MiningService: subscribeToNotification:');

        return this.notificationService.listen().pipe(
            filter((res: Notification) => {
                return (
                    res.type === NOTIFICATION_TYPE.COLLECTION_UPDATE ||
                    res.type === NOTIFICATION_TYPE.SOURCE_UPDATE
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
