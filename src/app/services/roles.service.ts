// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import { Api } from './api';
import { SessionService } from '../services/user/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';

@Injectable()
export class RoleService  {

    constructor(private api: Api) {
        

    }

    addRole(role) {

        return this.api.invokeRequest('POST', 'api/Roles/Add', role);
    }

    deleteRole(roleUUID) {

        return this.api.invokeRequest('DELETE', 'api/Roles/Delete/' + roleUUID );
    }

    getRoles() {
        return this.api.invokeRequest('GET', 'api/Roles/');
    }

    getRole(roleUUID) {
        return this.api.invokeRequest('GET', 'api/RolesBy/' + roleUUID);
    }


    getNonMembers(roleUUID) {
        return this.api.invokeRequest('GET', 'api/Roles/' + roleUUID + '/Users/Unassigned');
    }

    getMembers(roleUUID) {

        return this.api.invokeRequest('GET', 'api/Roles/' + roleUUID + '/Users');
    }

    addUsersToRole(roleUUID: string, users: Node[]) {

        const newMembers = users;
        return this.api.invokeRequest('POST', 'api/Roles/' + roleUUID + '/Users/Add', newMembers);
    }

    removeUsersFromRole(roleUUID: string, users: Node[]) {
        const removeMembers = users;
        return this.api.invokeRequest('POST', 'api/Roles/' + roleUUID + '/Users/Remove', removeMembers);
    }

    updateRole(role) {
       return this.api.invokeRequest('PATCH', 'api/Roles/Update', role);
    }


    getAvailablePermisssions(roleUUID: string, searchFilter: Filter) {
        return this.api.invokeRequest('GET', 'api/Roles/' + roleUUID + '/Permissions/Unassigned', searchFilter);
    }

    getSelectedPermisssions(roleUUID, searchFilter: Filter) {

        return this.api.invokeRequest('GET', 'api/Roles/' + roleUUID + '/Permission' ,searchFilter);
    }

    addPermissionsToRole(roleUUID: string, permissions: Node[]) {
        const newPermissions = permissions;
                return this.api.invokeRequest('POST', 'api/Roles/' + roleUUID + '/Permissions/Add', newPermissions);
    }

    removePermissionsFromRole(roleUUID: string, permissions: Node[]) {
        const removePermissions = permissions;
        return this.api.invokeRequest('POST', 'api/Roles/' + roleUUID + '/Permissions/Delete', removePermissions);
    }
}
