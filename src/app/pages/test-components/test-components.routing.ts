import { Routes } from '@angular/router';
import { TestComponentsComponent } from './test-components.component';

export const TestComponentsRoutes: Routes = [
    {
        path: '',
        children: [{ path: '', component: TestComponentsComponent }],
    },
];
