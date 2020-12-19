import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

function AdvancedSearchValidetor(control: FormControl) {
    return control.value.scope !== null && control.value.query !== ''
        ? null
        : {
              validateSearch: {
                  valid: true,
              },
          };
}

@Component({
    selector: 'app-search-form-field-container',
    templateUrl: './search-form-field-container.component.html',
    styleUrls: ['./search-form-field-container.component.scss'],
})
export class SearchFormFieldContainerComponent implements OnInit {
    formControl = new FormControl({ value: { scope: '', query: '' }, disabled: false },
        AdvancedSearchValidetor as any
    );

    constructor() {}

    ngOnInit(): void {}
}
