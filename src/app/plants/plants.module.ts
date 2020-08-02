// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { CheckboxModule } from 'primeng';

import { TableModule, SharedModule, DialogModule,  StepsModule, AutoCompleteModule} from 'primeng';
import { ConfirmDialogModule, ConfirmationService, PanelModule, InputSwitchModule, FileUploadModule } from 'primeng';
import { PreventUnsavedChangesGuard } from '../prevent-unsaved-changes-guard.service';

import { CommonModuleEx} from '../common/common.moduleex';
import { SessionService } from '../services/user/session.service';
import { StrainsComponent } from './strains.component';

import { PlantsService } from '../services/plants.service';


import { PlantsRoutingModule } from './plants.routing';
import { MessageBoxesModule } from '../common/messageboxes.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModuleEx,
        CheckboxModule,
        TableModule,
        SharedModule,
        DialogModule,
        RouterModule,
        PanelModule,
        StepsModule,
        InputSwitchModule,
        FileUploadModule,
        AutoCompleteModule,
        PlantsRoutingModule,
        MessageBoxesModule


    ]
    ,
    declarations: [
        StrainsComponent
    ],
    exports: [
        StrainsComponent
    ],
})
export class PlantsModule {

}
