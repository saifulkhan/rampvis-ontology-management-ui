import { Routes } from '@angular/router';
import { TwitterSearchComponent } from './twitter-search/twitter.search.component';

export const SearchRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: TwitterSearchComponent }
    ]
  }
];
