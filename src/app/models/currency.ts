// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Node } from '../models/node';

export class Currency extends Node {

    Symbol: string;

    AssetClass: string;

    Country: string;

    SortOrder: number;

    Test: boolean; // i.e. use testnet or environment
}
