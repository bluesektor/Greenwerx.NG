
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';


import { CheckboxModule } from 'primeng';

import { TableModule, SharedModule, DialogModule } from 'primeng';

import { PreventUnsavedChangesGuard } from '../../prevent-unsaved-changes-guard.service';
import { MessageBoxesModule } from '../../common/messageboxes.module';
import { CommonModuleEx } from '../../common/common.moduleex';

import { SessionService } from '../../services/user/session.service';

import { User } from '../../models/user';
import { UserProfileComponent } from './profile.component';
import { UsersComponent } from './users.component';
import { UserService } from '../../services/user/user.service';
import { LoginComponent } from './login.component';
import { LoginHelpComponent } from './login-help.component';
import { ChangePasswordComponent } from './change-password.component';
import { UsersValidateComponent } from './users-validate.component';
import { UsersRoutingModule } from './users.routing';

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
        UsersRoutingModule,
        MessageBoxesModule
    ]
    ,
    declarations: [
        UserProfileComponent,
        UsersComponent,
        LoginComponent,
        LoginHelpComponent,

        ChangePasswordComponent,
        UsersValidateComponent
    ],
    exports: [
        UserProfileComponent,
        UsersComponent
    ],
})
export class UsersModule {

}
