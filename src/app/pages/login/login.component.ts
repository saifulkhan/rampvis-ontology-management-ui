import { Component, OnInit, ElementRef, OnDestroy, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user.model';

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html',
    styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    user = {
        username: '',
        password: '',
    };
    status: string;
    spinner: boolean;

    constructor(
        private element: ElementRef, 
        private authService: AuthenticationService, 
        private errorHandler: ErrorHandler, 
        private router: Router,
    ) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;

        console.log('LoginComponent: constructor: ');
    }

    ngOnInit() {
        console.log('LoginComponent: ngOnInit: ');

        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        body.classList.add('off-canvas-sidebar');
        const card = document.getElementsByClassName('card')[0];
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            card.classList.remove('card-hidden');
        }, 700);
    }

    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
        body.classList.remove('off-canvas-sidebar');
    }

    login() {
        this.status = undefined;
        this.spinner = true;
        this.authService
            .login(this.user.username, this.user.password)
            .then((user: User) => this.successLogin(user))
            .catch((error) => this.errorLogin(error));
    }

    private successLogin(user: User): void {
        this.spinner = false;
        this.router.navigate([this.authService.getDefaultRoute()]);
    }

    private errorLogin(error: any): void {
        this.spinner = false;
        console.log({error})
        if (error && error.status) {
            this.status = error.status;
        } else {
            this.errorHandler.handleError(error);
        }
        this.user.password = '';
    }
}
