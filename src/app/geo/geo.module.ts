// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CheckboxModule } from 'primeng';

import { TableModule, SharedModule, DialogModule, AccordionModule, AutoCompleteModule } from 'primeng';
import { PreventUnsavedChangesGuard } from '../prevent-unsaved-changes-guard.service';

import { CommonModuleEx } from '../common/common.moduleex';
import { LocationsComponent } from './locations.component';
import { MessageBoxesModule } from '../common/messageboxes.module';
import { SessionService } from '../services/user/session.service';

import { GeoService } from '../services/geo.service';
import {GeoRoutingModule} from './geo.routing';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModuleEx,
        CheckboxModule,
        TableModule,
        AccordionModule,
        SharedModule,
        DialogModule,
        RouterModule,
        GeoRoutingModule ,
        MessageBoxesModule,
        AutoCompleteModule
    ]
    ,
    declarations: [
        LocationsComponent
    ],
    exports: [
        LocationsComponent
    ],
})
export class GeoModule {

}
