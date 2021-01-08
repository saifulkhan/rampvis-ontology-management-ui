import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { DialogService } from '../services/common/dialog.service';
import { OntoVis } from '../models/ontology/onto-vis.model';
import { OntoVisEditComponent } from './display/edit/onto-vis-edit.component';
import { OntoVisService } from '../services/ontology/onto-vis.service';

@Component({
    selector: 'app-onto-vis',
    templateUrl: './onto-vis.component.html',
    styleUrls: ['./onto-vis.component.scss'],
})
export class OntoVisComponent implements OnInit {
    public ontoVisArr!: OntoVis[];
    public ontoVisArrLength!: number;

    constructor(
        private ontoVisService: OntoVisService,
        private matDialog: MatDialog,
        private dialogService: DialogService
    ) {}

    ngOnInit(): void {
        console.log('OntoVisComponent: ngOnInit:');
        this.loadVisList();
    }

    public onClickCreate(): void {
        this.openVisEditModal('new', new OntoVis());
    }

    public onClickEdit(vis: OntoVis): void {
        this.openVisEditModal('edit', vis);
    }

    public onClickDelete(vis: OntoVis): void {
        this.dialogService.warn('Delete Vis', 'Are you sure you want to delete this?', 'Delete').then((result) => {
            if (result.value) {
                this.ontoVisService.deleteVis(vis.id).subscribe((res: any) => {
                    this.loadVisList();
                });
            }
        });
    }

    private loadVisList() {
        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.ontoVisArr = res;
                this.ontoVisArrLength = this.ontoVisArr.length;
                console.log('OntoVisComponent: loadVisList: ontoVisArr = ', this.ontoVisArr);
            }
        });
    }

    private openVisEditModal(dialogType: string, vis: OntoVis): void {
        const dialogOpt = { width: '40%', data: { dialogType, vis } };
        const matDialogRef = this.matDialog.open(OntoVisEditComponent, dialogOpt);

        matDialogRef
            .afterClosed()
            .pipe(
                mergeMap(
                    (ontoVis: null | OntoVis): Observable<any> => {
                        if (!ontoVis) return of(false);
                        if (dialogType === 'new') return this.ontoVisService.createVis(ontoVis);
                        if (dialogType === 'edit') return this.ontoVisService.updateVis(ontoVis);
                        return of(false);
                    }
                )
            )
            .subscribe((response: OntoVis | false) => {
                if (!response) return;
                this.loadVisList();
            });
    }
}
