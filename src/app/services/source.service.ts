import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APIService } from '../services/api.service';
import { Mining } from '../shared/models/mining.model';
import { Source } from '../shared/models/source.model';

@Injectable({
    providedIn: 'root',
})
export class SourceService {
    private url = '/source';

    constructor(private api: APIService) {}

    public getSource(sourceId: string): Observable<Source> {
        return this.api.get<Source>(`${this.url}/${sourceId}`);
    }

    public getMinings(sourceId: string): Observable<Mining[]> {
        return this.api.get<Mining[]>(`${this.url}/${sourceId}/mining`);
    }

    public updateSource(id: string, data: Source): Observable<any> {
        return this.api.put<Source>(`${this.url}/${id}`, data);
    }
}
