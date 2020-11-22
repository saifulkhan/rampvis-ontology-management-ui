import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { APIService } from '../api.service';
import { OntoData } from '../../models/ontology/onto-data.model';

@Injectable({
    providedIn: 'root',
})
export class OntoDataService {
    private url = '/ontology/data';

    ontoDataList: OntoData[] = [];

    constructor(private api: APIService) {}

    public getAllData(): Observable<Array<OntoData>> {
        return this.api.get<Array<OntoData>>(`${this.url}`).pipe(
            map((res) => {
                this.ontoDataList = res;
                return this.ontoDataList;
            }),
        );
    }

    public createData(ontoData: OntoData): Observable<OntoData> {
        return this.api.post<OntoData>(`${this.url}`, ontoData);
    }

    public updateData(ontoData: OntoData): Observable<OntoData> {
        return this.api.put(`${this.url}/${ontoData.id}`, ontoData);
    }

    public getData(dataId: string): Observable<OntoData> {
        console.log('OntoDataService:getData: ontoDataList = ', this.ontoDataList);
        const ontoData = this.ontoDataList.find((d: OntoData) => d.id === dataId);
        if (ontoData) return of(ontoData);
        else return this.api.get<OntoData>(`${this.url}/${dataId}`);
    }

    public deleteData(dataId: string): Observable<OntoData> {
        return this.api.delete(`${this.url}/${dataId}`);
    }
}
