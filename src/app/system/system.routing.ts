// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { PreventUnsavedChangesGuard } from '../prevent-unsaved-changes-guard.service';

 const systemRoutes:  Routes = [
    { path: 'settings', component: SettingsComponent }
];

@NgModule({
    imports: [ RouterModule.forChild( systemRoutes ) ],
    exports: [ RouterModule ]
  })
  export class SystemRoutingModule { }
