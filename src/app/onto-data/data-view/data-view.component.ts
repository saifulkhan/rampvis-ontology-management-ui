import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';

import { APIService } from '../../services/api.service';
import { OntoData } from '../../models/ontology/onto-data.model';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-data-view',
    templateUrl: './data-view.component.html',
})
export class DataViewComponent implements OnInit {
    @ViewChild('modalForm') modalForm;

    public length$: ReplaySubject<number> = new ReplaySubject<number>(1);
    public jsonData$: ReplaySubject<[]> = new ReplaySubject<[]>(1);
    public url = '';
    loading = true;

    constructor(
        public matDialogRef: MatDialogRef<DataViewComponent>, 
        @Inject(MAT_DIALOG_DATA) data,
        private api: APIService,
    ) {
        console.log('DataViewComponent: data = ', data);
        const ontoData: OntoData = data;

        this.url = `${environment.components[ontoData.urlCode]}/${ontoData.endpoint}`
        this.api.get(this.url).subscribe((res: any) => {
            this.jsonData$.next(res.slice(0, 10));
            this.length$.next(res.length)
            this.loading = false;
        });
    }

    ngOnInit(): void {}

    public close() {
        this.matDialogRef.close();
    }
}
