import {Injectable} from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    constructor() {
    }

    clone<T>(value: T): T {
        if (typeof value !== 'object' || value === null) {
            return value;
        }

        if (Array.isArray(value)) {
            return this.deepArray(value);
        }
        return this.deepObject(value);
    }

    validateEmail(email: string): Boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    nameOf(prop: () => string) {
        return /\.([^\.;]+);?\s*\}$/.exec(prop.toString())[1];
    }

    goToLink(url: string) {
        window.open(url, '_blank');
    }

    private deepObject<T>(source: T) {
        const result = {};

        Object.keys(source).forEach(key => {
            const value = source[key];

            if (value instanceof Date) {
                result[key] = new Date(value.getTime());
            } else {
                result[key] = this.clone(value);
            }
        }, {});
        return result as T;
    }

    private deepArray(collection: any) {
        return collection.map(value => {
            return this.clone(value);
        });
    }

    // If we need to know which fields of the form are invalid
    getFormValidationErrors(form) {
        Object.keys(form.controls).forEach(key => {

            const controlErrors: ValidationErrors = form.get(key).errors;
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach(keyError => {
                    console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                });
            }
        });
    }
}
