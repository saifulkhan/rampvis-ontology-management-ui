import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'underscore';

import { APIService } from '../api.service';
import { OntoData, OntoDataSearch, OntoDataSearchGroup } from '../../models/ontology/onto-data.model';
import { PaginationModel } from '../../models/pagination.model';
import { DATA_TYPE } from '../../models/ontology/onto-data-types';
import { OntoDataFilterVm } from '../../models/ontology/onto-data-filter.vm';
import { OntoDataSearchFilterVm } from '../../models/ontology/onto-data-search-filter.vm';
import { environment } from '../../../environments/environment';
import { ONTO_DATA_EXAMPLE_DATA_MOCK_1, ONTO_DATA_MATCHING_DATA_MOCK_1 } from '../../../assets/mock/onto-data-search-result-1.mock';
import { ONTO_DATA_EXAMPLE_DATA_MOCK_2, ONTO_DATA_MATCHING_DATA_MOCK_2 } from '../../../assets/mock/onto-data-search-result-2.mock';
import { ONTO_DATA_EXAMPLE_DATA_MOCK_3, ONTO_DATA_MATCHING_DATA_MOCK_3 } from '../../../assets/mock/onto-data-search-result-3.mock';

@Injectable({
    providedIn: 'root',
})
export class OntoDataService {
    private url = '/ontology/data';
    private py_url = environment.components.API_PY;

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
        let url: string = `${this.url}/search/?query=${ontoDataSearchFilterVm.query}`;

        if (ontoDataSearchFilterVm.dataType) {
            url = url.concat(`&dataType=${ontoDataSearchFilterVm.dataType}`);
        }
        if (ontoDataSearchFilterVm.visId) {
            url = url.concat(`&visId=${ontoDataSearchFilterVm.visId}`);
        }

        console.log('OntoDataService:search: url = ', url);

        return this.api.get(url);
    }

    /**
     * @param query
     * @param example
     *
     * TODO: any -> type
     */
    public searchMatchingGroups(query: any, example: any): Observable<any> {
        let url: string = `${this.py_url}/onto-data/search/group`;

        // const example = ONTO_DATA_EXAMPLE_GROUP_MOCK;
        // const matched = ONTO_DATA_MATCHING_GROUP_MOCK;

        return this.api.post(url, query).pipe(map((d: any) => {
            return this.processMatchedData(d, example)
        }));
    }

    getMockMatchingData(): any {
        const example = ONTO_DATA_EXAMPLE_DATA_MOCK_3;
        const matched = ONTO_DATA_MATCHING_DATA_MOCK_3;
        return this.processMatchedData(matched, example)
    }

    /**
     * @param matched
     * @param example
     *
     * TODO: any -> type
     */
    processMatchedData(matched: any, example: any) {
        //
        // 1 - intersection of all
        //

        const intersection = matched.map((d: any) => {
            const keywords: string[][] = d.group.map((d1: any) => {
                const keywords = d1.keywords.split(', ');
                return keywords;
            });

            //console.log('keywords = ', keywords);
            const intersection = _.intersection(...keywords);
            //console.log('intersection = ', intersection);
            return intersection;
        });

        const intersectionAll: string[] = _.intersection(...intersection);
        console.log('intersectionAll = ', intersectionAll);

        //
        // 2 - intersection in group
        //

        const sorter = (p1: string[], p2: string[], p3: string[], a: string, b: string) => {
            // The unmatched ones will be sorted to end
            let aRank = 0,
                bRank = 0;

            p1.includes(a) && (aRank = 3);
            p2.includes(a) && (aRank = 2);
            p3.includes(a) && (aRank = 1);

            p1.includes(b) && (bRank = 3);
            p2.includes(b) && (bRank = 2);
            p3.includes(b) && (bRank = 1);

            return bRank - aRank;
        };

        const matched1 = matched.map((d: any) => {
            const keywords: string[][] = d.group.map((d1: any) => {
                const keywords = d1.keywords.split(', ');
                return keywords;
            });

            const intersection = _.intersection(...keywords);

            //console.log('keywords = ', _.union(...keywords), '\nintersection = ', intersection);

            const intersectionGroup = _.difference(intersection, intersectionAll);
            console.log('intersectionGroup = ', intersectionGroup);

            const obj = d.group.map((d1: any, i: number) => {
                // const keywords = d1.keywords.split(', ');
                console.log(i);
                const keywords = d1.keywords.split(', ');

                //
                // 3.
                //
                const intersectionExample: string[] = _.difference(_.intersection(keywords, example[i].keywords), intersectionAll);
                console.log(intersectionExample);
                return {
                    ...d1,
                    keywords: keywords.sort().sort((a: string, b: string) => sorter(intersectionAll, intersectionGroup, intersectionExample, a, b)),
                    iAll: intersectionAll,
                    iGroup: intersectionGroup,
                    iExample: intersectionExample,
                    iDataType: (example[i].dataType === d1.dataType)
                };
            });

            return { ...d, group: obj };
            // return intersection;
        });

        console.log('matched1 = ', matched1);

        return matched1;
    }
}
