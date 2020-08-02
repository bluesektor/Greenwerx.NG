// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { Api } from './api';
import { SessionService } from '../services/user/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { UnitOfMeasure } from '../models/unitofmeasure';


@Injectable()
export class UnitsOfMeasureService  {

    public  unitsOfMeasure: UnitOfMeasure[] = [];

    constructor(private api:Api) {
     
    }

    add(uom: UnitOfMeasure) {
        return this.api.invokeRequest('POST', 'api/UnitsOfMeasure/Add', uom);
    }


    delete(uuid) {
        return this.api.invokeRequest('DELETE', 'api/UnitsOfMeasure/Delete/' + uuid, ''    );
    }

    get(filter?: Filter) {
        return this.api.invokeRequest('GET', 'api/UnitsOfMeasure',filter);
    }

    getByUUID(uuid: string){
        return this.api.invokeRequest('GET', 'api/UnitsOfMeasureBy/' + uuid);
    }

    update(uom: UnitOfMeasure) {
        return this.api.invokeRequest('PATCH', 'api/UnitsOfMeasure/Update',  uom );
    }
}
