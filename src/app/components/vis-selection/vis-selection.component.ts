import { Component, EventEmitter, OnInit, Output, ViewChild, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { MatSelect, MatSelectChange } from '@angular/material/select';

import { OntoVis } from '../../models/ontology/onto-vis.model';
import { OntoVisService } from '../../services/ontology/onto-vis.service';

@Component({
    selector: 'app-vis-selection',
    templateUrl: './vis-selection.component.html',
    styleUrls: ['./vis-selection.component.scss'],
})
export class VisSelectionComponent implements OnInit {
    @Output() selectedVisId: EventEmitter<OntoVis> = new EventEmitter<OntoVis>();

    // Control for the MatSelect filter keyword.
    public visIdFilterCtrl: FormControl = new FormControl();
    // List of OntoVis filtered by search keyword for multi-selection.
    public filteredVisId: ReplaySubject<OntoVis[]> = new ReplaySubject< OntoVis[] >(1); 
    @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
     // Subject that emits when the component has been destroyed.
    private _onDestroy = new Subject<void>();

    ontoVisList: OntoVis[] = [];

    constructor(private ontoVisService: OntoVisService) {}

    ngOnInit(): void {
        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.ontoVisList = res;
                console.log( 'VisSelectionComponent: loadVisList: ontoVisList = ', this.ontoVisList );

                // load the initial visIds list
                this.filteredVisId.next(this.ontoVisList.slice());
                // listen for search field value changes
                this.visIdFilterCtrl.valueChanges
                    .pipe(takeUntil(this._onDestroy))
                    .subscribe(() => {
                        this.filterVisIds();
                    });

                this.setInitialVisValue();
            }
        });
    }

    ngAfterViewInit() {}

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
 
    // Sets the initial value after the filteredVisIds are loaded initially
    protected setInitialVisValue() {
        this.filteredVisId
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                // setting the compareWith property to a comparison function
                // triggers initializing the selection according to the initial value of
                // the form control (i.e. _initializeSelection())
                // this needs to be done after the filteredVisIds are loaded initially
                // and after the mat-option elements are available
                this.singleSelect.compareWith = (a: OntoVis, b: OntoVis) =>
                    a && b && a === b;
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
        this.filteredVisId.next(
            this.ontoVisList.filter(
                (visId) => visId.function.toLowerCase().indexOf(search) > -1
            )
        );
    }
}
