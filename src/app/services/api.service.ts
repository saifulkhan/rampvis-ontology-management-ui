import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class APIService {
    private endpoint!: string;
    private path: string = '';
    private authToken!: string;

    constructor(private http: HttpClient) {
        this.endpoint = environment.components.API_JS;
        this.authToken = localStorage.getItem('api_token') as string;
    }

    getHeaders(json: boolean = true) {
        let headers = new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + (this.authToken || ''));

        if (json) {
            headers = headers.set('Content-Type', 'application/json');
        }
        return { headers: headers };
    }

    setToken(token: string) {
        localStorage.setItem('api_token', token);
        this.authToken = token;
    }

    getToken() {
        return this.authToken;
    }

    logout() {
        localStorage.removeItem('api_token');
        this.authToken = null as any;
    }

    getEndpoint(url: string): string {
        if (url.indexOf('http') === 0) {
            return url;
        }

        // if (!this.path) {
        //     throw new Error('invalid path');
        // }
        if (!url.startsWith('/')) {
            url = '/' + url;
        }

        return this.endpoint + url;
    }

    getHTTPAuth(url: string): string {
        return this.getEndpoint(url) + '?authorization=' + encodeURIComponent(this.getToken());
    }

    // HTTP Methods

    get<T extends any>(url: string): Observable<T> {
        return this.http.get<T>(this.getEndpoint(url), this.getHeaders(false))
        .pipe(
            map((resp) => resp as T)
        );
    }

    post<T extends any>(url: string, body: T): Observable<T> {
        return this.http.post<T>(this.getEndpoint(url), body, this.getHeaders())
        .pipe(
            map((resp) => resp as T)
        );
    }

    put<T extends any>(url: string, body: T): Observable<T> {
        return this.http.put<T>(this.getEndpoint(url), JSON.stringify(body), this.getHeaders())
        .pipe(
            map((resp) => resp as T)
        );
    }

    patch<T extends any>(url: string, body: T): Observable<T> {
        return this.http.patch<T>(this.getEndpoint(url), body, this.getHeaders())
        .pipe(
            map((resp) => resp as T)
        );
    }

    delete<T extends any>(url: string): Observable<T> {
        return this.http.delete<T>(this.getEndpoint(url), this.getHeaders(false))
        .pipe(
            map((resp) => resp as T)
        );
    }
}
