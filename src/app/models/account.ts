// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Node } from './node';

export class Account extends Node {

    BillingAddress: string;

    Email: string;
    // BillingAddress
    // BillingCity
    // BillingState
    // BillingPostalCode
    // BillingCountry
    // Phone
    // AccountSource
    // CreatedBy
    // DateCreated
    // OwnerUUID //NOTE: add rule cant change owner id unless current ower is same as UUID or siteadmin
    // WebSite
    // DunsNumber
    // NaicsCode
    // Sic
    // OwnerType
    // RoleWeight
    // RoleOperation
    // AccountUUID
}

