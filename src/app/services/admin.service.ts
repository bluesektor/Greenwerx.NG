// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import 'rxjs/operators';
import { Api } from './api';
import { SessionService } from '../services/user/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
@Injectable()
export class AdminService   {

    constructor( private api: Api ) {
  
    }

    addSetting(setting) {
        return this.api.invokeRequest('POST', 'api/Apps/Settings/Add',  setting);
    }

    deleteSetting(settingUUID) {
        return this.api.invokeRequest('DELETE', 'api/Apps/Settings/Delete/' + settingUUID, ''    );
    }

    getSettings(filter?: Filter) {

        return this.api.invokeRequest('GET', 'api/Apps/Settings',filter);
    }

    getSetting(settingId) {
        return this.api.invokeRequest('GET', 'api/Apps/Settings/' + settingId, ''    );
    }

    updateSetting(setting) {
        return this.api.invokeRequest('PATCH', 'api/Apps/Settings/Update', setting);
    }

    getToolsDashboard() {
        return this.api.invokeRequest('GET', 'api/Tools/Dashboard');
    }

    backupDatabase() {
        return this.api.invokeRequest('GET', 'api/Tools/Database/Backup');
    }

    restoreDatabase(backupFiles: string) {
        return this.api.invokeRequest('GET', 'api/Tools/Database/Restore', backupFiles);
    }


    cipherText(text: string, encrypt: boolean) {
        if ( encrypt === true) {
            return this.api.invokeRequest('GET', encodeURIComponent('api/Tools/Cipher/' + text + '/Encrypt/' + encrypt) );
        }
        return this.api.invokeRequest('GET', 'api/Tools/Cipher/' + text + '/Encrypt/' + encrypt );
    }

    import(type: string) {
        return this.api.invokeRequest('GET', '/api/Tools/Import/' + type);
    }

    testCode() {
        return this.api.invokeRequest('GET', '/api/Tools/TestCode' );
    }
}
