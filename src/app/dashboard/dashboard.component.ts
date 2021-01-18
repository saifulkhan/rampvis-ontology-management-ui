import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, NgZone, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ReplaySubject } from 'rxjs';

import { CustomSingleSelectionData } from '../components/custom-single-selection/custom-single-selection.component';
import { OntoVis } from '../models/ontology/onto-vis.model';
import { DialogService } from '../services/common/dialog.service';
import { OntoVisService } from '../services/ontology/onto-vis.service';

import * as _ from 'lodash';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }



@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    formGroup: FormGroup;
    public ontoVisArr!: OntoVis[];
    public ontoVisArrLength!: number;
    public data$: ReplaySubject<CustomSingleSelectionData[]> = new ReplaySubject<CustomSingleSelectionData[]>(1);

    constructor(
        private ontoVisService: OntoVisService
    ) {
        this.formGroup = new FormGroup({
            visId: new FormControl(''),
        });
        this.ontoVisService.getAllVis().subscribe((res: OntoVis[]) => {
            if (res) {
                this.ontoVisArr = res;
                this.ontoVisArrLength = res.length;
                this.data$.next(
                    res.map((d: OntoVis) => {
                        return {
                            id: d.id,
                            name: d.function,
                        };
                    })
                );
            }
        });
    }

    public onSelectOntoVis(value: any) {
        console.log('DashboardComponent:onSelectOntoVis: value = ', value);
    }



    //
    // Multiple drag and drop table experiment
    //



    @ViewChild('table1') table1!: MatTable<any>;
    @ViewChild('table2') table2!: MatTable<any>;
    @ViewChild('list1') list1!: CdkDropList;
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    ELEMENT_DATA!: PeriodicElement[];
    ELEMENT_DATA2!: PeriodicElement[];
    dataSource!: any;
    dataSource2!: any;

    ngOnInit() {
        this.ELEMENT_DATA = [
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

  this.ELEMENT_DATA2 = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},

  ];

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource2 = new MatTableDataSource(this.ELEMENT_DATA2);
    }

    drop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
      }

      // updates moved data and table, but not dynamic if more dropzones
      this.dataSource.data = _.cloneDeep(this.dataSource.data);
      this.dataSource2.data = _.cloneDeep(this.dataSource2.data);
    }
}
