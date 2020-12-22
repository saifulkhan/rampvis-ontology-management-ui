import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';

import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.enum';
import { BINDING_TYPE } from '../../models/ontology/onto-page.model';
import { PROPAGATION_TYPE } from '../../models/ontology/propagation-type.enum';

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
        path: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard',
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
        path: '/data',
        title: 'Data Streams',
        type: 'link',
        icontype: 'storage',
        roles: [Role.ADMIN],
    },
    {
        path: '/propagation',
        title: 'Propagation',
        type: 'sub',
        icontype: 'playlist_add',
        roles: [Role.ADMIN],
        collapse: 'propagation',
        children: [
            { path: `${PROPAGATION_TYPE.ONE_TO_ONE}`, title: '1-1 Propagation', ab: '1-1' },
            { path: `${PROPAGATION_TYPE.ONE_TO_N}`, title: '1-N Propagation', ab: '1-N' },
        ],
    },  
    {
        path: '/page',
        title: 'Bindings & Pages',
        type: 'sub',
        icontype: 'web',
        roles: [Role.ADMIN],
        collapse: 'page',
        children: [
            { path: `${BINDING_TYPE.EXAMPLE}`, title: 'Example Bindings', ab: 'EXB' },
            { path: `${BINDING_TYPE.REVIEW}`, title: 'Review Pages', ab: 'RVP' },
            { path: `${BINDING_TYPE.RELEASE}`, title: 'Released Pages', ab: 'RLP' },
        ],
    },  
    {
        path: '/admin',
        title: 'Administration',
        type: 'sub',
        icontype: 'admin_panel_settings',
        roles: [Role.ADMIN],
        collapse: 'admin',
        children: [
            { path: 'agents', title: 'Agents', ab: 'ATB' },
            { path: 'users', title: 'Users', ab: 'USR' },
            { path: 'activities', title: 'Activities', ab: 'ACT' },
        ],
    },
    /*
    {
        path: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard',
        roles: [Role.ADMIN, Role.USER],
    },
    {
        path: '/search',
        title: 'Search',
        type: 'link',
        icontype: 'search',
        roles: [Role.ADMIN, Role.USER],
    },
    */
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
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    logout() {
        this.authenticatedUserService.logout();
        window.location.replace('/login');
    }
}
