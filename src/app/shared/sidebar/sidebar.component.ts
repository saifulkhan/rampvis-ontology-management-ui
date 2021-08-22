import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';

import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.enum';
import { PAGE_TYPE } from '../../models/ontology/page-type.enum';

declare const $: any;

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
    roles?: Array<string>;
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

// Sidebar items
export const ROUTES: RouteInfo[] = [
    {
        path: '/home',
        title: 'Home',
        type: 'link',
        icontype: 'home',
        roles: [Role.ADMIN],
    },
    {
        path: '/data',
        title: 'Data Streams',
        type: 'link',
        icontype: 'storage',
        roles: [Role.ADMIN],
    },
    {
        path: '/vis',
        title: 'VIS Functions',
        type: 'link',
        icontype: 'insert_chart',
        roles: [Role.ADMIN],
    },
    {
        path: '/pages',
        title: 'Pages',
        type: 'sub',
        icontype: 'web',
        roles: [Role.ADMIN],
        collapse: 'page',
        children: [
            { path: `${PAGE_TYPE.EXAMPLE}`, title: 'Example', ab: 'EXM' },
            { path: `${PAGE_TYPE.REVIEW}`, title: 'Review', ab: 'REV' },
            { path: `${PAGE_TYPE.RELEASE}`, title: 'Released', ab: 'REL' },
        ],
    },
    {
        path: '/propagation',
        title: 'Propagation',
        type: 'link',
        icontype: 'playlist_add',
        roles: [Role.ADMIN],
    },
    {
        path: '/admin',
        title: 'Administration',
        type: 'sub',
        icontype: 'admin_panel_settings',
        roles: [Role.ADMIN],
        collapse: 'admin',
        children: [
            //{ path: 'agents', title: 'Agents', ab: 'AGT' },
            { path: 'users', title: 'Users', ab: 'USR' },
            { path: 'activities', title: 'Activities', ab: 'ACT' },
        ],
    },
    // {
    //     path: '/test-components',
    //     title: 'Test Components',
    //     type: 'link',
    //     icontype: 'help',
    //     roles: [Role.ADMIN],
    // },
];

@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    public menuItems!: any[];
    ps: any;
    sidebarMini = false;
    user!: User;

    constructor(private authenticatedUserService: AuthenticationService) {}

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    ngOnInit() {
        this.user = this.authenticatedUserService.getUser();
        this.menuItems = ROUTES.filter((menuItem) => {
            if (!menuItem.roles || (menuItem.roles && menuItem.roles.find((u) => u == this.user.role) != null)) {
                return menuItem;
            } else {
                return undefined;
            }
        });

        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }
    }

    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
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

    logout() {
        this.authenticatedUserService.logout();
        window.location.replace('/login');
    }
}
