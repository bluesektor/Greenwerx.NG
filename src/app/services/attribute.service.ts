// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { Api } from './api';
import { Filter } from '../models/filter';

@Injectable({
    providedIn: 'root'
  })
export class AttributeService  {

    constructor( private api: Api) {
    }

    addAttribute(attribute) {
        return this.api.invokeRequest('POST', 'api/Attributes/Add', attribute);
    }

    deleteAttribute(attributeUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/Attributes/Delete/' + attributeUUID , ''    );
    }

    getAttributes(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Attributes' , filter, );
    }

    updateAttribute(attribute) {
        return this.api.invokeRequest('PATCH', 'api/Attributes/Update', attribute);
    }

    getDataTypes( filter: Filter){
        return this.api.invokeRequest('POST', 'api/Attributes/DataTypes' , filter, );
    }

    getDataForType(type:string, filter: Filter){
        return this.api.invokeRequest('POST', 'api/Attributes/Data/Type/'  + type, filter, );
    }
}
