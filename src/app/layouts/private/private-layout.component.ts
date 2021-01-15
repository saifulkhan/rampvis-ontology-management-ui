import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, Event } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { filter } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';

import { NavItem, NavItemType } from './nav-item.interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { AuthorizationService } from '../../services/authorization.service';
import { APIService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';

declare const $: any;

@Component({
    selector: 'app-layout',
    templateUrl: './private-layout.component.html',
})
export class PrivateLayoutComponent implements OnInit, AfterViewInit {
    public navItems!: NavItem[];
    private lastPoppedUrl!: string;
    private yScrollStack: number[] = [];
    url!: string;
    location: Location;
    currentUser!: User;

    @ViewChild('sidebar', { static: false }) sidebar: any;
    @ViewChild(NavbarComponent, { static: false }) navbar!: NavbarComponent;

    constructor(
        private router: Router,
        location: Location,
        private authService: AuthenticationService,
        private authorizationService: AuthorizationService,
        private apiService: APIService,
        private messagingService: NotificationService
    ) {
        this.location = location;
    }

    ngOnInit() {
        //
        // Initialize the services
        //
        // this.messagingService.register();

        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url as string;
        });
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (event.url != this.lastPoppedUrl) {
                    this.yScrollStack.push(window.scrollY);
                }
            } else if (event instanceof NavigationEnd) {
                if (event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined as any;
                    window.scrollTo(0, this.yScrollStack.pop()!);
                } else {
                    window.scrollTo(0, 0);
                }
            }
        });

        this.currentUser = this.authService.getUser();
        this.authorizationService.setUserPermissions(this.apiService.getToken());

        this.router.events.pipe(
            filter((event: Event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                elemMainPanel.scrollTop = 0;
                elemSidebar.scrollTop = 0;
            });

        const html = document.getElementsByTagName('html')[0];

        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            let ps: PerfectScrollbar;
            ps = new PerfectScrollbar(elemSidebar);
            html.classList.add('perfect-scrollbar-on');
        } else {
            html.classList.add('perfect-scrollbar-off');
        }

        this.router.events.pipe(
            filter((event: Event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                this.navbar.sidebarClose();
            });

        this.navItems = [
            {
                type: NavItemType.NavbarLeft,
                title: 'Dashboard',
                iconClass: 'fa fa-dashboard',
            },

            {
                type: NavItemType.NavbarRight,
                title: '',
                iconClass: 'fa fa-bell-o',
                numNotifications: 5,
                dropdownItems: [
                    { title: 'Notification 1' },
                    { title: 'Notification 2' },
                    { title: 'Notification 3' },
                    { title: 'Notification 4' },
                    { title: 'Another Notification' },
                ],
            },
            {
                type: NavItemType.NavbarRight,
                title: '',
                iconClass: 'fa fa-list',

                dropdownItems: [
                    { iconClass: 'pe-7s-mail', title: 'Messages' },
                    { iconClass: 'pe-7s-help1', title: 'Help Center' },
                    { iconClass: 'pe-7s-tools', title: 'Settings' },
                    'separator',
                    { iconClass: 'pe-7s-lock', title: 'Lock Screen' },
                    { iconClass: 'pe-7s-close-circle', title: 'Log Out' },
                ],
            },
            {
                type: NavItemType.NavbarLeft,
                title: 'Search',
                iconClass: 'fa fa-search',
            },

            { type: NavItemType.NavbarLeft, title: 'Account' },
            {
                type: NavItemType.NavbarLeft,
                title: 'Dropdown',
                dropdownItems: [
                    { title: 'Action' },
                    { title: 'Another action' },
                    { title: 'Something' },
                    { title: 'Another action' },
                    { title: 'Something' },
                    'separator',
                    { title: 'Separated link' },
                ],
            },
            { type: NavItemType.NavbarLeft, title: 'Log out' },
        ];
    }

    ngAfterViewInit() {
        this.runOnRouteChange();
    }

    public isMap() {
        if (this.location.prepareExternalUrl(this.location.path()) === '/maps/fullscreen') {
            return true;
        } else {
            return false;
        }
    }

    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
            let ps: PerfectScrollbar;
            ps = new PerfectScrollbar(elemSidebar);
            ps.update();
        }
    }

    isMac(): boolean {
        let bool = false;
        if (
            navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
            navigator.platform.toUpperCase().indexOf('IPAD') >= 0
        ) {
            bool = true;
        }
        return bool;
    }
}
