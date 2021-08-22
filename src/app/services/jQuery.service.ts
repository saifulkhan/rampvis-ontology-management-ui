import { InjectionToken } from '@angular/core';

export const JQ_TOKEN = new InjectionToken('jQuery');

export function jQueryFactory() {
    const w: any = window;
    return w['jQuery'];
}

export const JQUERY_PROVIDER = [{ provide: JQ_TOKEN, useFactory: jQueryFactory }];
