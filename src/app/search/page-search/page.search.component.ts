import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { switchMap, map, catchError, debounceTime, tap, timeoutWith } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { SearchService } from '../search.service';
import { BehaviorSubject, of } from 'rxjs';
import { ErrorHandler2Service } from 'src/app/services/common/error-handler-2.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-page-search',
    templateUrl: 'page.search.component.html',
})
export class TwitterSearchComponent implements OnInit, AfterViewInit {
    searchQuery: string;
    filterValue: string;
    searchTerm$ = new BehaviorSubject<string>('');
    searchResults: Array<string> = [];
    filteredSearchResults: Array<SafeHtml> = [];
    isLoadingResults = false;
    isFilteringResults = false;

    searchTypes: any = SearchService.SEARCH_TYPE;
    searchType: string = this.searchTypes.KEYWORD;

    constructor(private searchService: SearchService, private sanitizer: DomSanitizer, private errorHandler2Service: ErrorHandler2Service) {}

    ngOnInit() {}

    ngAfterViewInit(): void {
        merge(this.searchTerm$)
            .pipe(
                tap(() => (this.isFilteringResults = true)),
                debounceTime(300),
                switchMap(() => {
                    const results: Array<SafeHtml> = [];
                    this.searchResults.filter((r) => {
                        let tags: Array<string> = [];
                        if(this.searchTerm$.value) {
                            tags = this.searchTerm$.value.split(" ");
                        }
                        const highlight: SafeHtml = this.highlightSearch(r, tags);
                        highlight && results.push(highlight);
                    });
                    return of(results);
                }),
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                }),
            )
            .subscribe((data) => {
                this.filteredSearchResults = data;
                this.isFilteringResults = false;
            });
    }

    query(): void {
        if (!this.searchQuery) {
            return;
        }
        this.isLoadingResults = true;
        const query: string = this.searchQuery;

        this.clearResults();

        this.searchService.queryTweets(this.searchType, query).subscribe(
            (result) => {
                this.searchResults = result;
                this.filteredSearchResults = result.filter((f) => f);
            },
            (err) => {},
            () => (this.isLoadingResults = false),
        );
    }

    private clearResults(): void {
        this.searchResults.splice(0, this.searchResults.length);
        this.filteredSearchResults.splice(0, this.filteredSearchResults.length);
        this.filterValue = "";
    }

    private highlightSearch(text: string, args: Array<string>): SafeHtml {
        args = args.filter(arg => arg);
        if (!args || !args.length) {
            return text;
        }
        args = args.map(arg => this.escapeRegExp(arg));
        const query: string = args.join('|');

        // Match in a case insensitive maneer
        const re = new RegExp(query, 'gi');
        const match = text.match(re);

        // If there's no match, just return the original text.
        if (!match) {
            return null;
        }

        const result = text.replace(re, match => `<mark>${match}</mark>`);
        return this.sanitizer.bypassSecurityTrustHtml(result);
    }

    private escapeRegExp(text: string): string {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

}
