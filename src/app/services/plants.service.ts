// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { Api } from '../services/api';
import { SessionService } from '../services/user/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { Strain } from '../models/strain';

@Injectable()
export class PlantsService  {

    constructor(private api :Api) {
         
    }


    addPlant(product) {
        return this.api.invokeRequest('POST', 'api/Plants/Add', product);
    }

    deletePlant(plantUUID) {
        return this.api.invokeRequest('DELETE', 'api/Plants/Delete/' + plantUUID, ''    );
    }

    getPlants(filter: Filter) {
        return this.api.invokeRequest('GET', 'api/Plant' ,filter );
    }

    getPlant(plantUUID) {
        return this.api.invokeRequest('GET', 'api/Plants/' + plantUUID, ''    );
    }

    getPlantDetails(plantUUID, productType) {
        return this.api.invokeRequest('GET', 'api/Plant/' + plantUUID + '/' + productType + '/Details' , ''    );
    }

    updatePlant(plant) {
        return this.api.invokeRequest('PATCH', 'api/Plants/Update', plant);
    }


    // ===--- Strains ---===

    addStrain(strain: Strain) {
        return this.api.invokeRequest('POST', 'api/Strains/Add', strain);
    }

    getStrains(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Strains' ,filter );
    }

    getStrain(strainUUID) {
        return this.api.invokeRequest('GET', 'api/StrainsBy/' + strainUUID, ''    );
    }

    deleteStrain(strainUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/Strains/Delete/' + strainUUID, ''    );
    }

    updateStrain(strain: Strain) {
        return this.api.invokeRequest('PATCH', 'api/Strains/Update', strain);
    }
}
