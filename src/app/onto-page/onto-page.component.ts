import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, forkJoin, merge, Observable, of } from 'rxjs';
import { Router, RouterEvent, Event, ActivatedRoute } from '@angular/router';
import { catchError, debounceTime, filter, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';

import { LocalNotificationService } from '../services/common/local-notification.service';
import { OntoPageService } from '../services/ontology/onto-page.service';
import { OntoPage, BINDING_TYPE } from '../models/ontology/onto-page.model';
import { OntoPageFilterVm } from '../models/ontology/onto-page-filter.vm';
import { ErrorHandler2Service } from '../services/common/error-handler-2.service';
import { UtilService } from '../services/util.service';
import { OntoPageEditComponent } from './display/edit/onto-page-edit.component';
import { DialogService } from '../services/common/dialog.service';

@Component({
    selector: 'app-onto-page',
    templateUrl: './onto-page.component.html',
    styleUrls: ['./onto-page.component.scss'],
})
export class OntoPageComponent implements OnInit {
    public ontoPageArr: OntoPage[] = [];
    public ontoPageArrLen = 0;
    private ontoPageFilterVm!: OntoPageFilterVm;

    filterBindingType$ = new BehaviorSubject<BINDING_TYPE>(null as any);

    constructor(
        private activatedRoute: ActivatedRoute,
        private ontologyService: OntoPageService,
        private matDialog: MatDialog,
        private localNotificationService: LocalNotificationService,
        private dialogService: DialogService,
        private errorHandler2Service: ErrorHandler2Service,
        private utilService: UtilService
    ) {
        this.activatedRoute.params.subscribe((d: any) => {
            console.log('OntoPageComponent: ngOnInit:  route or bindingType = ', d?.bindingType);
            this.filterBindingType$.next(d?.bindingType);
            this.getOntoPages(this.ontoPageFilterVm);
        });
    }

    ngOnInit(): void {}

    public onClickCreate(): void {
        this.openPageEditModal('new', new OntoPage());
    }

    public onClickEdit(page: OntoPage): void {
        this.openPageEditModal('edit', page);
    }

    public onClickDelete(pageId: string): void {
        this.dialogService.warn('Delete', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.ontologyService.deletePage(pageId).subscribe((res: any) => {
                    this.localNotificationService.success({ message: 'Successfully deleted' });
                    this.ontoPageArr = this.ontoPageArr.filter((d) => d.id !== pageId);
                });
            }
        });
    }

    public getOntoPages(ontoPageFilterVm: OntoPageFilterVm) {
        this.ontoPageFilterVm = ontoPageFilterVm;

        console.log('OntoPageComponent:getOntoPages: 1 ontoPageFilterVm = ', ontoPageFilterVm);

        if (!this.filterBindingType$.value || !this.ontoPageFilterVm) {
            return;
        }
        this.ontoPageFilterVm.bindingType = this.filterBindingType$.value;

        console.log('OntoPageComponent:getOntoPages: 2 ontoPageFilterVm = ', ontoPageFilterVm);

        this.ontologyService
            .getPages(this.ontoPageFilterVm)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                })
            )
            .subscribe((response: any) => {
                this.ontoPageArr = response.data;
                this.ontoPageArrLen = response.totalCount;
            });
    }

    private openPageEditModal(dialogType: string, ontoPage: OntoPage): void {
        console.log('OntoPageComponent: openPageEditModal: ontoPage = ', ontoPage);

        const dialogOpt = { width: '40%', data: { dialogType, data: this.utilService.deepCopy(ontoPage) } };
        const matDialogRef = this.matDialog.open(OntoPageEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (ontoPage: null | OntoPage): Observable<any> => {
                        if (!ontoPage) return of(false);

                        console.log('OntoPageComponent: openPageEditModal: dialog afterClosed, ontoPage = ', ontoPage);

                        if (dialogType === 'new') return this.ontologyService.createPage(ontoPage);
                        if (dialogType === 'edit') return this.ontologyService.updatePage(ontoPage);
                        return of(false);
                    }
                )
            )
            .subscribe((response: OntoPage | false) => {
                if (!response) return;

                this.localNotificationService.success({ message: 'Successfully created or updated' });
                this.getOntoPages(this.ontoPageFilterVm);
            });
    }
}
