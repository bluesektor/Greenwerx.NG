﻿// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Screen } from './screen';

export class Filter {

    constructor() {
        this.PageResults = true;
        this.StartIndex = 1;
        this.PageSize = 25;
        this.Screens = [];
    }

    PageResults = true;

    StartIndex = 1;

    PageSize = 25;

    // These are initial sorts, additional sorting can be
    // added to the screens.
    SortBy = '';

    SortDirection = '';

    Screens: Screen[] = [];
}
