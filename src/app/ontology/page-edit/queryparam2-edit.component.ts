import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

import { BaseNestedform } from '../../shared/forms/base.nestedform';
import { OntologyService } from '../ontology.service';
import { OntoData, QueryParams } from '../models/onto-data.model';

@Component({
    selector: 'app-queryparam2-edit',
    templateUrl: './queryparam2-edit.component.html',
    styleUrls: ['./queryparam2-edit.component.scss'],
})
export class Queryparam2EditComponent extends BaseNestedform {
    parentDataId: string;

    public queryList: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
    public paramsList: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

    constructor(private ontologyService: OntologyService) {
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

        this.ontologyService.getData(this.parentDataId).subscribe((res: OntoData) => {
            if (res) {
                let q = res.queryParams.map((d: QueryParams) => d.query);
                let p = [].concat.apply( [], res.queryParams.map((d: QueryParams) => d.params), );
                this.queryList.next(q.slice());
                this.paramsList.next(p.slice());
        
                console.log('Queryparam2EditComponent: loadQueryParams: ', this.queryList, this.paramsList);
            }
        });

       
    }
}
