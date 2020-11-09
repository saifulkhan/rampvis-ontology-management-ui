import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BaseNestedform } from '../../shared/forms/base.nestedform';
import { OntologyService } from '../ontology.service';
import { OntoData, QueryParams } from '../models/onto-data.model';

@Component({
    selector: 'app-queryparam2-edit',
    templateUrl: './queryparam2-edit.component.html',
    styleUrls: ['./queryparam2-edit.component.scss'],
})
export class Queryparam2EditComponent extends BaseNestedform {
    // tag chip related
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    queryList = [];
    paramsList = [];

    constructor(private ontologyService: OntologyService) {
        super();
        this.nestedFormGroup = new FormGroup({
            query: new FormControl('', [Validators.required]),
            params: new FormControl([], [Validators.required]),
        });
    }

    ngAfterViewInit() {
        let ontoData: OntoData = this.ontologyService.ontoDataList.find(d => d.id === this.id);
        this.queryList = ontoData.queryParams.map((d: QueryParams) => d.query);
        this.paramsList = [].concat.apply([], ontoData.queryParams.map((d: QueryParams) => d.params));

        console.log(this.queryList, this.paramsList)
    }	


}
