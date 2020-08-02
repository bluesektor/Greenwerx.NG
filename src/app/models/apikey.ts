// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Node } from './node';

export class ApiKey extends Node {

    Key: string;
    Status: string;
    Expires: Date = new Date();
    Email: string;
    Restrictions: string;
}
