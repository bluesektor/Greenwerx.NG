// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

export class Session {

    constructor() {
        this.sessionExpires = new Date();
        this.validSession = false;
        this.isAdmin = false;
        this.authToken = '';
        this.userAccountUUID = '';
        this.userUUID = '';
        this.defaultLocationUUID = '';
    }

    validSession: boolean;

    isAdmin: boolean;

    authToken: string;

    userAccountUUID: string;

    userUUID: string;

    sessionExpires: Date;

    defaultLocationUUID: string;

    cartTrackingId: string; // keeps track of the clients cart items

}
