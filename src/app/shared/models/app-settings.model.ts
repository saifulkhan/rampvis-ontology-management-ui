import { GridsterItem } from "angular-gridster2";

export interface AppSettingInterface {
  theme: object;
  notifications: boolean;
}

export interface DashboardSettings {
  notifications: Array<string>;
  openWidgets: Array<string>;
  widgetTileSettings: Array<GridsterItem>
}

export class AppSettings {
  public app;
  public dashboard;

  constructor(app?: AppSettingInterface, dashboard?: DashboardSettings) {
    this.app = app ? app : this.getDefaultAppSettings();
    this.dashboard = dashboard ? dashboard : this.getDefaultDashboardSettings();
  }

  public updateNotifications(notifications: boolean): void {
    this.app.notifications = notifications;
  }

  public updateNotificationSubscription(notificationsList: Array<string>): void {
    this.dashboard.notifications = notificationsList;
  }

  public updateOpenWidgets(openWidgets: Array<string>): void {
    this.dashboard.openWidgets = openWidgets;
  }

  public updateWidgetSettings(widgetSettings: Array<GridsterItem>): void {
    this.dashboard.widgetTileSettings = widgetSettings;
  }

  private getDefaultAppSettings(): AppSettingInterface {
    return {
      theme: {},
      notifications: true
    }
  }

  private getDefaultDashboardSettings(): DashboardSettings {
    return {
      notifications: ["facebook", "twitter", "instagram"],
      openWidgets: ["instagram", "facebook", "twitter", "timeline"],
      widgetTileSettings: [
        {
          id: "timeline",
          cols: 5,
          rows: 9,
          y: 0,
          x: 0,
          component: "TimelineComponent"
        },
        {
          id: "facebook",
          cols: 3,
          rows: 3,
          y: 3,
          x: 5,
          component: "FacebookComponent"
        },
        {
          id: "twitter",
          cols: 3,
          rows: 3,
          y: 6,
          x: 5,
          component: "TwitterComponent"
        },
        {
          id: "instagram",
          cols: 3,
          rows: 3,
          y: 0,
          x: 5,
          component: "InstaComponent"
        }
      ]
    }
  }
}
