import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

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

@NgModule({
    declarations: [
      VisListComponent, 
      VisEditComponent, 
      DataListComponent, 
      DataEditComponent,
      PageListComponent,
      PageEditComponent,
      QueryparamEditComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(OntologyRoutes),
        FormsModule,
        MaterialModule,
        DirectivesModule,
        MatFormFieldModule,
        ReactiveFormsModule,
    ],
    providers: [OntologyService],
    entryComponents: [
      VisEditComponent, 
      DataEditComponent,
      PageEditComponent,
    ],
})
export class OntologyModule {}
