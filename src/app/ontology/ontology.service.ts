import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APIService } from '../services/api.service';
import { OntoVis } from './models/onto-vis.model';
import { OntoData } from './models/onto-data.model';
import { OntoPage } from './models/onto-page.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class OntologyService {
    private url = '/ontology';

    ontoDataList: OntoData[] = [];

    constructor(private api: APIService) {}

    //
    // Vis
    //
    public getAllVis(): Observable<Array<OntoVis>> {
        return this.api.get<Array<OntoVis>>(`${this.url}/vis`);
    }

    public getUser(id: string): Observable<OntoVis> {
        return this.api.get<OntoVis>(`${this.url}/${id}`);
    }

    public createUser(user: OntoVis): Observable<OntoVis> {
        return this.api.post<OntoVis>(this.url, user);
    }

    public updateUser(user: OntoVis): Observable<any> {
        return this.api.put(`${this.url}/${user.id}`, user);
    }

    //
    // Data
    //
    public getAllData(): Observable<Array<OntoData>> {
        return this.api.get<Array<OntoData>>(`${this.url}/data`).pipe(
            map((res) => {
                this.ontoDataList = res;
                return this.ontoDataList;
            }),
        );
    }

    //
    // Page
    //
    public getAllPage(): Observable<Array<OntoPage>> {
        return this.api.get<Array<OntoPage>>(`${this.url}/page`);
    }
}
