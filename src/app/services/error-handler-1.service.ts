import {ErrorHandler, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {ErrorHandler2Service} from './error-handler-2.service';

//
// If used for monitoring errors using system like sentry
//

// import * as Sentry from "@sentry/browser";
// Sentry.init({
//   dsn: environment.components.sentry,
//   environment: environment.configuration
// });

@Injectable()
export class ErrorHandler1Service implements ErrorHandler {
    constructor(private errorHandler2Service: ErrorHandler2Service) {
    }

    public handleError(error: any) {
        //console.log('ErrorHandler1Service:handleError: error = ', error);
        const errorHandled: string | null = this.errorHandler2Service.handleError(error);

        if (!errorHandled && (environment.production || environment.staging)) {
            if (!(error instanceof Response)) {
                // Sentry.captureException(error);
            }
            if (error instanceof Error) {
                // Sentry.showReportDialog();
            }
        }

        if (!(environment.staging || environment.production)) {
            console.error(error);
        }
    }
}
