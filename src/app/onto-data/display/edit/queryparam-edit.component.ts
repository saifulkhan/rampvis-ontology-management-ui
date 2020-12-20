import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BaseNestedform } from '../../../components/forms/base.nestedform';

@Component({
    selector: 'app-queryparam-edit',
    templateUrl: './queryparam-edit.component.html',
    styleUrls: ['./queryparam-edit.component.scss'],
})
export class QueryparamEditComponent extends BaseNestedform {
    // tag chip related
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    nestedFormGroup = new FormGroup({
        query: new FormControl('', [Validators.required]),
        params: new FormControl([], [Validators.required]),
        //title: new FormControl('My note', [Validators.required]),
        //content: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
    
    // Remove tag
    remove(tag: any): void {
        const index = this.formGroup.get('params')?.value.indexOf(tag);
        if (index >= 0) this.formGroup.get('params')?.value.splice(index, 1);
        this.nestedFormGroup.get('params')?.updateValueAndValidity();
    }

    // Add tag
    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // add tag
        if ((value || '').trim()) this.formGroup.get('params')?.value.push(value.trim());
        // reset the input value
        if (input) input.value = '';

        this.nestedFormGroup.get('params')?.updateValueAndValidity();
        // console.log('CollectionEditComponent: add: tags = ', this.collection.tags);
    }
}
