import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { OntologyRoutes } from './ontology.routing';
import { DirectivesModule } from '../shared/directives/directives.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OntologyService } from './ontology.service';
import { VisListComponent } from './vis-list/vis-list.component';
import { VisEditComponent } from './vis-edit/vis-edit.component';
import { DataEditComponent } from './data-edit/data-edit.component';
import { DataListComponent } from './data-list/data-list.component';
import { PageListComponent } from './page-list/page-list.component';
import { PageEditComponent } from './page-edit/page-edit.component';
import { QueryparamEditComponent } from './data-edit/queryparam-edit.component';
import { BindVisEditComponent } from './page-edit/bindvis-edit.component';
import { BindDataEditComponent } from './page-edit/binddata-edit.component';
import { Queryparam2EditComponent } from './page-edit/queryparam2-edit.component';
import { CustomPipesModule } from '../shared/pipes/custom-pipes.module';

@NgModule({
    declarations: [
      VisListComponent, 
      VisEditComponent, 
      DataListComponent, 
      DataEditComponent,
      PageListComponent,
      PageEditComponent,
      QueryparamEditComponent,
      BindVisEditComponent,
      BindDataEditComponent,
      Queryparam2EditComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(OntologyRoutes),
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        CustomPipesModule,
    ],
    providers: [OntologyService],
    entryComponents: [
      VisEditComponent, 
      DataEditComponent,
      PageEditComponent,
    ],
})
export class OntologyModule {}
