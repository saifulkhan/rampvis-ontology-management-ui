import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {APIService} from './api.service';
import {Permissions} from '../models/permissions';

@Injectable()
export class AuthorizationService {
    userPermissions: any;
    private jwtHelperService: JwtHelperService;

    constructor(private api: APIService) {
        this.jwtHelperService = new JwtHelperService();
    }

    isAuthorized(allowedRoles: string[]): boolean {
        // check if the list of allowed roles is empty, if empty, authorize the user to access the page
        if (allowedRoles == null || allowedRoles.length === 0) {
            return true;
        }

        // get token from local storage or state management
        const token = this.api.getToken();

        // decode token to read the payload details
        const decodeToken = this.jwtHelperService.decodeToken(token);

        // debugger;

        // check if it was decoded successfully, if not the token is not valid, deny access
        if (!decodeToken) {
            console.log('Invalid token');
            this.api.logout();
            return false;
        }

        // check if the user roles is in the list of allowed roles, return true if allowed and false if not allowed
        return allowedRoles.includes(decodeToken['role']);
    }

    setUserPermissions(token: any): void {
        // decode token to read the payload details
        const decodeToken = this.jwtHelperService.decodeToken(token);

        // check if it was decoded successfully, if not the token is not valid set permission to empty array
        if (!decodeToken) {
            console.log('Invalid token');
            this.api.logout();
            this.userPermissions = [];
        }

        this.userPermissions = decodeToken.permissions || [];
    }

    hasPermission(permission: Permissions): Boolean {

       // console.log('AuthorizationService: hasPermission: permission = ', permission);

        // If no permission is passed, access denied
        if (permission === null || permission === undefined) {
            return false;
        }

        let parts = permission.split('|');
        let permissionType = this.userPermissions[parts[0]];
        let crud = permissionType ? permissionType[parts[1]] : null;

        // permission type is not found, access denied
        if (permissionType === null || permissionType === undefined) {
            return false;
        }

        // CRUD permission not found, access denied
        if (crud === null || crud === undefined) {
            return false;
        }

        // if no exact field of the permission exist means we want general CRUD with no specific fields to pass, access granted
        if (parts[2] === null || parts[2] === undefined) {
            return true;
        }

        // search through the list of specific CRUD list of fields
        let hasPermission = crud.includes(parts[2]);
        // console.log('AuthorizationService: hasPermission: hasPermission = ', hasPermission);

        return hasPermission;
    }
}
