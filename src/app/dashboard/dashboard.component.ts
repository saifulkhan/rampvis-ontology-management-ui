import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';

import { OntoVis } from '../models/ontology/onto-vis.model';
import { DialogService } from '../services/common/dialog.service';
import { OntoVisService } from '../services/ontology/onto-vis.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    formGroup: FormGroup;
    public ontoVisArr!: OntoVis[];
    public ontoVisArrLength!: number;
    public ontoVisArrLength$: ReplaySubject<OntoVis[]> = new ReplaySubject<OntoVis[]>(1);

    constructor(
        private zone: NgZone,
        private matDialog: MatDialog,
        private dialogService: DialogService,
        private ontoVisService: OntoVisService
    ) {
        this.formGroup = new FormGroup({
            visId: new FormControl(''),
        });
        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.ontoVisArr = res;
                this.ontoVisArrLength = res.length;
                this.ontoVisArrLength$.next(res.slice());
            }
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {}
}
