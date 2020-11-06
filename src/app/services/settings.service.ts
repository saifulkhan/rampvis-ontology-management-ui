import { Injectable } from '@angular/core';
import { AppSettings } from '../shared/models/app-settings.model';


@Injectable({ providedIn: 'root' })
export class SettingsService {
  private url = 'http://localhost:2001';
  private dataKey = 'DATA_MINING_APP_SETTINGS'

  constructor() {}

  getAppSettings(): AppSettings {
    let stringData: string, parsedData: AppSettings; 
    stringData = localStorage.getItem(this.dataKey);
    parsedData = JSON.parse(stringData);
    if (parsedData && Object.keys(parsedData).length > 0) return parsedData;
    parsedData = new AppSettings();
    this.updateAppSettings(parsedData);
    return parsedData;
  }

  updateAppSettings(newSettings: AppSettings): void {
    const convertedSettings = JSON.stringify(newSettings);
    localStorage.setItem(this.dataKey, convertedSettings);
  }
}
