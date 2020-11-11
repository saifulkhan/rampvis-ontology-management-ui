import { Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

export class BaseNestedform  implements OnInit {
    // Parent form for which @this will be a nested
    @Input() formGroup: FormGroup;
    // If we pass parent id, e.g., BindDataEditComponent pass dataId to QueryParam2EditComponent
    @Input() id: string; 

    // Nested (self) control group
    public nestedFormGroup: FormGroup;

    constructor() {}

    ngOnInit() {
        this.init();
    }

    private init() {        
        /**
         * Merge parent form controls with nested form controls to be the same
         */
        Object.keys(this.nestedFormGroup.controls).forEach((key) => {
            const nestedControl = this.nestedFormGroup.get(key);
            
            console.log('BaseNestedform: key = ', key, this.formGroup.contains(key));

            /**
             * If control not specified yet, just add it to form with all
             * it's validators, default values and so one
             */
            if (!this.formGroup.contains(key)) {
                this.formGroup.addControl(key, this.nestedFormGroup.get(key));
                return;
            }


            const parentControl = this.formGroup.get(key);

            /**
             * Restore validator from our sub-form rules if parentControl don't has any
             */
            if (!parentControl.validator && nestedControl.validator) {
                parentControl.setValidators(nestedControl.validator);
            }

            console.log('BaseNestedform: key = ', key, 'p value = ', parentControl.value);

            /**
             * Restore default value, if it specified in nested control, but not parent control
             */
            if ([null, '', undefined].includes(parentControl.value) && ![null, '', undefined].includes(nestedControl.value)) {
                parentControl.patchValue(nestedControl.value);

                // console.log('BaseNestedform: key = ', key, 'n value = ', nestedControl.value);
            }
        });
    }

    /**
     * Method to remove nested from itself without emitting events to parent form
     */
    public removeSelf() {
        if (!(this.formGroup.parent instanceof FormArray)) {
            alert('BaseNestedform: Cannot remove, not an array!');
            return;
        }

        const parentForm = this.formGroup.parent as FormArray;
        parentForm.removeAt(parentForm.controls.indexOf(this.formGroup));
    }
}
