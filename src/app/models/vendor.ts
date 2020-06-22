// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Node } from '../models/node';

export class Vendor extends Node {

    Dispensary: boolean;

    Breeder: boolean;

    Grower: boolean;

    // Seed company, grower..
    //
    BreederType: string;
}
