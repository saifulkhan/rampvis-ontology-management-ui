import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';

import { APIService } from '../../../services/api.service';
import { OntoData } from '../../../models/ontology/onto-data.model';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-onto-data-inspect',
    templateUrl: './onto-data-inspect.component.html',
    styleUrls: ['./onto-data-inspect.component.scss'],
})
export class OntoDataInspectComponent implements OnInit {
    @ViewChild('modalForm') modalForm: any;

    public length$: ReplaySubject<number> = new ReplaySubject<number>(1);
    public jsonData$: ReplaySubject<[]> = new ReplaySubject<[]>(1);
    public column$: ReplaySubject<[]> = new ReplaySubject<[]>(1);

    public url = '';
    spinner = true;

    constructor(
        public matDialogRef: MatDialogRef<OntoDataInspectComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private api: APIService
    ) {
        console.log('OntoDataInspectComponent: data = ', data);
        const ontoData: OntoData = data;

        this.url = `${environment.components[ontoData.urlCode]}/${ontoData.endpoint}`;
        this.api.get(this.url).subscribe((res: any) => {
            if (res && res.length > 0) {
                this.jsonData$.next(res.slice(0, 10));
                this.length$.next(res.length);
                this.column$.next(Object.keys(res[0]) as any);
                this.spinner = false;
            }
        });
    }

    ngOnInit(): void {}

    public close() {
        this.matDialogRef.close();
    }
}
