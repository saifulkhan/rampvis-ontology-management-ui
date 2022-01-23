import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { APIService } from "../api.service";
import { OntoPage, OntoPageExt, OntoPageExtSearchGroup } from "../../models/ontology/onto-page.model";
import { OntoPageFilterVm } from "../../models/ontology/onto-page-filter.vm";
import { PaginationModel } from "../../models/pagination.model";
import { PAGE_TYPE } from "../../models/ontology/page-type.enum";
import { VIS_TYPE } from "src/app/models/ontology/onto-vis-type.enum";

@Injectable({
  providedIn: "root",
})
export class OntoPageService {
  private url = "/ontology";

  constructor(private api: APIService) {}

  public getAllPages(
    pageType: PAGE_TYPE,
    ontoPageFilterVm: OntoPageFilterVm = null as any
  ): Observable<PaginationModel<OntoPageExt>> {
    console.log("OntoPageService:getAllPages: pageType =", pageType, "ontoPageFilterVm=", ontoPageFilterVm);

    let url: string = `${this.url}/pages/`;
    if (pageType) url = url.concat(`${pageType}/`);

    if (ontoPageFilterVm?.pageIndex.toString()) url = url.concat(`?pageIndex=${ontoPageFilterVm?.pageIndex}`);
    if (ontoPageFilterVm?.pageSize) url = url.concat(`&pageSize=${ontoPageFilterVm?.pageSize}`);
    if (ontoPageFilterVm?.filterId) url = url.concat(`&filterId=${ontoPageFilterVm?.filterId}`);
    if (ontoPageFilterVm?.sortOrder) url = url.concat(`&sortOrder=${ontoPageFilterVm?.sortOrder}`);
    if (ontoPageFilterVm?.sortBy) url = url.concat(`&sortBy=${ontoPageFilterVm?.sortBy}`);

    console.log("OntoPageService:getAllPages: url = ", url);
    return this.api.get<PaginationModel<OntoPageExt>>(url);
  }

  public createPage(ontoPage: OntoPage): Observable<OntoPage> {
    return this.api.post<OntoPage>(`${this.url}/page`, ontoPage);
  }

  public createPages(ontoPages: OntoPage[]): Observable<any> {
    return this.api.post<any>(`${this.url}/pages`, ontoPages);
  }

  public updatePage(ontoPage: OntoPage): Observable<OntoPage> {
    return this.api.put(`${this.url}/page/${ontoPage.id}`, ontoPage);
  }

  public updatePageDataIds(pageId: string, dataIds: string[]): Observable<any> {
    return this.api.put(`${this.url}/page/${pageId}/data`, { dataIds: dataIds });
  }

  public updatePageType(pageId: string, pageType: PAGE_TYPE): Observable<any> {
    return this.api.put(`${this.url}/page/${pageId}/pagetype`, { pageType: pageType });
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
