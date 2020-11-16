import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { BaseNestedform } from '../../shared/forms/base.nestedform';
import { OntologyService } from '../ontology.service';
import { OntoVis } from '../models/onto-vis.model';
import { MatSelect } from '@angular/material/select';

@Component({
    selector: 'app-bindvis-edit',
    templateUrl: './bindvis-edit.component.html',
    styleUrls: ['./bindvis-edit.component.scss'],
})
export class BindVisEditComponent extends BaseNestedform {
    ontoVisList: OntoVis[] = [];

    // Control for the MatSelect filter keyword.
    public visIdFilterCtrl: FormControl = new FormControl();
    // List of OntoVis filtered by search keyword for multi-selection.
    public filteredVisId: ReplaySubject<OntoVis[]> = new ReplaySubject<OntoVis[]>(1);
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    // Subject that emits when the component has been destroyed.
    private _onDestroy = new Subject<void>();

    constructor(private ontologyService: OntologyService) {
        super();

        this.nestedFormGroup = new FormGroup({
            visId: new FormControl('', [Validators.required]),
            bindData: new FormArray([]),
        });

        this.loadVisList();
    }

    ngAfterViewInit() {}

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    private loadVisList() {
        this.ontologyService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.ontoVisList = res;
                //console.log('BindingEditComponent: loadVisList: visIds = ', this.ontoVisList);

                // load the initial visIds list
                this.filteredVisId.next(this.ontoVisList.slice());
                // listen for search field value changes
                this.visIdFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                    this.filterVisIds();
                });

                this.setInitialValue();
            }
        });
    }

    /**
     * Sets the initial value after the filteredVisIds are loaded initially
     */
    protected setInitialValue() {
        this.filteredVisId.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredVisIds are loaded initially
            // and after the mat-option elements are available
            this.singleSelect.compareWith = (a: OntoVis, b: OntoVis) => a && b && a === b;
        });
    }

    protected filterVisIds() {
        if (!this.ontoVisList) {
            return;
        }
        // get the search keyword
        let search = this.visIdFilterCtrl.value;
        if (!search) {
            this.filteredVisId.next(this.ontoVisList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the visIds
        // console.log('search = ', search, ', filter = ', this.ontoVisList.filter((visId) => visId.function.toLowerCase().indexOf(search) > -1));
        this.filteredVisId.next(this.ontoVisList.filter((visId) => visId.function.toLowerCase().indexOf(search) > -1));
    }

    public onClickBindData() {
        // console.log('onClickBindData: ', this.formGroup.get('bindData'));
        // console.log('onClickBindData: ', this.formGroup.controls['bindData'].value);
        const bindDataG = this.formGroup.get('bindData') as FormArray;
        bindDataG.push(new FormGroup({}));
        // console.log('onClickBindData: value = ', bindDataG);
    }
}
