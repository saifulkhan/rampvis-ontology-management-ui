import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { APIService } from '../api.service';
import { OntoPage } from '../../models/ontology/onto-page.model';
import { OntoPageFilterVm } from '../../models/ontology/onto-page-filter.vm';
import { PaginationModel } from '../../models/pagination.model';

@Injectable({
    providedIn: 'root',
})
export class OntoPageService {
    private url = '/ontology';

    ontoPageList: OntoPage[] = [];

    constructor(private api: APIService) {}
    //
    // Page
    //
    public getPages(filter: OntoPageFilterVm): Observable<PaginationModel<OntoPage>> {
        let query: string = `${this.url}/pages/?bindingType=${filter.bindingType}&page=${filter.pageIndex}&pageCount=${filter.pageSize}&sortBy=${filter.sortBy}&sortOrder=${filter.sortOrder}`;
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
