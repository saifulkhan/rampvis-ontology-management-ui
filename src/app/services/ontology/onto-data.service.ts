import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { APIService } from '../api.service';
import { OntoData, OntoDataSearch } from '../../models/ontology/onto-data.model';
import { PaginationModel } from '../../models/pagination.model';
import { DATA_TYPE } from '../../models/ontology/onto-data-types';
import { OntoDataFilterVm } from '../../models/ontology/onto-data-filter.vm';
import { OntoDataSearchFilterVm } from '../../models/ontology/onto-data-search-filter.vm';

@Injectable({
    providedIn: 'root',
})
export class OntoDataService {
    private url = '/ontology/data';

    constructor(private api: APIService) {}

    public getAllData(filter: OntoDataFilterVm): Observable<PaginationModel<OntoData>> {
        let url: string = `${this.url}/?pageIndex=${filter.pageIndex}&pageSize=${filter.pageSize}&sortBy=${filter.sortBy}&sortOrder=${filter.sortOrder}`;

        if (filter.dataType) {
            url = url.concat(`&dataType=${filter.dataType}`);
        }
        if (filter.filter) {
            url = url.concat(`&filter=${filter.filter}`);
        }
        console.log('OntoDataService:getAllData: url = ', url);
        return this.api.get<PaginationModel<OntoData>>(url);
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
        let url: string = `${this.url}/suggest/?query=${query}`;
        if (dataType) {
            url = url.concat(`&dataType=${dataType}`);
        }
        return this.api.get(url);
    }

    public search(ontoDataSearchFilterVm: OntoDataSearchFilterVm): Observable<PaginationModel<OntoData>> {
        let url: string = `${this.url}/search/?query=${ontoDataSearchFilterVm.query}&pageIndex=${ontoDataSearchFilterVm.pageIndex}&pageSize=${ontoDataSearchFilterVm.pageSize}&sortBy=${ontoDataSearchFilterVm.sortBy}&sortOrder=${ontoDataSearchFilterVm.sortOrder}`;

        if (ontoDataSearchFilterVm.dataType) {
            url = url.concat(`&dataType=${ontoDataSearchFilterVm.dataType}`);
        }
        if (ontoDataSearchFilterVm.filter) {
            url = url.concat(`&filter=${ontoDataSearchFilterVm.filter}`);
        }
        if (ontoDataSearchFilterVm.visId) {
            url = url.concat(`&visId=${ontoDataSearchFilterVm.visId}`);
        }

        console.log('OntoDataService:search: url = ', url);

        return this.api.get(url);
    }
}
