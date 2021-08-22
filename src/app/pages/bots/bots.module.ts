import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

import { BotsRoutes } from './bots.routing';
import { BotsStatusComponent } from './status/bots-status.component';
import { BotsService } from '../../services/bots.service';
import { LogMonitorModule } from '../../components/log-monitor/log-monitor.module';
import { SettingsModalComponent } from './status/settings-modal/settings-modal.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(BotsRoutes),
		FormsModule,
		MaterialModule,
		ReactiveFormsModule,
		LogMonitorModule
	],
    declarations: [BotsStatusComponent, SettingsModalComponent],
    providers: [BotsService],
})
export class BotsModule {}
