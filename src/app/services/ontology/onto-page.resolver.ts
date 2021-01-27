import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { OntoPageExt } from '../../models/ontology/onto-page.model';
import { OntoPageService } from './onto-page.service';

interface Resolve<T> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OntoPageExt>;
}

@Injectable({ providedIn: 'root' })
export class OntoPageResolverService implements Resolve<OntoPageExt> {
    constructor(private ontoPageService: OntoPageService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OntoPageExt> {

        console.log('route.params.pageId = ', route.params.pageId)

        if (route.params.pageId === 'new') {
            return undefined as any;
        } else {
            return this.ontoPageService.getOntoPageExt(route.params.pageId);
        }
    }
}
