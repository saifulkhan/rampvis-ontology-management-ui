import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import * as _ from "underscore";

import { APIService } from "../api.service";
import { OntoData, OntoDataSearch, OntoDataSearchGroup } from "../../models/ontology/onto-data.model";
import { PaginationModel } from "../../models/pagination.model";
import { DATA_TYPE } from "../../models/ontology/onto-data-types";
import { OntoDataFilterVm } from "../../models/ontology/onto-data-filter.vm";
import { OntoDataSearchFilterVm } from "../../models/ontology/onto-data-search-filter.vm";
import { environment } from "../../../environments/environment";
// import { ONTO_DATA_EXAMPLE_DATA_MOCK_1, ONTO_DATA_MATCHING_DATA_MOCK_1 } from '../../../assets/mock/onto-data-search-result-1.mock';
// import { ONTO_DATA_EXAMPLE_DATA_MOCK_2, ONTO_DATA_MATCHING_DATA_MOCK_2 } from '../../../assets/mock/onto-data-search-result-2.mock';
// import { ONTO_DATA_EXAMPLE_DATA_MOCK_3, ONTO_DATA_MATCHING_DATA_MOCK_3 } from '../../../assets/mock/onto-data-search-result-3.mock';
// import { MUST_KEYS_4, ONTO_DATA_EXAMPLE_DATA_MOCK_4, ONTO_DATA_MATCHING_DATA_MOCK_4 } from '../../../assets/mock/onto-data-search-result-4.mock';
import {
  MUST_KEYS_MOCK,
  EXAMPLE_DATA_MOCK,
  RESULT_MOCK,
} from "../../../assets/mock/simulate-error-stackbarchartwith6places.mock";

@Injectable({
  providedIn: "root",
})
export class OntoDataService {
  private url = "/ontology/data";
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
    console.log("OntoDataService:getAllData: url = ", url);
    return this.api.get<PaginationModel<OntoData>>(url);
  }

  public getAllData1(): Observable<PaginationModel<OntoData>> {
    console.log("OntoDataService:getAllData1:");
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

    console.log("OntoDataService:search: url = ", url);

    return this.api.get(url);
  }

  /**
   * @param query
   * @param example
   *
   * TODO: any -> type
   */
  public searchMatchingGroups(query: any, example: any): Observable<any> {
    let url: string = `${this.py_url}/propagation`;

    const mustKeys = query?.mustKeys;
    console.log("OntoDataService:searchMatchingGroups: mustKeys = ", mustKeys);

    if (false) {
      return of(this.showGroupsWithUsingMockData());
    } else {
      return this.api.post(url, query).pipe(
        map((d: any) => {
          return this.processKeywords(mustKeys, d, example);
        })
      );
    }
  }

  showGroupsWithUsingMockData(): any {
    const mustKeys = MUST_KEYS_MOCK;
    const example = EXAMPLE_DATA_MOCK;
    const discovered = RESULT_MOCK;
    return this.processKeywords(mustKeys, discovered, example);
  }

  /**
   * @param discovered
   * @param example
   *
   * TODO: any -> type
   */
  processKeywords(mustKeys: string[], discovered: any, example: any) {
    console.log("OntoDataService:processKeywords: discovered = ", discovered);

    //
    // 1. Intersection of keywords of all discovered data stream.
    //
    const _intersectionAll: string[][] = discovered.map((d: any) => {
      const keywords: string[][] = d.group.map((d1: any) => {
        const keywords = d1.keywords.split(", ").filter((d: string) => d);
        return keywords;
      });
      const intersection: string[] = _.intersection(...keywords);
      return intersection;
    });

    const intersectionAll: string[] = _.intersection(..._intersectionAll);
    const intersectionAllDiffMustKeys: string[] = _.difference(intersectionAll, mustKeys);
    console.log("intersectionAll = ", intersectionAll, "\nintersectionAllDiffMustKeys = ", intersectionAllDiffMustKeys);

    const processedKeywords = discovered.map((d: any) => {
      //
      // 2. Intersection of keywords in each group
      //
      const keywords: string[][] = d.group.map((d1: any) => {
        const keywords = d1.keywords.split(", ").filter((d: string) => d);
        return keywords;
      });

      let _intersectionGroup: string[] = [];
      // If we have a single data stream in a group, then intersection of it will return all keywords in it.
      if (keywords.length > 1) {
        _intersectionGroup = _.intersection(...keywords);
      }

      //const differenceGroup = _.difference(intersectionGroup, intersectionAll);
      const intersectionGroup = _.difference(_intersectionGroup, intersectionAllDiffMustKeys, intersectionAll);
      console.log(
        "keywords = ",
        keywords,
        "\n_intersectionGroup = ",
        _intersectionGroup,
        "\nintersectionGroup = ",
        intersectionGroup
      );

      console.log("d.group = ", d.group);

      const processedGroup = d.group.map((s: any, i: number) => {
        const keywords = s.keywords.split(", ").filter((d: string) => d);

        // When reference group != discovered group
        if (d.group.length != example.length) {
          return {
            ...s,
            keywords: keywords,
            mustKeys: mustKeys,
            iAll: intersectionAllDiffMustKeys,
            iGroup: intersectionGroup,
            iExample: [],
            iDataType: false,
          };
        }

        //
        // 3. Check remaining common keywords between reference data stream and discovered data stream
        //
        const _intersectionExample: string[] = _.intersection(keywords, example[i].keywords);
        const intersectionExample: string[] = _.difference(
          _intersectionExample,
          intersectionAll,
          intersectionAllDiffMustKeys,
          intersectionGroup
        );
        console.log(
          "example[i].keywords = ",
          example[i].keywords,
          "_intersectionExample = ",
          _intersectionExample,
          ", intersectionExample = ",
          intersectionExample
        );

        const _processedKeywords = {
          ...s,
          keywords: keywords
            .sort()
            .sort((a: string, b: string) =>
              this.sorter(intersectionAllDiffMustKeys, intersectionGroup, intersectionExample, a, b)
            ),
          mustKeys: mustKeys,
          iAll: intersectionAllDiffMustKeys,
          iGroup: intersectionGroup,
          iExample: intersectionExample,
          iDataType: example[i].dataType === s.dataType,
        };

        console.log("OntoDataService:processKeywords:_processedKeywords = ", _processedKeywords);
        return _processedKeywords;
      });

      console.log("\n");
      return { ...d, group: processedGroup };
    });

    //console.log('processedKeywords = ', processedKeywords);
    return processedKeywords;
  }

  // Sorting
  private sorter = (p1: string[], p2: string[], p3: string[], a: string, b: string) => {
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
}
