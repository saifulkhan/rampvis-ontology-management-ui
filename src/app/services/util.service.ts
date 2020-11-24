import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class UtilService {
    constructor() {}

    deepCopy = <T>(target: T): T => {
        if (target === null) {
            return target;
        }
        if (target instanceof Date) {
            return new Date(target.getTime()) as any;
        }
        if (target instanceof Array) {
            const cp = [] as any[];
            (target as any[]).forEach((v) => {
                cp.push(v);
            });
            return cp.map((n: any) => this.deepCopy<any>(n)) as any;
        }
        if (typeof target === 'object' && target !== {}) {
            const cp = { ...(target as { [key: string]: any }) } as {
                [key: string]: any;
            };
            Object.keys(cp).forEach((k) => {
                cp[k] = this.deepCopy<any>(cp[k]);
            });
            return cp as T;
        }
        return target;
    };

    validateEmail(email: string): Boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    nameOf(prop: () => string) {
        const r = /\.([^\.;]+);?\s*\}$/.exec(prop.toString());
        return (r && r.length) ? r[1] : '';
    }


    goToLink(url: string) {
        window.open(url, '_blank');
    }

    // If we need to know which fields of the form are invalid
    getFormValidationErrors(form: any) {
        Object.keys(form.controls).forEach((key) => {
            const controlErrors: ValidationErrors = form.get(key).errors;
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach((keyError) => {
                    console.log( 'Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError] );
                });
            }
        });
    }
}
