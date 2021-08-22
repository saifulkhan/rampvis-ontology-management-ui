import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { switchMap, map, catchError, debounceTime, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { BehaviorSubject } from 'rxjs';
import { merge } from 'rxjs/internal/observable/merge';
import * as moment from 'moment';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { TableData } from '../../../models/table.data.interface';
import { Activity } from '../../../models/activity.model';
import { ActivitiesService } from '../activities.service';
import { ActivitiesFiterVm } from '../../../models/activities-filter.vm';
import { ErrorHandler2Service } from '../../../services/error-handler-2.service';

@Component({
    selector: 'app-activities-list',
    templateUrl: 'activities.list.component.html'
})
export class ActivitiesListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;

    public dataTable: TableData = {
        headerRow: ['name', 'role', 'type', 'action', 'createdAt'],
        dataRows: [],
    };
    dataSource: MatTableDataSource<Activity> = new MatTableDataSource();
    isLoadingResults = true;
    resultsLength = 0;
    searchTerm$ = new BehaviorSubject<string>('');
    activity: any = [];
    debounceTimer: any = null;
    activityDataFilter = {
        startDate: moment(),
        endDate: moment(),
    };

    constructor(
        private router: Router,
        private activitiesService: ActivitiesService,
        private errorHandler2Service: ErrorHandler2Service
    ) {}

    ngOnInit() {}

    ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
        });
        merge(this.sort.sortChange, this.paginator.page, this.searchTerm$)
            .pipe(
                tap(() => this.isLoadingResults = true),
                debounceTime(1000),
                switchMap(() => {
                    return this.activitiesService.getActivities({
                        page: this.paginator.pageIndex,
                        pageCount: this.paginator.pageSize,
                        filter: this.searchTerm$.value,
                        startDate: this.activityDataFilter.startDate.toDate(),
                        endDate: this.activityDataFilter.endDate.toDate(),
                    } as ActivitiesFiterVm);
                }),
                map((data) => {
                    this.resultsLength = data.totalCount;

                    return data.data;
                }),
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                }))
            .subscribe((data) => {
                this.dataSource.data = data;
                this.activity = this.dataSource.data;
                this.isLoadingResults = false;
            });
    }
}
