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

    public getAllPages(ontoPageFilterVm: OntoPageFilterVm): Observable<PaginationModel<OntoPageExt>> {
        let url: string = `${this.url}/pages/?filterPageType=${ontoPageFilterVm?.filterPageType}`;

        if (ontoPageFilterVm?.pageIndex) {
            url = url.concat(`&pageIndex=${ontoPageFilterVm?.pageIndex}`);
        }
        if (ontoPageFilterVm?.pageSize) {
            url = url.concat(`&pageSize=${ontoPageFilterVm?.pageSize}`);
        }
        if (ontoPageFilterVm?.filterId) {
            url = url.concat(`&filterId=${ontoPageFilterVm.filterId}`);
        }
        if (ontoPageFilterVm?.sortBy) {
            url = url.concat(`&sortBy=${ontoPageFilterVm?.sortBy}`);
        }
        if (ontoPageFilterVm?.sortOrder) {
            url = url.concat(`&sortOrder=${ontoPageFilterVm?.sortOrder}`);
        }

        return this.api.get<PaginationModel<OntoPageExt>>(url);
    }

    public createPage(ontoPage: OntoPage): Observable<OntoPage> {
        return this.api.post<OntoPage>(`${this.url}/page`, ontoPage);
    }

    public updatePage(ontoPage: OntoPage): Observable<OntoPage> {
        return this.api.put(`${this.url}/page/${ontoPage.id}`, ontoPage);
    }

    public updatePageData(pageId: string, dataIds: string[]): Observable<any> {
        return this.api.put(`${this.url}/page/${pageId}/data`, dataIds);
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
