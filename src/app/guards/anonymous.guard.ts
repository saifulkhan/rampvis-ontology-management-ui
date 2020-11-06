import {Injectable} from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';

import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class AnonymousGuard implements CanActivate, CanActivateChild {
    constructor(private authenticatedUserService: AuthenticationService,
                private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.authenticatedUserService.isAuthenticated().then(() => {
            const path: string = this.authenticatedUserService.getDefaultRoute();
            this.router.navigate([path]);
            return false;
        }).catch(() => {
            return true;
        });
    }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.authenticatedUserService.isAuthenticated().then(() => {
            const path: string = this.authenticatedUserService.getDefaultRoute();
            this.router.navigate([path]);
            return false;
        }).catch(() => {
            return true;
        });
    }

}
