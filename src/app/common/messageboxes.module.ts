// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickListModule } from 'primeng/primeng';

 import { MessageBoxesComponent } from './messageboxes.component';


@NgModule({
    imports: [
        CommonModule
  ],
    declarations: [
        MessageBoxesComponent
    ],
    exports: [
        MessageBoxesComponent
    ]
})
export class MessageBoxesModule {

}
