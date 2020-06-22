// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolsComponent } from './tools.component';
import { PreventUnsavedChangesGuard } from '../prevent-unsaved-changes-guard.service';

 const utilitiesRoutes:  Routes = [
    { path: 'tools', component: ToolsComponent }
];

@NgModule({
    imports: [ RouterModule.forChild( utilitiesRoutes ) ],
    exports: [ RouterModule ]
  })
  export class UtilitiesRoutingModule { }
