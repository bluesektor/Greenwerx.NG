// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { Api } from './api';
import { SessionService } from '../services/user/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';

@Injectable()
export class GeoService     {

    constructor(private api:Api) {
      
    }

    addLocation(location) {
        return this.api.invokeRequest('POST', 'api/Locations/Add', location);
    }
    getLocationTypes() {
        return this.api.invokeRequest('GET', 'api/Locations/LocationTypes', ''    );
    }

    getCustomLocations() {
        return this.api.invokeRequest('GET', 'api/Locations/Custom');
    }


    getLocations(locationType: string, filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Locations/LocationType/' + locationType ,filter);
    }

    deleteLocation(settingUUID) {
        return this.api.invokeRequest('DELETE', 'api/Locations/Delete/' + settingUUID, ''    );
    }

    updateLocation(location) {
        return this.api.invokeRequest('PATCH', 'api/Locations/Update', location);
    }


    getChildLocations(parentUUID: string ,  filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/ChildLocations/' + parentUUID ,filter);
    }
}
