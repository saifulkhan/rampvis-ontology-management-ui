import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private authenticatedUserService: AuthenticationService,
        ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('AuthInterceptor: intercept');

        return next.handle(request).pipe(
            tap(
                () => {},
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status !== 401) {
                            return;
                        }
                        // console.log('AuthInterceptor');
                        this.authenticatedUserService.logout();
                        this.router.navigate(['/login']);
                    }
                }
            )
        );
    }
}
