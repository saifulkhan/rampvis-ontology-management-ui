import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-my-app',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit() {
        console.log('AppComponent: ngOnInit:');

       this.router.events
            .pipe(filter((event: Event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                const body = document.getElementsByTagName('body')[0];
                const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
                if (body.classList.contains('modal-open')) {
                    body.classList.remove('modal-open');
                    modalBackdrop.remove();
                }
            });
    }
}
