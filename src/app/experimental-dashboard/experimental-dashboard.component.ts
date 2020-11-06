import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { AppSettingInterface, AppSettings, DashboardSettings } from '../shared/models/app-settings.model';
import { NotificationService } from '../services/notification.service';
import { SettingsService } from '../services/settings.service';
import { WidgetService } from '../services/widget.service';

@Component({
    selector: 'app-experimental-dashboard',
    templateUrl: './experimental-dashboard.component.html',
    styleUrls: ['./experimental-dashboard.component.css'],
    providers: [WidgetService]
})
export class ExperimentalDashboardComponent implements OnInit, AfterViewInit {
  appSettings: AppSettingInterface;
  dashboardSettings: DashboardSettings;
  events = [];

  constructor(
    private settingsService: SettingsService,
    private messagingService: NotificationService
  ) {}

  ngOnInit() {
    const { app, dashboard } = this.settingsService.getAppSettings();
    this.appSettings = app;
    this.dashboardSettings = dashboard;
    this.messagingService.$notificationSubject.subscribe((res: any) => {
      if (res) {
        this.events = [...this.events, res.data];
      }
    })
  }

  ngAfterViewInit() {}

  updateDashboardWidgetSettings(item: GridsterItem): void {
    this.settingsService.updateAppSettings(new AppSettings(this.appSettings, this.dashboardSettings));
  }
}
