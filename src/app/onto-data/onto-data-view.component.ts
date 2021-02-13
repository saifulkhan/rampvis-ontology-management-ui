import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { LocalNotificationService } from '../services/common/local-notification.service';
import { DialogService } from '../services/common/dialog.service';
import { OntoDataService } from '../services/ontology/onto-data.service';
import { OntoDataEditComponent } from '../components/onto-data/edit/edit.component';
import { OntoData } from '../models/ontology/onto-data.model';
import { OntoDataFilterVm } from '../models/ontology/onto-data-filter.vm';
import { ErrorHandler2Service } from '../services/common/error-handler-2.service';

@Component({
    selector: 'app-onto-data-view',
    templateUrl: './onto-data-view.component.html',
    styleUrls: ['./onto-data-view.component.scss'],
})
export class OntoDataViewComponent {
    public ontoDataArr!: OntoData[];
    public ontoDataTotalCount!: number;
    private ontoDataFilterVm!: OntoDataFilterVm;

    constructor(
        private ontoDataService: OntoDataService,
        private matDialog: MatDialog,
        private localNotificationService: LocalNotificationService,
        private dialogService: DialogService,
        private errorHandler2Service: ErrorHandler2Service
    ) {}

    public onClickCreate(): void {
        this.openVisEditModal('new', new OntoData());
    }

    public onClickEdit(data: OntoData): void {
        this.openVisEditModal('edit', data);
    }

    public onClickDelete(data: OntoData): void {
        this.dialogService.warn('Delete Data', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.ontoDataService.deleteData(data.id).subscribe((res: any) => {
                    this.localNotificationService.success({ message: 'Successfully deleted' });
                    this.ontoDataArr = this.ontoDataArr.filter((d) => d.id !== data.id);
                });
            }
        });
    }

    public filterOntoData(_ontoDataFilterVm: OntoDataFilterVm) {
        console.log('OntoDataComponent:getOntoData: ontoDataFilter = ', _ontoDataFilterVm);

        this.ontoDataFilterVm = _ontoDataFilterVm;
        this.ontoDataService
            .getAllData(this.ontoDataFilterVm)
            .pipe(
                catchError((err) => {
                    this.errorHandler2Service.handleError(err);
                    return of([]);
                })
            )
            .subscribe((res: any) => {
                this.ontoDataArr = res.data;
                this.ontoDataTotalCount = res.totalCount;
            });
    }

    private openVisEditModal(dialogType: string, data: OntoData): void {
        const dialogOpt = {
            width: '40%',
            // minHeight: 'calc(100vh - 90px)', // TODO
            height : 'auto',
            data: { dialogType, data: data }
        };
        const matDialogRef = this.matDialog.open(OntoDataEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (ontoData: null | OntoData): Observable<any> => {
                        if (!ontoData) return of(false);
                        if (dialogType === 'new') return this.ontoDataService.createData(ontoData);
                        if (dialogType === 'edit') return this.ontoDataService.updateData(ontoData);
                        return of(false);
                    }
                )
            )
            .subscribe((response: OntoData | false) => {
                if (!response) return;

                this.localNotificationService.success({ message: 'Successfully created or updated' });
                this.filterOntoData(this.ontoDataFilterVm);
            });
    }
}
