import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, mergeMap } from 'rxjs/operators';

import { LocalNotificationService } from '../../services/common/local-notification.service';
import { OntoPageService } from '../../services/ontology/onto-page.service';
import { OntoPage, OntoPageExt } from '../../models/ontology/onto-page.model';
import { OntoPageFilterVm } from '../../models/ontology/onto-page-filter.vm';
import { ErrorHandler2Service } from '../../services/common/error-handler-2.service';
import { UtilService } from '../../services/util.service';
import { OntoPageEditComponent } from '../../components/onto-page/edit/edit.component';
import { DialogService } from '../../services/dialog.service';
import { PAGE_TYPE } from '../../models/ontology/page-type.enum';

@Component({
    selector: 'app-onto-pages-view',
    templateUrl: './onto-pages-view.component.html',
    styleUrls: ['./onto-pages-view.component.scss'],
})
export class OntoPagesViewComponent implements OnInit {
    public ontoPages: OntoPageExt[] = [];
    public ontoPagesTotalCount = 0;
    private ontoPageFilterVm!: OntoPageFilterVm;

    filterPageType$ = new BehaviorSubject<PAGE_TYPE>(null as any);

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private ontologyService: OntoPageService,
        private matDialog: MatDialog,
        private localNotificationService: LocalNotificationService,
        private dialogService: DialogService,
        private errorHandler2Service: ErrorHandler2Service,
        private utilService: UtilService
    ) {
        this.activatedRoute.params.subscribe((d: any) => {
            console.log('OntoPagesListComponent: ngOnInit:  route or pageType = ', d?.pageType);
            this.filterPageType$.next(d?.pageType);
            this.getOntoPages(this.ontoPageFilterVm);
        });
    }

    ngOnInit(): void {}

    public onClickCreate(): void {
        this.openPageEditModal('new', new OntoPageExt());
    }

    public onClickEdit(ontoPageExt: OntoPageExt): void {
        this.openPageEditModal('edit', ontoPageExt);
    }

    public onClickDelete(pageId: string): void {
        this.dialogService.warn('Delete', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.ontologyService.deletePage(pageId).subscribe((res: any) => {
                    this.localNotificationService.success({ message: 'Deleted' });
                    this.ontoPages = this.ontoPages.filter((d) => d.id !== pageId);
                });
            }
        });
    }

    public onClickRelease(pageId: string): void {
        this.ontologyService.updatePageType(pageId, PAGE_TYPE.RELEASE).subscribe((res: any) => {
            if (res.modifiedCount) {
                this.localNotificationService.success({ message: `Released`});
                this.ontoPages = this.ontoPages.filter((d) => d.id !== pageId);
            }
        });
    }

    public onClickShowBinding(pageId: string) {
        console.log(pageId)
        this.router.navigate(['pages', 'page', `${pageId}`]);
    }

    public getOntoPages(_ontoPageFilterVm: OntoPageFilterVm) {
        this.ontoPageFilterVm = _ontoPageFilterVm;
        console.log('OntoPagesListComponent:getOntoPages: ontoPageFilterVm = ', this.ontoPageFilterVm);

        if (!this.filterPageType$.value || !this.ontoPageFilterVm) {
            return;
        }
        this.ontoPageFilterVm.filterPageType = this.filterPageType$.value;

        this.ontologyService
            .getAllPages(this.ontoPageFilterVm)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                })
            )
            .subscribe((response: any) => {
                this.ontoPagesTotalCount = response.totalCount;
                this.ontoPages = response.data;
                console.log('OntoPagesListComponent:getOntoPages: ontoPages = ', this.ontoPages, 'totalCount = ', this.ontoPagesTotalCount);
            });
    }

    private openPageEditModal(dialogType: string, ontoPageExt: OntoPageExt): void {
        console.log('OntoPagesListComponent: openPageEditModal: dialogType = ', dialogType, ', ontoPageExt = ', ontoPageExt);

        const dialogOpt = { width: '80%', data: { dialogType, ontoPageExt } };
        const matDialogRef = this.matDialog.open(OntoPageEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (ontoPageExt: null | OntoPageExt): Observable<any> => {
                        if (!ontoPageExt) return of(false);
                        console.log('OntoPagesListComponent: openPageEditModal: dialog afterClosed, ontoPage = ', ontoPageExt);

                        if (dialogType === 'new') return this.ontologyService.createPage(ontoPageExt);
                        if (dialogType === 'edit') return this.ontologyService.updatePage(ontoPageExt);
                        return of(false);
                    }
                )
            )
            .subscribe((response: OntoPageExt | false) => {
                if (!response) return;

                this.localNotificationService.success({ message: 'Successfully created or updated' });
                this.getOntoPages(this.ontoPageFilterVm);
            });
    }
}
