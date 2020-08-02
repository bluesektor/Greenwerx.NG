// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PreventUnsavedChangesGuard } from '../../prevent-unsaved-changes-guard.service';

import { AccordionModule } from 'primeng';
import { CheckboxModule } from 'primeng';
import { PickListModule } from 'primeng';

import { CommonModuleEx } from '../../common/common.moduleex';
import {RolesComponent } from './roles.component';
import { SessionService } from '../../services/user/session.service';
import { RoleService } from '../../services/roles.service';

import { ConfirmDialogModule, ConfirmationService } from 'primeng';
import {RolesRoutingModule} from './roles.routing';
import { MessageBoxesModule } from '../../common/messageboxes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModuleEx ,
        RouterModule,
        AccordionModule,
        CheckboxModule,
        PickListModule,
        ConfirmDialogModule,
        
        RolesRoutingModule,
        MessageBoxesModule

    ]
    ,
    declarations: [
        RolesComponent

    ],
    exports: [
        RolesComponent
    ]   ,
})
export class RolesModule {

}
