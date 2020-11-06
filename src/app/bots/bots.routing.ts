import { Routes } from '@angular/router';
import { BotsStatusComponent } from './status/bots-status.component';

export const BotsRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: BotsStatusComponent }
    ]
  }
];
