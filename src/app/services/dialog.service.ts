import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable()
export class DialogService {
    constructor() {}

    open(title: string, text: string, confirmText?: string) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'info',
            customClass: {
                confirmButton: 'btn btn-success btn-sm',
                cancelButton: 'btn btn-danger btn-sm',
            },
        });
    }

    warn(title: string, text: string, confirmText?: string) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            customClass: {
                confirmButton: 'btn btn-danger btn-sm',
                cancelButton: 'btn btn-primary btn-sm',
            },
            showCancelButton: true,
            confirmButtonText: confirmText,
            buttonsStyling: false,
        });
    }
}
