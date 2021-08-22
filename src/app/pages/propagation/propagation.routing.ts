import { Routes } from '@angular/router';
import { PropagationComponent } from './propagation.component';

export const PropagationRoutes: Routes = [
    {
        path: '',
        children: [{ path: '', component: PropagationComponent }],
    },
];
