import { Component, DoCheck, ElementRef, EventEmitter, forwardRef, HostBinding, Injector, Input, OnInit, Optional, Output, Self, SimpleChanges, ViewChild, } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatInput } from '@angular/material/input';

import { OntoVis } from '../../models/ontology/onto-vis.model';
import { OntoVisService } from '../../services/ontology/onto-vis.service';
import { FormFieldValue } from '../advanced-search-control/custom-form-field-control/custom-form-field-control.component';

@Component({
    selector: 'app-custom-single-selection',
    templateUrl: './custom-single-selection.component.html',
    styleUrls: ['./custom-single-selection.component.scss'],
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: CustomSingleSelectionComponent,
        },
    ],
})
export class CustomSingleSelectionComponent
    implements OnInit, MatFormFieldControl<FormFieldValue>, ControlValueAccessor, DoCheck {
    @Input() placeholder: string = '';
    @Input() placeholderLabel: string = '';
    @Input() disabled: boolean = false;
    @Input() data: Array<any> = [];
    @Output() onSelectVis: EventEmitter<string> = new EventEmitter<string>();

    //
    // MatFormFieldControl
    //
    @ViewChild(MatInput, { read: ElementRef, static: true })
    input!: ElementRef;

    stateChanges: Observable<void> = new Subject<void>();
    id!: string;
    focused!: boolean;
    empty!: boolean;
    shouldLabelFloat!: boolean;
    required!: boolean;
    errorState: boolean = false;
    controlType: string = 'custom-single-selection';
    autofilled?: boolean | undefined;
    userAriaDescribedBy?: string | undefined;

    @HostBinding('attr.aria-describedby') describedBy = '';

    //
    // ControlValueAccessor
    //
    public value: any = '';

    //
    //  ngx-mat-select-search
    //
    // Control for the MatSelect filter keyword.
    public dataIdFilterCtrl: FormControl = new FormControl();
    // List of data {id: , other: } filtered by search keyword for multi-selection.
    public filteredDataId$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
    // Subject that emits when the component has been destroyed.
    private _onDestroy = new Subject<void>();

    constructor(
        private focusMonitor: FocusMonitor,
        @Optional() @Self() public ngControl: NgControl,
        public injector: Injector,
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    //
    // MatFormFieldControl
    //
    setDescribedByIds(ids: string[]): void {
        this.describedBy = ids.join(' ');
    }
    onContainerClick(event: MouseEvent): void {
        // this.focusMonitor.focusVia(this.input, 'program');
    }

    ngDoCheck(): void {
        if (this.ngControl) {
            this.errorState = (this.ngControl.invalid && this.ngControl.touched) as boolean;
            // this.stateChanges.next();
        }
    }

    //
    // ControlValueAccessor
    //

    // Write form value to the DOM element (model => view)
    writeValue(value: any): void {
        this.value = value;
        console.log('CustomSelectionComponent:writeValue value = ', this.value);
    }

    // Write form disabled state to the DOM element (model => view)
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // Update form when DOM element value changes (view => model)
    registerOnChange(fn: any): void {
        // Store the provided function as an internal method.
        this.onChange = fn;
    }

    // Update form when DOM element is blurred (view => model)
    registerOnTouched(fn: any): void {
        // Store the provided function as an internal method.
        this.onTouched = fn;
    }

    public onChange() {}
    public onTouched() {}

    //
    // ngx-mat-select-search
    //

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    ngOnChanges(changes: SimpleChanges) {
        // Use data.previousValue and data.firstChange for comparing old and new values
        if (changes.data.currentValue) {
            this.setData();
        }
    }

    private setData() {
        console.log('CustomSelectionComponent:setData data = ', this.data);

        // load the initial visIds list
        this.filteredDataId$.next(this.data.slice());
        // listen for search field value changes
        this.dataIdFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            this.filterDataByIds();
        });

        this.setInitialValue();
    }

    // Sets the initial value after the filteredVisIds are loaded initially
    protected setInitialValue() {
        this.filteredDataId$.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredVisIds are loaded initially
            // and after the mat-option elements are available
            this.singleSelect.compareWith = (a: OntoVis, b: OntoVis) => a && b && a === b;
        });
    }

    protected filterDataByIds() {
        if (!this.data) {
            return;
        }
        // get the search keyword
        let search = this.dataIdFilterCtrl.value;
        if (!search) {
            this.filteredDataId$.next(this.data.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the visIds
        // console.log('search = ', search, ', filter = ', this.data.filter((visId) => visId.function.toLowerCase().indexOf(search) > -1));
        this.filteredDataId$.next(this.data.filter((visId) => visId.function.toLowerCase().indexOf(search) > -1));
    }
}
