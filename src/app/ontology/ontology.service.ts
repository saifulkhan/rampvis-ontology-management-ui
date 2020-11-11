import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { APIService } from '../services/api.service';
import { OntoVis } from './models/onto-vis.model';
import { OntoData } from './models/onto-data.model';
import { OntoPage } from './models/onto-page.model';

@Injectable({
    providedIn: 'root',
})
export class OntologyService {
    private url = '/ontology';

    ontoDataList: OntoData[] = [];
    ontoVisList: OntoVis[] = [];
    ontoPageList: OntoPage[] = [];

    constructor(private api: APIService) {}

    //
    // Vis
    //
    public getAllVis(): Observable<Array<OntoVis>> {
        return this.api.get<Array<OntoVis>>(`${this.url}/vis`);
    }

    public createVis(ontoVis: OntoVis): Observable<OntoVis> {
        return this.api.post<OntoVis>(`${this.url}/vis/create`, ontoVis);
    }

    // TODO: update pass param id
    public updateVis(ontoVis: OntoVis): Observable<OntoVis> {
        return this.api.put(`${this.url}/vis/update`, ontoVis);
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

    public createData(ontoData: OntoData): Observable<OntoData> {
        return this.api.post<OntoData>(`${this.url}/data/create`, ontoData);
    }

    // TODO: update pass param id
    public updateData(ontoData: OntoData): Observable<OntoData> {
        return this.api.put(`${this.url}/data/update`, ontoData);
    }

    public getData(dataId: string): Observable<OntoData> {
        console.log('getData: ontoDataList = ', this.ontoDataList);
        const ontoData = this.ontoDataList.find((d: OntoData) => d.id === dataId);
        if (ontoData) {
            return of(ontoData)
        }
        else { 
            return this.api.get<OntoData>(`${this.url}/data/${dataId}`) 
        }
    }

    //
    // Page
    //
    public getAllPage(): Observable<Array<OntoPage>> {
        return this.api.get<Array<OntoPage>>(`${this.url}/page`);
    }

    public createPage(ontoPage: OntoPage): Observable<OntoPage> {
        return this.api.post<OntoPage>(`${this.url}/page/create`, ontoPage);
    }

    // TODO: update pass param id
    public updatePage(ontoPage: OntoPage): Observable<OntoPage> {
        return this.api.put(`${this.url}/page/update`, ontoPage);
    }
}
