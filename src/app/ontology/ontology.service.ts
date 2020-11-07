import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APIService } from '../services/api.service';
import { Vis } from './models/vis.model';
import { Data } from './models/data.model';

@Injectable({
    providedIn: 'root',
})
export class OntologyService {
    private url = '/ontology';

    constructor(private api: APIService) {}

    //
    // Vis
    //
    public getAllVis(): Observable<Array<Vis>> {
        return this.api.get<Array<Vis>>(`${this.url}/vis`);
    }

    public getUser(id: string): Observable<Vis> {
        return this.api.get<Vis>(`${this.url}/${id}`);
    }

    public createUser(user: Vis): Observable<Vis> {
        return this.api.post<Vis>(this.url, user);
    }

    public updateUser(user: Vis): Observable<any> {
        return this.api.put(`${this.url}/${user.id}`, user);
    }

    //
    // Data
    //
    public getAllData(): Observable<Array<Data>> {
        return this.api.get<Array<Data>>(`${this.url}/data`);
    }
}
