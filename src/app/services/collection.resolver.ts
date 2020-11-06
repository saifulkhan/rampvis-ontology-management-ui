import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { CollectionService } from './collection.service';
import { Collection } from '../shared/models/collection.model';


interface Resolve<T> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Collection>;
}

@Injectable({ providedIn: 'root' })

export class CollectionResolverService implements Resolve<Collection> {

  constructor(
    private collectionService: CollectionService
  ) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Collection> {
    return this.collectionService.getCollection(route.params['collectionId']);
  }
}
