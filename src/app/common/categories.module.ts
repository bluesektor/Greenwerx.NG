// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PickListModule } from 'primeng';
import { TableModule, SharedModule, DialogModule, CheckboxModule  } from 'primeng';
import { MessageBoxesModule } from './messageboxes.module';
import { CategoriesComponent} from './categories.component';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MessageBoxesModule,
        TableModule,
        SharedModule,
        DialogModule,
        CheckboxModule
    ],
    declarations: [
        CategoriesComponent
    ],
    exports: [
      CategoriesComponent
    ]
})
export class CategoriesModule {

}
