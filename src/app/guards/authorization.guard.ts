import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router'

import { AuthenticationService } from '../services/authentication.service';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class AuthorizationGuard implements CanActivate, CanActivateChild {
  constructor(private authenticatedUserService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const allowedRoles = next.data.allowedRoles;
    const isAuthorized = this.authorizationService.isAuthorized(allowedRoles);

    return this.isAuthenticated(isAuthorized);
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const allowedRoles = next.data.allowedRoles;
    const isAuthorized = this.authorizationService.isAuthorized(allowedRoles);

    return this.isAuthenticated(isAuthorized);
  }

  private isAuthenticated(isAuthorized: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // console.log('AuthorizationGuard: isAuthenticated: isAuthorized = ', isAuthorized);

      this.authenticatedUserService.isAuthenticated().then(() => {
        // console.log('AuthorizationGuard: isAuthenticated: isAuthenticated - resolved',);

        if (!isAuthorized) {
          this.router.navigate([this.authenticatedUserService.getDefaultRoute()]);
          reject();
        }
        resolve(true);
      }).catch(() => {
        console.log('AuthorizationGuard: isAuthenticated: isAuthenticated - rejected',);
        this.router.navigate(['/login']);
        reject();
      });
    });
  }

}
