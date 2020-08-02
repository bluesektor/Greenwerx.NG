// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { Api } from './api';
import { SessionService } from '../services/user/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
@Injectable()
export class EquipmentService       {

    constructor(private api:Api) {
    }

    getEquipment(type: string, filter?: Filter) {
        return this.api.invokeRequest('GET', 'api/Equipment/Type/' + type ,filter);
    }
}
