import {Injectable, Inject} from '@angular/core';

import { TruncatePipe } from '../pipes/truncate.pipe';
import {JQ_TOKEN} from './jQuery.service';

declare var $: any;

export enum LOCAL_NOTIFICATION_TYPE {
    info,
    success,
    warning,
    error,
    attention,
}

@Injectable()
export class LocalNotificationService {

    constructor(@Inject(JQ_TOKEN) private $: any) {

    }

    info(data?: object, callback?: Function): void {
        this.showNotification(data, LOCAL_NOTIFICATION_TYPE.info, callback);
    }

    success(data?: object, callback?: Function): void {
        this.showNotification(data, LOCAL_NOTIFICATION_TYPE.success, callback);
    }

    warning(data?: object, callback?: Function): void {
        this.showNotification(data, LOCAL_NOTIFICATION_TYPE.warning, callback);
    }

    error(data?: object, callback?: Function): void {
        this.showNotification(data, LOCAL_NOTIFICATION_TYPE.error, callback);
    }

    attention(data?: object, callback?: Function): void {
        this.showNotification(data, LOCAL_NOTIFICATION_TYPE.attention, callback);
    }

    private showNotification(data?: any, type?: LOCAL_NOTIFICATION_TYPE, callback?: Function) {
        console.log(data, type)
        type = type || LOCAL_NOTIFICATION_TYPE.info;

        const notification = this.$.notify(
            {
                icon: this.getIcon(type),
                message: new TruncatePipe().transform(data.message || '', '100'),
                title: new TruncatePipe().transform(data.title || '', '35'),
                url: data.url
            },
            {
                type: this.getColor(type),
                delay: 1000,
                timer: data.timer || 2000,
                template:
                `<div data-notify="container" class="col-xs-11 col-sm-3 z-index-max pointer alert alert-{0} alert-with-icon" role="alert">` +
                `<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">
                    <i class="material-icons">close</i></button>` +
                `<i class="material-icons" data-notify="icon">${this.getIcon(type)}</i> ` +
                '<span data-notify="title" style="font-weight:bold;">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>',

                placement: {
                    from: 'top',
                    align: 'right',
                }
            },

         );

        if (callback instanceof Function) {
            notification.$ele.on('click', () => {
                callback(notification, data);
            });
        }
    }

    private getIcon(type: LOCAL_NOTIFICATION_TYPE) {

        if (type === LOCAL_NOTIFICATION_TYPE.info) {
            return 'info';
        }
        if (type === LOCAL_NOTIFICATION_TYPE.success) {
            return 'check';
        }
        if (type === LOCAL_NOTIFICATION_TYPE.warning) {
            return 'warning';

        }
        if (type === LOCAL_NOTIFICATION_TYPE.error) {
            return 'error_outline';
        }
        if (type === LOCAL_NOTIFICATION_TYPE.attention) {
            return 'notifications_active';
        }

        return 'info';
    }

    private getColor(type: LOCAL_NOTIFICATION_TYPE) {

        if (type === LOCAL_NOTIFICATION_TYPE.info) {
            return 'info';
        }
        if (type === LOCAL_NOTIFICATION_TYPE.success) {
            return 'success';
        }
        if (type === LOCAL_NOTIFICATION_TYPE.warning) {
            return 'warning';

        }
        if (type === LOCAL_NOTIFICATION_TYPE.error) {
            return 'danger';
        }
        if (type === LOCAL_NOTIFICATION_TYPE.attention) {
            return 'danger';
        }

        return 'info';
    }

}

