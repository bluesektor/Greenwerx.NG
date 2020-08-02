﻿import { Node } from './node';

export class Role extends Node {

    Status: string;

    RoleWeight: number;

    RoleOperation: string;

    CreatedBy: string;

    Image: string;

     Private: boolean;

    SortOrder: number;

    Active: boolean;

    ParentId: number;

    Deleted: boolean;
    UUID: string;
    UUIDType: string;

    UUParentID: string;
    UUParentIDType: string;
    Name: string;

    StartDate: any;
    EndDate: any;

     Persists: boolean;

    AccountUUID: string;

    AppType: string;

    Weight: number;

    Category: string;

    CategoryRoleName: string;

    Selected: boolean; // NOTE: for ui purposes only
}

