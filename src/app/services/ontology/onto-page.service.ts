import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { APIService } from '../api.service';
import { OntoPage, OntoPageExt, OntoPageExtSearchGroup } from '../../models/ontology/onto-page.model';
import { OntoPageFilterVm } from '../../models/ontology/onto-page-filter.vm';
import { PaginationModel } from '../../models/pagination.model';

@Injectable({
    providedIn: 'root',
})
export class OntoPageService {
    private url = '/ontology';

    constructor(private api: APIService) {}

    public getAllPages(filter: OntoPageFilterVm): Observable<PaginationModel<OntoPageExt>> {
        let url: string = `${this.url}/pages/?bindingType=${filter?.bindingType}`;

        if (filter?.pageIndex) {
            url = url.concat(`&page=${filter?.pageIndex}`);
        }
        if (filter?.pageSize) {
            url = url.concat(`&pageCount=${filter?.pageSize}`);
        }
        if (filter?.filter) {
            url = url.concat(`&filter=${filter.filter}`);
        }
        if (filter?.sortBy) {
            url = url.concat(`&sortBy=${filter?.sortBy}`);
        }
        if (filter?.sortOrder) {
            url = url.concat(`&sortOrder=${filter?.sortOrder}`);
        }

        return this.api.get<PaginationModel<OntoPageExt>>(url);
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

    public searchGroup(visId: string): Observable<OntoPageExtSearchGroup> {
        let url: string = `${this.url}/pages/search-group/?visId=${visId}`;
        return this.api.get(url);
    }
}
