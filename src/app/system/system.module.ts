// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CheckboxModule } from 'primeng';

import { TableModule, SharedModule, DialogModule, FileUploadModule } from 'primeng';

import { PreventUnsavedChangesGuard } from '../prevent-unsaved-changes-guard.service';

import { CommonModuleEx } from '../common/common.moduleex';

import { SessionService } from '../services/user/session.service';

import { SettingsComponent } from './settings.component';
import { AdminService } from '../services/admin.service';
import { SettingsService } from '../services/settings/settings.service';
import { SystemRoutingModule} from './system.routing';
import { MessageBoxesModule } from '../common/messageboxes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CheckboxModule,
        TableModule,
        SharedModule,
        DialogModule,
        RouterModule,
        FileUploadModule,
        SystemRoutingModule,
        MessageBoxesModule
    ]
    ,
    declarations: [
        SettingsComponent
    ],
    exports: [
        SettingsComponent
    ],
})
export class SystemModule {

}
