import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { APIService } from '../api.service';
import { OntoData, OntoDataSearch } from '../../models/ontology/onto-data.model';
import { OntoDataFilterVm } from '../../models/ontology/onto-data-filter.vm';
import { PaginationModel } from '../../models/pagination.model';
import { DATA_TYPE } from 'src/app/models/ontology/onto-data-types';

@Injectable({
    providedIn: 'root',
})
export class OntoDataService {
    private url = '/ontology/data';

    constructor(private api: APIService) {}

    public getAllData(filter: OntoDataFilterVm): Observable<PaginationModel<OntoData>> {
        let query: string = `${this.url}/?page=${filter.page}&pageCount=${filter.pageCount}&sortBy=${filter.sortBy}&sortOrder=${filter.sortOrder}`;
       
        if (filter.dataType) {
            query = query.concat(`&dataType=${filter.dataType}`);
        }
        if (filter.filter) {
            query = query.concat(`&filter=${filter.filter}`);
        }
        console.log('OntoDataService:getAllData: query = ', query);
        return this.api.get<PaginationModel<OntoData>>(query);
    }

    public getAllData1(): Observable<PaginationModel<OntoData>> {
        console.log('OntoDataService:getAllData1:');
        return this.api.get<PaginationModel<OntoData>>(`${this.url}`);
    }

    public createData(ontoData: OntoData): Observable<OntoData> {
        return this.api.post<OntoData>(`${this.url}`, ontoData);
    }

    public updateData(ontoData: OntoData): Observable<OntoData> {
        return this.api.put(`${this.url}/${ontoData.id}`, ontoData);
    }

    public getData(dataId: string): Observable<OntoData> {
        return this.api.get<OntoData>(`${this.url}/${dataId}`);
    }

    public deleteData(dataId: string): Observable<OntoData> {
        return this.api.delete(`${this.url}/${dataId}`);
    }

    public suggest(query: string, dataType: DATA_TYPE = undefined as any): Observable<OntoDataSearch[]> {
        let url: string = `${this.url}/suggest/?query=${query}`
        if (dataType) {
            url = url.concat(`&dataType=${dataType}`);
        }
        return this.api.get(url);
    }

    public search(query: string, dataType: DATA_TYPE = undefined as any): Observable<OntoData[]> {
        let url: string = `${this.url}/search/?query=${query}`
        if (dataType) {
            url = url.concat(`&dataType=${dataType}`);
        }
        return this.api.get(url);
    }
}
