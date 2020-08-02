// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Node } from './node';

export class Setting extends Node {

    Value: string;

    /// Type for the value (int, string, span etc..).
    Type: string;

    /// web,forms,mobile
    AppType: string;

    SettingClass: string;
}

