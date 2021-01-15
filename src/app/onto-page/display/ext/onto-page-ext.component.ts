import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

import { OntoPageExt } from '../../../models/ontology/onto-page.model';
import { OntoPageService } from '../../../services/ontology/onto-page.service';

@Component({
    selector: 'app-onto-page-ext',
    templateUrl: './onto-page-ext.component.html',
    styleUrls: ['./onto-page-ext.component.scss'],
})
export class OntoPageExtComponent implements OnInit {
    pageId!: string;
    ontoPageExt!: OntoPageExt;

    data: any = [];

    constructor(private route: ActivatedRoute, private ontoPageService: OntoPageService) {}

    ngOnInit(): void {
        const { params, data } = this.route.snapshot;
        this.pageId = params.pageId;
        //this.ontoPageExt = data.ontoPageExt;

        //console.log('OntoPageExtComponent:ngOnInit: ', this.pageId, this.ontoPageExt.bindingExts)

        this.ontoPageService.getOntoPageExt(this.pageId).subscribe((res: any) => {
            this.ontoPageExt = res
            console.log('OntoPageExtComponent:ngOnInit: ', this.pageId, this.ontoPageExt)
        });
        // this.data = JSON.parse('[ { "id": "x", "urlCode": "API_JS", "endpoint": "/scotland/nhs-board/?table=cumulative_cases", "dataType": "timeseries", "date": "2021-01-08T18:22:52.332Z", "description": "Scotland ", "keywords": [ "scotland", "raw" ] }, { "id": "5ff8a716e7888ed9698b99c9", "urlCode": "API_JS", "endpoint": "/scotland/nhs-board/?table=cumulative_cases&region=nhs_ayrshire_arran", "dataType": "timeseries", "date": "2021-01-08T18:40:32.992Z", "description": "Scotland cumulative cases for NHS Ayrshire Arran region", "keywords": [ "scotland", "raw" ] } ]')
    }
}
