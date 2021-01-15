import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { APIService } from '../api.service';
import { OntoPage, OntoPageExt } from '../../models/ontology/onto-page.model';
import { OntoPageFilterVm } from '../../models/ontology/onto-page-filter.vm';
import { PaginationModel } from '../../models/pagination.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class OntoPageService {
    private url = '/ontology';

    ontoPages: OntoPage[] = [];

    constructor(private api: APIService) {}

    public getPages(filter: OntoPageFilterVm): Observable<PaginationModel<OntoPage>> {
        let query: string = `${this.url}/pages/?bindingType=${filter.bindingType}&page=${filter.pageIndex}&pageCount=${filter.pageSize}&sortBy=${filter.sortBy}&sortOrder=${filter.sortOrder}`;
        if (filter.filter) {
            query = query.concat(`&filter=${filter.filter}`);
        }

        return this.api.get<PaginationModel<OntoPage>>(query).pipe(
            map((res: PaginationModel<OntoPage>) => {
                return res;
            })
        );
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

    public getOntoPageExt(pageId: string): Observable<OntoPageExt> {
        return this.api.get(`${this.url}/page/${pageId}`);
    }
}
