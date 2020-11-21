import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { APIService } from '../services/api.service';
import { OntoVis } from './models/onto-vis.model';
import { OntoData } from './models/onto-data.model';
import { OntoPage } from './models/onto-page.model';
import { OntoPageFilterVm } from './models/onto-page-filter.vm';
import { PaginationModel } from '../shared/models/pagination.model';

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
        return this.api.post<OntoVis>(`${this.url}/vis`, ontoVis);
    }

    public updateVis(ontoVis: OntoVis): Observable<OntoVis> {
        return this.api.put(`${this.url}/vis/${ontoVis.id}`, ontoVis);
    }

    public deleteVis(visId: string): Observable<OntoPage> {
        return this.api.delete(`${this.url}/vis/${visId}`);
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
        return this.api.post<OntoData>(`${this.url}/data`, ontoData);
    }

    public updateData(ontoData: OntoData): Observable<OntoData> {
        return this.api.put(`${this.url}/data/${ontoData.id}`, ontoData);
    }

    public getData(dataId: string): Observable<OntoData> {
        console.log('OntologyService:getData: ontoDataList = ', this.ontoDataList);
        const ontoData = this.ontoDataList.find((d: OntoData) => d.id === dataId);
        if (ontoData) return of(ontoData)
        else return this.api.get<OntoData>(`${this.url}/data/${dataId}`) 
    }

    public deleteData(dataId: string): Observable<OntoPage> {
        return this.api.delete(`${this.url}/data/${dataId}`);
    }

    //
    // Page
    //
    public getPages(filter: OntoPageFilterVm): Observable<PaginationModel<OntoPage>> {
        let query: string = `${this.url}/pages/?publishType=${filter.publishType}&page=${filter.page}&pageCount=${filter.pageCount}&sortBy=${filter.sortBy}&sortOrder=${filter.sortOrder}`;
        if (filter.filter) {
            query = query.concat(`&filter=${filter.filter}`);
        }

        console.log('OntologyService:getPages: query = ', query);
        return this.api.get<PaginationModel<OntoPage>>(query);
    }

    
    public getAllPage(): Observable<Array<OntoPage>> {
        return this.api.get<Array<OntoPage>>(`${this.url}/page`);
    }

    public createPage(ontoPage: OntoPage): Observable<OntoPage> {
        return this.api.post<OntoPage>(`${this.url}/page`, ontoPage);
    }

    public updatePage(ontoPage: OntoPage): Observable<OntoPage> {
        return this.api.put(`${this.url}/page/${ontoPage.id}`, ontoPage);
    }

    public deletePage(pageId: string): Observable<OntoPage> {
        return this.api.delete(`${this.url}/page/${pageId}`);
    }
}
