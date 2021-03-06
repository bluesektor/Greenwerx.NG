// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import { Api } from './api';
import { SessionService } from '../services/user/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { DataPoint } from '../models/datapoint';
import { GraphData } from '../models/graphdatasets'; // DataSet
import { List } from 'linqts';
import { AccessLog } from '../models/accesslog';

interface Dictionary<T> {
    [Key: number]: T;
}

@Injectable()
export class ReportService  {

    calcResults: Dictionary<number> = {};

    constructor(private api: Api) {
        
    }

    getDataset(category: string, field: string, searchFilter: Filter) {
        return this.api.invokeRequest('GET', 'api/Reports/' + category + '/Dataset/' + field ,searchFilter);
    }

    // Use compile when data needs to be converted to the
    // data format for display, and/or when data needs to be
    // calculated.
    compile(dataSet: List<DataPoint>, command: string, field: string): GraphData {

         // this groups by key and shows what access log objects are using the key.
        const cnt = dataSet.OrderBy(o => ( <any>o.Value) ).GroupBy(g => (<any> g.Value).UserName, g => (<any>g.Value) );

        const groupedList = this.toList(cnt);

           // Move this to convert function
        const graphSet = new GraphData();
        groupedList.ForEach(item  => {
            if ( item[0].UserName === undefined || item[0].UserName === null ) {
                return false;
            }

            // Add the label
            if ( item[0].UserName.length > 10) {
                graphSet.labels.push(item[0].UserName.substring(item[0].UserName.length - 6 , item[0].UserName.length));
            } else {
                graphSet.labels.push(item[0].UserName);
            }
            // Add the datapoint
            graphSet.datasets.data.push(item.length);
        });

        return graphSet;
    }

    toList(c: object): List<any> {
        const item = new List<any>();
        for (const prop in c) {
            if ( prop != null) {
                item.Add( c[prop] );
            }
        }
        return item;
    }
}
