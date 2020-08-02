// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { Api } from './api';
import { SessionService } from '../services/user/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { UnitOfMeasure } from '../models/unitofmeasure';
import { Order } from '../models/order';
import { FinanceAccount } from '../models/financeaccount';
import { FinanceAccountTransaction } from '../models/financeaccountransaction';
import { PriceRule } from '../models/pricerule';
import { BasicValidators } from '../common/basicValidators';

@Injectable()
export class OrdersService   {

    constructor(private api: Api) {
    }

    getOrders(filter?: Filter) {
        return this.api.invokeRequest('GET', 'api/Orders/' ,filter);
    }

    getOrder(name: string) {
        return this.api.invokeRequest('GET', 'api/Orders/' + name);
    }

    getOrderSymbols(filter?: Filter) {
        return this.api.invokeRequest('GET', 'api/Orders/Symbols', filter);
    }
    getAssetClasses(filter?: Filter) {
        return this.api.invokeRequest('GET', 'api/AssetClasses', filter);
    }


    addOrder(currency: Order) {
        return this.api.invokeRequest('POST', 'api/Orders/Add', currency);
    }

    updateOrder(currency: Order) {
        return this.api.invokeRequest('PATCH', 'api/Orders/Update', currency);
    }

    deleteOrder(orderUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/Orders/Delete/' + orderUUID);
    }
}
