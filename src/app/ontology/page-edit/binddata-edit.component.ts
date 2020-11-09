import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BaseNestedform } from '../../shared/forms/base.nestedform';
import { OntologyService } from '../ontology.service';
import { OntoData } from '../models/onto-data.model';

@Component({
    selector: 'app-binddata-edit',
    templateUrl: './binddata-edit.component.html',
    styleUrls: ['./binddata-edit.component.scss'],
})
export class BindDataEditComponent extends BaseNestedform {
    // tag chip related
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    dataList = [];

    constructor(private ontologyService: OntologyService) {
        super();

        this.nestedFormGroup = new FormGroup({
            dataId: new FormControl('', [Validators.required]),
            queryParams: new FormArray([]),
            //title: new FormControl('My note', [Validators.required]),
            //content: new FormControl('', [Validators.required, Validators.minLength(3)]),
        });

        this.loadDataList();
    }

    private loadDataList() {
        this.ontologyService.getAllData().subscribe((res: OntoData[]) => {
            if (res) {
                this.dataList = res.map((d) => d.id);
                console.log('EndpointEditComponent: loadVisList: visList = ', this.dataList);
            }
        });
    }

    onClickBindQueryParams() {
        console.log('onClickBindQueryParams: ', this.formGroup.get('queryParams'))
        console.log('onClickBindQueryParams: ', this.formGroup.controls['queryParams'].value)

        const ctl = this.formGroup.get('queryParams') as FormArray;
        ctl.push(new FormGroup({}));
        console.log('onClickBindQueryParams: value = ', ctl);
    }
}
