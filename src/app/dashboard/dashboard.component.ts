import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';

import { CustomSingleSelectionData } from '../components/custom-single-selection/custom-single-selection.component';
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
    public data$: ReplaySubject<CustomSingleSelectionData[]> = new ReplaySubject<CustomSingleSelectionData[]>(1);

    constructor(
        private ontoVisService: OntoVisService
    ) {
        this.formGroup = new FormGroup({
            visId: new FormControl(''),
        });
        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.ontoVisArr = res;
                this.ontoVisArrLength = res.length;
                this.data$.next(
                    res.map((d: OntoVis) => {
                        return {
                            id: d.id,
                            name: d.function,
                        };
                    })
                );
            }
        });
    }

    public onSelectOntoVis(value: any) {
        console.log('DashboardComponent:onSelectOntoVis: value = ', value);
    }
}
