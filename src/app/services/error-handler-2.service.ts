import { NullTemplateVisitor } from '@angular/compiler';
import { Injectable } from '@angular/core';

import { HTTP_ERROR_CODES } from '../models/http-error-codes.enum';
import { HelperService } from './helper.service';
import { LocalNotificationService } from './local-notification.service';


@Injectable()
export class ErrorHandler2Service {
	constructor(private localNotificationService: LocalNotificationService,
                private helperService: HelperService) {
	}

	handleError(error: any, showErrorNotification: boolean = true): string | null {
		if (!error) {
			error = {};
		}
		const code: string | null = this.processErrorCode(error.rejection || error);
		const message: string | null = this.processErrorMessage(error.rejection || error);
        const detail: string | null = this.processErrorDetail(error.rejection || error);

		// Debugging purpose
		//console.log('ErrorHandler2Service:handleError: error = ', error);
		//console.log('ErrorHandler2Service:handleError: code = ', code, ', message = ', message, ', detail = ', detail);

		if (code && showErrorNotification) {
			this.localNotificationService.error({ message: `${code} : ${message || detail}`, title: 'API Response' });
		}
		return message || detail;
	}

	private processErrorCode(error: any): string | null {
		if (!error) {
			return null;
		}

		if (error?.error?.code) {
			if (HTTP_ERROR_CODES[error.error.code]) {
				const data: any = error.error.data || {};
				const message: string = this.helperService.template(HTTP_ERROR_CODES[error.error.code], data);
				return message;
			}
		}

		if (error.status === 0) {
			return 'Connection Error';
		}
		if (error.status === 500) {
			return '500';
		}

		return null;
	}

	private processErrorMessage(error: any): string | null {
		if (!error) {
			return null;
		}

		if (error.error && error.error.message) {
			return error.error.message;
		}

		return null;
	}

    // FastAPi sends { detail: }
    private processErrorDetail(error: any): string | null {
		if (!error) {
			return null;
		}

		if (error.error && error.error.detail) {
			return error.error.detail;
		}

		return null;
	}
}
