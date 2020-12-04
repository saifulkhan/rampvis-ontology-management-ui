import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { OntologyRoutes } from './onto-page.routing';
import { DirectivesModule } from '../directives/directives.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OntoPageService } from '../services/ontology/onto-page.service';
import { PageListComponent } from './page-list/page-list.component';
import { PageEditComponent } from './page-edit/page-edit.component';
import { BindingEditComponent } from './page-edit/binding-edit.component';
import { BindDataEditComponent } from './page-edit/binddata-edit.component';
import { Queryparam2EditComponent } from './page-edit/queryparam2-edit.component';
import { CustomPipesModule } from '../pipes/custom-pipes.module';

@NgModule({
    declarations: [
        PageListComponent,
        PageEditComponent,
        BindingEditComponent,
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
    providers: [OntoPageService],
    entryComponents: [PageEditComponent, BindingEditComponent],
})
export class OntologyModule {}
