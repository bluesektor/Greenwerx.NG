// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickListModule } from 'primeng';

 import { MessageBoxesComponent } from './messageboxes.component';
 import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
    imports: [
        CommonModule,
        
     SimpleNotificationsModule.forRoot()
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
