import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, mergeMap } from 'rxjs/operators';

import { LocalNotificationService } from '../../services/common/local-notification.service';
import { OntoPageService } from '../../services/ontology/onto-page.service';
import { OntoPage } from '../../models/ontology/onto-page.model';
import { OntoPageFilterVm } from '../../models/ontology/onto-page-filter.vm';
import { ErrorHandler2Service } from '../../services/common/error-handler-2.service';
import { UtilService } from '../../services/util.service';
import { OntoPageEditComponent } from '../../components/onto-page/edit-dialog/onto-page-edit.component';
import { DialogService } from '../../services/common/dialog.service';
import { BINDING_TYPE } from '../../models/ontology/binding-type.enum';

@Component({
    selector: 'app-onto-pages-view',
    templateUrl: './onto-pages-view.component.html',
    styleUrls: ['./onto-pages-view.component.scss'],
})
export class OntoPagesViewComponent implements OnInit {
    public ontoPages: OntoPage[] = [];
    public ontoPagesTotalCount = 0;
    private ontoPageFilterVm!: OntoPageFilterVm;

    filterBindingType$ = new BehaviorSubject<BINDING_TYPE>(null as any);

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
            console.log('OntoPagesListComponent: ngOnInit:  route or bindingType = ', d?.bindingType);
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
                    this.ontoPages = this.ontoPages.filter((d) => d.id !== pageId);
                });
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

        if (!this.filterBindingType$.value || !this.ontoPageFilterVm) {
            return;
        }
        this.ontoPageFilterVm.bindingType = this.filterBindingType$.value;

        this.ontologyService
            .getPages(this.ontoPageFilterVm)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                })
            )
            .subscribe((response: any) => {
                this.ontoPages = response.data;
                this.ontoPagesTotalCount = response.totalCount;
                console.log('OntoPagesListComponent:getOntoPages: ontoPages = ', this.ontoPages);
            });
    }

    private openPageEditModal(dialogType: string, ontoPage: OntoPage): void {
        console.log('OntoPagesListComponent: openPageEditModal: ontoPage = ', ontoPage);

        const dialogOpt = { width: '40%', data: { dialogType, data: this.utilService.deepCopy(ontoPage) } };
        const matDialogRef = this.matDialog.open(OntoPageEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (ontoPage: null | OntoPage): Observable<any> => {
                        if (!ontoPage) return of(false);

                        console.log('OntoPagesListComponent: openPageEditModal: dialog afterClosed, ontoPage = ', ontoPage);

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
