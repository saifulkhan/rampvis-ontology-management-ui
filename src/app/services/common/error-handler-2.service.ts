import { Injectable } from '@angular/core';

import { HTTP_ERROR_CODES } from '../../shared/models/http-error-codes.enum';
import { HelperService } from './helper.service';
import { LocalNotificationService } from './local-notification.service';


@Injectable()
export class ErrorHandler2Service {
	constructor(private localNotificationService: LocalNotificationService,
                private helperService: HelperService) {
	}

	handleError(error: any, showErrorNotification: boolean = true): string {
		if (!error) {
			error = {};
		}
		const code: string = this.processErrorCode(error.rejection || error);
		const message: string = this.processErrorMessage(error.rejection || error);

		// Debugging purpose
		//console.log('ErrorHandler2Service: error = ', error);
		//console.log('ErrorHandler2Service: code = ', code, ', message = ', message);

		if (code && showErrorNotification) {
			this.localNotificationService.error({ message: `${code} : ${message}`, title: 'Server' });
		}
		return message;
	}

	private processErrorCode(error: any): string {
		if (!error) {
			return null;
		}

		if (error.error && error.error.code) {
			if (HTTP_ERROR_CODES[error.error.code]) {
				const data: any = error.error.data || {};
				const message: string = this.helperService.template(HTTP_ERROR_CODES[error.error.code], data);
				return message;
			}
		}

		if (error.status === 0) {
			return 'Connection error';
		}
		if (error.status === 500) {
			return 'Something went wrong';
		}

		return null;
	}

	private processErrorMessage(error: any): string {
		if (!error) {
			return null;
		}

		if (error.error && error.error.message) {
			return error.error.message
		}

		return null;
	}

}
