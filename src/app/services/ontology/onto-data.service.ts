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

        return this.api.post(url, query).pipe(map((d: any) => {
            return this.processKeywordsOfDiscovered(d, example)
        }));

    }

    getMockMatchingData(): any {
        const example = ONTO_DATA_EXAMPLE_DATA_MOCK_1;
        const discovered = ONTO_DATA_MATCHING_DATA_MOCK_1;
        return this.processKeywordsOfDiscovered(discovered, example)
    }

    /**
     * @param discovered
     * @param example
     *
     * TODO: any -> type
     */
    processKeywordsOfDiscovered(discovered: any, example: any) {
        console.log('processKeywordsOfDiscovered: discovered = ', discovered)

        //
        // 1 - intersection of all
        //
        const intersectionGroups: string[][] = discovered.map((d: any) => {
            const keywords: string[][] = d.group.map((d1: any) => {
                const keywords = d1.keywords.split(', ').filter((d: string) => d)
                return keywords;
            });
            const intersection: string[]= _.intersection(...keywords);
            return intersection;
        });

        const intersectionAll: string[] = _.intersection(...intersectionGroups);
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

        const processed = discovered.map((d: any) => {
            const keywords: string[][] = d.group.map((d1: any) => {
                const keywords = d1.keywords.split(', ').filter((d: string) => d);
                return keywords;
            });
            const intersection = _.intersection(...keywords);

            const differenceGroup = _.difference(intersection, intersectionAll);
            console.log('keywords = ', keywords, ', intersection = ', intersection);
            console.log('differenceGroup = ', differenceGroup);


            console.log('d.group = ', d.group);

            const processedGroup = d.group.map((s: any, i: number) => {
                const keywords = s.keywords.split(', ').filter((d: string) => d);
                console.log('1', s);
                console.log('2', d.group.length, example, example.length);

                if (d.group.length != example.length) {
                    console.log('2');

                    return {
                        ...s,
                        keywords: keywords,
                        iAll: intersectionAll,
                        iGroup: differenceGroup,
                        iExample: [],
                        iDataType: false
                    }
                }


                //
                // 3.
                //
                const intersectionExample: string[] = _.difference(_.intersection(keywords, example[i].keywords), intersectionAll);
                console.log('intersectionExample = ', intersectionExample);

                return {
                    ...s,
                    keywords: keywords.sort().sort((a: string, b: string) => sorter(intersectionAll, differenceGroup, intersectionExample, a, b)),
                    iAll: intersectionAll,
                    iGroup: differenceGroup,
                    iExample: intersectionExample,
                    iDataType: (example[i].dataType === s.dataType)
                };
            });


            console.log('\n')
            return { ...d, group: processedGroup };
        });

        console.log('processed = ', processed);
        return processed;
    }
}
