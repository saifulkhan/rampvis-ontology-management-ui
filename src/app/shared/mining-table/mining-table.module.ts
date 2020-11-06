import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { MiningTableComponent } from './mining-table.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        AngularSvgIconModule,
        CustomPipesModule,
        FormsModule,
    ],
    declarations: [
        MiningTableComponent,
    ],
    exports: [
        MiningTableComponent,
    ]
})

export class MiningTableModule {}
