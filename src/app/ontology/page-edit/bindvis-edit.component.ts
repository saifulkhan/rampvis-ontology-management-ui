import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BaseNestedform } from '../../shared/forms/base.nestedform';
import { OntologyService } from '../ontology.service';
import { OntoVis } from '../models/onto-vis.model';

@Component({
    selector: 'app-bindvis-edit',
    templateUrl: './bindvis-edit.component.html',
    styleUrls: ['./bindvis-edit.component.scss'],
})
export class BindVisEditComponent extends BaseNestedform {
    // tag chip related
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    visList = [];

    constructor(private ontologyService: OntologyService) {
        super();

        this.nestedFormGroup = new FormGroup({
            visId: new FormControl('', [Validators.required]),
            bindData: new FormArray([]),
            //visList: new FormControl([], [Validators.required]),
            //title: new FormControl('My note', [Validators.required]),
            //content: new FormControl('', [Validators.required, Validators.minLength(3)]),
        });

        this.loadVisList();
    }

    private loadVisList() {
        this.ontologyService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.visList = res.map((d) => d.id);
                console.log('BindingEditComponent: loadVisList: visList = ', this.visList);
            }
        });
    }

    onClickBindData() {
        console.log('onClickBindData: ', this.formGroup.get('bindData'));
        console.log('onClickBindData: ', this.formGroup.controls['bindData'].value);

        const bindDataG = this.formGroup.get('bindData') as FormArray;
        bindDataG.push(new FormGroup({}));
        console.log('onClickBindData: value = ', bindDataG);
    }
}
