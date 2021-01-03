import { Component, DoCheck, ElementRef, EventEmitter, forwardRef, HostBinding, Injector, Input, OnDestroy, OnInit, Optional, Output, Self, SimpleChanges, ViewChild, } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgControl, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatInput } from '@angular/material/input';
import { CanDisableCtor, CanUpdateErrorStateCtor, ErrorStateMatcher, mixinDisabled, mixinErrorState } from '@angular/material/core';

import { OntoVis } from '../../models/ontology/onto-vis.model';

export interface CustomSingleSelectionFormFieldValue {
    id: string;
    name: string;
}

export class CustomErrorMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl): boolean {
        return control.dirty && control.invalid;
    }
}

class SearchInputBase {
    constructor(
        public _parentFormGroup: FormGroupDirective,
        public _parentForm: NgForm,
        public _defaultErrorStateMatcher: ErrorStateMatcher,
        public ngControl: NgControl
    ) {}
}

const _SearchInputMixiBase: CanUpdateErrorStateCtor & CanDisableCtor = mixinDisabled(mixinErrorState(SearchInputBase));

@Component({
    selector: 'app-custom-single-selection',
    templateUrl: './custom-single-selection.component.html',
    styleUrls: ['./custom-single-selection.component.scss'],
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: CustomSingleSelectionComponent,
        },
        {
            provide: ErrorStateMatcher,
            useClass: CustomErrorMatcher,
        },
    ],
})
export class CustomSingleSelectionComponent
    extends _SearchInputMixiBase
    implements OnInit, OnDestroy, MatFormFieldControl<CustomSingleSelectionFormFieldValue>, ControlValueAccessor, DoCheck {

    // @Input() placeholder: string = '';
    @Input() placeholderLabel: string = '';
    // @Input() disabled: boolean = false;
    // @Input() data: Array<any> = [];
    @Output() onSelectVis: EventEmitter<string> = new EventEmitter<string>();

    //
    // MatFormFieldControl
    //
    static nextId = 0;

    @ViewChild(MatInput, { read: ElementRef, static: true })
    //input!: ElementRef;

    @Input()
    set value(value: CustomSingleSelectionFormFieldValue) {
        this.form.patchValue(value);
        this.stateChanges.next();
    }
    get value() {
        return this._value;
    }
    private _value!: any;


    @HostBinding()
    id = `custom-single-selection-id-${CustomSingleSelectionComponent.nextId++}`;

    @Input()
    set placeholder(d: string) {
        this._placeholder = d;
        this.stateChanges.next();
    }
    get placeholder() {
        return this._placeholder;
    }
    private _placeholder!: string;

    // stateChanges: Observable<void> = new Subject<void>();
    // id!: string;
    focused!: boolean;

    get empty(): boolean {
        return !this.value;
    }

    @HostBinding('class.floated')
    get shouldLabelFloat(): boolean {
        return true;
    }

    @Input()
    required!: boolean;

    @Input()
    disabled!: boolean;

    controlType: string = 'custom-single-selection';

    @HostBinding('attr.aria-describedby') describedBy = '';

    form!: FormGroup;

    errorState: boolean = false;
    autofilled?: boolean | undefined;
    userAriaDescribedBy?: string | undefined;


    //
    // ControlValueAccessor
    //
    // public value: any = '';

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
        private fb: FormBuilder,
        public _defaultErrorStateMatcher: ErrorStateMatcher,
        @Optional() _parentForm: NgForm,
        @Optional() _parentFormGroup: FormGroupDirective
    ) {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

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
            // this.errorState = (this.ngControl.invalid && this.ngControl.touched) as boolean;
            //this.updateErrorState();
        }
    }

    //
    // ControlValueAccessor
    //

    // Write form value to the DOM element (model => view)
    writeValue(obj: any): void {
        this.value = obj;
        console.log('CustomSelectionComponent:writeValue value = ', this.value);
    }

    // Write form disabled state to the DOM element (model => view)
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;

        this.form.disable();
        this.stateChanges.next();
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

    public onChange(value: CustomSingleSelectionFormFieldValue) {}
    public onTouched() {}

    //
    // ngx-mat-select-search
    //

    ngOnInit(): void {
        // this.focusMonitor.monitor(this.input).subscribe((focused) => {
        //     this.focused = !!focused;
        //     this.stateChanges.next();
        // });

        // this.focusMonitor
        //     .monitor(this.input)
        //     .pipe(take(1))
        //     .subscribe(() => {
        //         this.onTouched();
        //     });
        // this.form.valueChanges.subscribe((value) => this.onChange(value));
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();

        this.focusMonitor.stopMonitoring(this.input);
        this.stateChanges.complete();
    }

    ngOnChanges(changes: SimpleChanges) {
        // Use data.previousValue and data.firstChange for comparing old and new values

        if (changes.value.currentValue) {
            this.setData();
        }

        if (this.ngControl) {
            this.updateErrorState();
        }
    }

    private setData() {
        console.log('CustomSelectionComponent:setData data = ', this.value);

        // load the initial visIds list
        this.filteredDataId$.next(this.value.slice());
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
            this.singleSelect.compareWith = (a: any, b: OntoVis) => a && b && a === b;
        });
    }

    protected filterDataByIds() {
        if (!this.value) {
            return;
        }
        // get the search keyword
        let search = this.dataIdFilterCtrl.value;
        if (!search) {
            this.filteredDataId$.next(this.value.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the visIds
        // console.log('search = ', search, ', filter = ', this.data.filter((visId) => visId.function.toLowerCase().indexOf(search) > -1));
        this.filteredDataId$.next(this.value.filter((d: string) => d['function'].toLowerCase().indexOf(search) > -1));
    }
}
