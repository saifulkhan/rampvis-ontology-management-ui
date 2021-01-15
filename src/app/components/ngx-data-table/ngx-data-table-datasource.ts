import { DataSource } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, combineLatest } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OntoPageService } from '../../services/ontology/onto-page.service';

/**
 * Data source for the NgxDataTable view. This class should encapsulate all logic for
 * fetching and manipulating the displayed data (including sorting, pagination, and filtering).
 */
export class NgxDataTableDataSource extends DataSource<any> {
    public data!: any[];
    private _data!: any[];

    _filterChange = new BehaviorSubject<string>('');
    filteredData!: any[];

    get filter(): string {
        return this._filterChange.value;
    }
    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    constructor(
        private paginator: MatPaginator,
        private id: any,
        private sort: MatSort,
        private ontoPageService: OntoPageService
    ) {
        super();

        // this.ontoPageService.getBindings(this.id).subscribe((res: any[]) => {
        //     this._data = res;
        //     // Master detail table
        //     const rows: any[] = [];
        //     this._data.forEach((element) =>
        //         element.details ? rows.push(element, { detailRow: true, element }) : rows.push(element)
        //     );

        //     this.data = rows;
        // });
    }

    /**
     * Connect this data source to the table. The table will only update when
     * the returned stream emits new items.
     * @returns A stream of the items to be rendered.
     */
    connect(): Observable<any[]> {



        // Combine everything that affects the rendered data into one update stream for the data-table to consume.

        console.log('NgxDataTableDataSource:connect: 1 paginator = ', this.paginator, ', id = ', this.id);

        const dataMutations = [observableOf(this.id), this.paginator?.page, this.sort?.sortChange, this._filterChange];

        // Set the paginator length
        this.paginator.length = this.data.length;

        return merge(...dataMutations).pipe(
            map((res) => {

                console.log('NgxDataTableDataSource:connect: 2 res = ', res)
                const filtered = this._filterData(this._data);
                this.data = this._enrichData(filtered);
                return this.getPagedData(this.getSortedData([...this.data]));
            })
        );
    }

    private _enrichData(filtered: any) {
        const rows: any[] = [];
        filtered.forEach((element: any) =>
            element.details ? rows.push(element, { detailRow: true, element }) : rows.push(element)
        );
        return rows;
    }

    private _filterData(data: any[]) {
        this.filteredData = !this.filter
            ? data
            : data.filter((obj) => {
                  // Transform the data into a lowercase string of all property values.
                  const accumulator = (currentTerm: any, key: any) => currentTerm + obj[key];
                  const dataStr = Object.keys(obj).reduce(accumulator, '').toLowerCase();

                  // Transform the filter by converting it to lowercase and removing whitespace.
                  const transformedFilter = this.filter.trim().toLowerCase();

                  return dataStr.indexOf(transformedFilter) !== -1;
              });
        return this.filteredData;
    }

    /**
     * Called when the table is being destroyed. Use this function, to clean up
     * any open connections or free any held resources that were set up during connect.
     */
    disconnect() {}

    /**
     * Paginate the data (client-side). If you're using server-side pagination,
     * this would be replaced by requesting the appropriate data from the server.
     */
    private getPagedData(data: any[]) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }

    /**
     * Sort the data (client-side). If you're using server-side sorting,
     * this would be replaced by requesting the appropriate data from the server.
     */
    private getSortedData(data: any[]) {
        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            if (isNaN(a[this.sort.active])) {
                return compare(a[this.sort.active], b[this.sort.active], isAsc);
            } else {
                return compare(+a[this.sort.active], +b[this.sort.active], isAsc);
            }
        });
    }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: any, b: any, isAsc: any) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
