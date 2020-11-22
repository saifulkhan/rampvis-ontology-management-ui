import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { APIService } from '../api.service';
import { OntoVis } from '../../models/ontology/onto-vis.model';

@Injectable({
    providedIn: 'root',
})
export class OntoVisService {
    private url = '/ontology/vis';

    ontoVisList: OntoVis[] = [];

    constructor(private api: APIService) {}

    public getAllVis(): Observable<Array<OntoVis>> {
        return this.api.get<Array<OntoVis>>(`${this.url}`);
    }

    public createVis(ontoVis: OntoVis): Observable<OntoVis> {
        return this.api.post<OntoVis>(`${this.url}`, ontoVis);
    }

    public updateVis(ontoVis: OntoVis): Observable<OntoVis> {
        return this.api.put(`${this.url}/${ontoVis.id}`, ontoVis);
    }

    public deleteVis(visId: string): Observable<OntoVis> {
        return this.api.delete(`${this.url}/${visId}`);
    }
}
