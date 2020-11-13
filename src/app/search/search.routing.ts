import { Routes } from '@angular/router';
import { TwitterSearchComponent } from './page-search/page.search.component';

export const SearchRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: TwitterSearchComponent }
    ]
  }
];
