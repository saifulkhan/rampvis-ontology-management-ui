import { Routes } from '@angular/router';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionResolverService } from '../services/collection.resolver';
import { SourceListComponent } from './source-list/source-list.component';
import { MiningListComponent } from './mining-list/mining-list.component';
import { SourceResolverService } from '../services/source.resolver';

export const routes: Routes = [
  {
    path: '',
    children: [
      // { path: '', redirectTo: 'collection'},
      {
        path: '',
        component: CollectionListComponent
      },
      {
        path: ':collectionId/source',
        component: SourceListComponent,
        resolve: { collection: CollectionResolverService }
      },
      {
        path: ':collectionId/source/:sourceId/mining',
        component: MiningListComponent,
        resolve: { source: SourceResolverService }
      }
    ]
  }
];
