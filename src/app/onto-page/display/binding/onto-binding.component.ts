import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, merge } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { OntoPageFilterVm } from '../../../models/ontology/onto-page-filter.vm';
import { TableData } from '../../../models/table.data.interface';
import { OntoPage, BINDING_TYPE } from '../../../models/ontology/onto-page.model';
import { OntoVisService } from '../../../services/ontology/onto-vis.service';
import { OntoVis } from '../../../models/ontology/onto-vis.model';
import { Binding } from '../../../models/ontology/binding.model';

@Component({
    selector: 'app-onto-binding',
    templateUrl: './onto-binding.component.html',
    styleUrls: ['./onto-binding.component.scss'],
})
export class OntoBindingComponent implements OnInit {
    @Input() data!: Binding;

    public ontoVisArr!: OntoVis[];
    public ontoVisArrLen!: number;

    constructor(private ontoVisService: OntoVisService, private matDialog: MatDialog) {}

    ngOnInit(): void {
        console.log('OntoBindingComponent:ngOnInit: data = ', this.data);

        this.ontoVisService.getOntoVis(this.data.visId).subscribe((ontoVis: OntoVis) => {
            console.log('OntoBindingComponent:ngOnInit: ontoVis = ', ontoVis);
            this.ontoVisArr = [ontoVis];
            this.ontoVisArrLen = this.ontoVisArr.length;
        });
    }

    ngAfterViewInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {}

    // getOntoVisArr(id: string): Promise<OntoVis[]> {
    //     console.log('PropagationComponent:getOntoVisArr: id = ', id);
    //     return this.ontoVisService.getOntoVis(id).toPromise().then((ontoVis: OntoVis) => {
    //         console.log('PropagationComponent:getOntoVisArr: ontoVis = ', ontoVis);
    //         return [ontoVis];
    //         // this.ontoDataArr = ontoVis;
    //         // this.ontoDataArrLen = this.ontoDataArr.length;
    //     })
    // }
}
