import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { BaseNestedform } from '../../forms/base.nestedform';

@Component({
    selector: 'app-keywords-edit',
    templateUrl: './keywords-edit.component.html',
    styleUrls: ['./keywords-edit.component.scss'],
})
export class KeywordsEditComponent extends BaseNestedform {
    // chips related
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    nestedFormGroup = new FormGroup({
        key: new FormControl('', [Validators.required]),
        values: new FormControl([], [Validators.required]),
    });

    // Remove value chip
    remove(tag: any): void {
        const index = this.formGroup.get('values')?.value.indexOf(tag);
        if (index >= 0) this.formGroup.get('values')?.value.splice(index, 1);
        this.nestedFormGroup.get('values')?.updateValueAndValidity();
    }

    // Add value chip
    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // add
        if ((value || '').trim()) this.formGroup.get('values')?.value.push(value.trim());
        // reset the input value
        if (input) input.value = '';

        this.nestedFormGroup.get('values')?.updateValueAndValidity();
    }
}
