import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Source } from '../shared/models/source.model';
import { SourceService } from './source.service';


interface Resolve<T> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Source>
}

@Injectable({ providedIn: 'root' })
export class SourceResolverService implements Resolve<Source> {

  constructor(
    private sourceService: SourceService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Source> {
    return this.sourceService.getSource(route.params.sourceId);
  }
}
