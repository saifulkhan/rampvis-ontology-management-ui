import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { APIService } from '../api.service';
import { OntoVis, OntoVisSearch } from '../../models/ontology/onto-vis.model';
import { OntoData } from '../../models/ontology/onto-data.model';
import { OntoVisSearchFilterVm } from '../../models/ontology/onto-vis-search-filter.vm';

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

    public getOntoVis(id: string): Observable<OntoVis> {
        return this.api.get<OntoVis>(`${this.url}/${id}`);
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

    public getExamplePagesBindingVisId(visId: string): Observable<OntoData[]> {
        return this.api.get(`${this.url}/${visId}/data`);
    }

    public suggest(query: string): Observable<OntoVisSearch[]> {
        let url: string = `${this.url}/suggest/?query=${query}`;
        return this.api.get(url);
    }

    public search(ontoDataSearchFilterVm: OntoVisSearchFilterVm): Observable<OntoVisSearch[]> {
        let url: string = `${this.url}/search/?query=${ontoDataSearchFilterVm.query}`;

        console.log('OntoDataService:search: url = ', url);

        return this.api.get(url);
    }
}
