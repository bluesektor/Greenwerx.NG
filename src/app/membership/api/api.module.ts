// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';


import { KeysComponent } from './keys.component';
// import { AccountService } from '../../services/user/account.service';
import { PreventUnsavedChangesGuard } from '../../prevent-unsaved-changes-guard.service';
import { CommonModuleEx  } from '../../common/common.moduleex';
import { MessageBoxesModule } from '../../common/messageboxes.module';
import { GraphsModule } from '../../common/graphs.module';
import { SessionService } from '../../services/user/session.service';
import { AccordionModule } from 'primeng';
import { CheckboxModule } from 'primeng';

import { PickListModule } from 'primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng';
import { APIRoutingModule} from './api.routing';
import { APIComponent } from './api.component';

import { TableModule, SharedModule, DialogModule,    StepsModule, AutoCompleteModule} from 'primeng';


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
         
        APIRoutingModule,
        MessageBoxesModule,
        TableModule,
        DialogModule,
        GraphsModule
    ]
    ,
    declarations: [
        KeysComponent,
        APIComponent
    ],
    exports: [
        KeysComponent,
        APIComponent
    ],
})
export class APIModule {

}
