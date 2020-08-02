// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CheckboxModule } from 'primeng';
import { MessageBoxesModule } from '../common/messageboxes.module';
import { TableModule, SharedModule, DialogModule, AccordionModule, DropdownModule,
     InputSwitchModule, FileUploadModule} from 'primeng';
import { PreventUnsavedChangesGuard } from '../prevent-unsaved-changes-guard.service';

import { CommonModuleEx } from '../common/common.moduleex';
import { InventoryComponent } from './inventory.component';

import { SessionService } from '../services/user/session.service';

import { InventoryService } from '../services/inventory.service';
import { InventoryRoutingModule} from './inventory.routing';
import {PipesModule} from '../common/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CheckboxModule,
        TableModule,
        AccordionModule,
        SharedModule,
        DialogModule,
        RouterModule,
        DropdownModule,
        InputSwitchModule,
        FileUploadModule,
        InventoryRoutingModule,
        MessageBoxesModule,
        PipesModule
    ]
    ,
    declarations: [
        InventoryComponent    ],
    exports: [
        InventoryComponent
    ],
})
export class InventoryModule {

}
