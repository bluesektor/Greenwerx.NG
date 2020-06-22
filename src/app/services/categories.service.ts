﻿// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { WebApiService } from '../services/webApi.service';
import { SessionService } from '../services/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';

@Injectable()
export class CategoriesService extends WebApiService {

    constructor(http: Http, sessionService: SessionService) {
        super(http, sessionService);
    }

    addCategory(category) {
        return this.invokeRequest('POST', 'api/Categories/Add', JSON.stringify(category));
    }

    getCategories(filter: Filter) {
        return this.invokeRequest('GET', 'api/Categories?filter=' + JSON.stringify(filter), );
    }

    deleteCategory(categoryUUID: string) {
       // var cat = categoryUUID.replace('.', ''    );
        return this.invokeRequest('DELETE', 'api/Categories/Delete/' + categoryUUID , ''    );
    }

    updateCategory(category) {
        return this.invokeRequest('PATCH', 'api/Categories/Update', category);
    }
}
