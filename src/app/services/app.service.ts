// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { Api } from './api';
import { SessionService } from '../services/user/session.service';
import { AppInfo } from '../models/appinfo';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import {ApiKey} from '../models/apikey';

@Injectable()
export class AppService   {

    constructor(private api: Api) {
    }
    addApiKey(apiKey: ApiKey) {
        return this.api.invokeRequest('POST', 'api/ApiKeys/Add', apiKey);
    }

    getApiKeys(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/ApiKeys' , filter);
    }

    getApiKey(apiKeyUUID) {
        return this.api.invokeRequest('GET', 'api/ApiKeysBy/' + apiKeyUUID, ''    );
    }

    deleteApiKey(apiKeyUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/ApiKeys/Delete/' + apiKeyUUID, ''    );
    }

    updateApiKey(apiKey: ApiKey) {
        return this.api.invokeRequest('PATCH', 'api/ApiKeys/Update', apiKey);
    }

    testIPN(params: string) {
        return this.api.invokeRequest('POST', 'api/PayPal/IPN');
    }

    getPublicSettings(filter?: Filter) {
        console.log('app.service.ts  getPublicSettings Api.authToken', Api.authToken);
        return this.api.invokeRequest('POST', 'api/Apps/Public/Settings' , filter );
    }

    getAppStatus() {
        return this.api.invokeRequest('GET', 'api/Apps/web/Status' , ''    );
    }

    getDashboard(viewName: string) {
        
        const url = 'api/Apps/Dashboard/' + viewName;

        return this.api.invokeRequest('POST', url);
    }


    getTemplate(templateName: string, replaceOptions: string) {

        const url = 'api/Apps/Template/' + templateName + '/Replace/' + replaceOptions;

        return this.api.invokeRequest('GET', url, '');
    }

    sendMessage(message) {
        
     

        return this.api.invokeRequest('POST', 'api/Site/SendMessage', message);
    }

    installApp(appInfo: AppInfo) {
        
     

        return this.api.invokeRequest('POST', 'api/Apps/Install', appInfo);
    }

    CreateDatabase(appInfo: AppInfo) {
        
     

        return this.api.invokeRequest('POST', 'api/Apps/Install/CreateDatabase',  appInfo);
    }

    SaveSettings(appInfo: AppInfo) {
        
     

        return this.api.invokeRequest('POST', 'api/Apps/Install/SaveSettings', appInfo);
    }
    SeedDatabase(appInfo: AppInfo) {
        
     

        return this.api.invokeRequest('POST', 'api/Apps/Install/SeedDatabase', appInfo);
    }
    AddAccounts(appInfo: AppInfo) {
        
     

        return this.api.invokeRequest('POST', 'api/Apps/Install/Accounts', appInfo);
    }
    Finalize(appInfo: AppInfo) {
        return this.api.invokeRequest('POST', 'api/Apps/Install/Finalize', appInfo);
    }
    getDefaults(type: string, filter?: Filter) {
        return this.api.invokeRequest('GET', 'api/Apps/DefaultData/' + type ,filter );
    }


    dataTypes() {
        return this.api.invokeRequest('GET', 'api/Apps/DataTypes');

    }

    tableNames() {
        return this.api.invokeRequest('GET', 'api/Apps/TableNames');
    }

    scanForDuplicates(tableName: string) {
        return this.api.invokeRequest('GET', 'api/App/Tables/ScanNames/' + tableName);
    }

    searchTables(name: string, values: string[]) {
        return this.api.invokeRequest('POST', 'api/App/Tables/Search/' + name, values);
    }

    deleteItem(table: string, uuid: string) {
        return this.api.invokeRequest('DELETE', 'api/Apps/Tables/' + table + '/DeleteItem/' + uuid);
    }
}
