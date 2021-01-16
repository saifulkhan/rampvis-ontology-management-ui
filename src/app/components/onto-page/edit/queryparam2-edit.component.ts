import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

import { BaseNestedform } from '../../forms/base.nestedform';
import { OntoData } from '../../../models/ontology/onto-data.model';
import { OntoDataService } from '../../../services/ontology/onto-data.service';
import { QueryParams } from '../../../models/ontology/query-params.model';

@Component({
    selector: 'app-queryparam2-edit',
    templateUrl: './queryparam2-edit.component.html',
    styleUrls: ['./queryparam2-edit.component.scss'],
})
export class Queryparam2EditComponent extends BaseNestedform {
    parentDataId!: string;

    public queryList: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
    public paramsList: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

    constructor(private ontoDataService: OntoDataService) {
        super();
        this.nestedFormGroup = new FormGroup({
            query: new FormControl('', [Validators.required]),
            params: new FormControl([], [Validators.required]),
        });
    }

    ngAfterViewInit() {
        this.parentDataId = this.id;
        this.loadQueryParams();
    }

    loadQueryParams() {
        console.log('Queryparam2EditComponent: parentDataId: ', this.parentDataId);

        this.ontoDataService.getData(this.parentDataId).subscribe((res: OntoData) => {
            if (res) {
                // Commented to pass compilation error
                //let q = res?.queryParams.map((d: QueryParams) => d.query);
                //let p = [].concat.apply([], res?.queryParams.map((d: any) => d.params));

                //this.queryList.next(q.slice());
                //this.paramsList.next(p.slice());
                //console.log('Queryparam2EditComponent: loadQueryParams: ', this.queryList, this.paramsList);
            }
        });
    }
}
