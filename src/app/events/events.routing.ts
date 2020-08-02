// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { EventGroupsComponent } from './eventgroups.component';
//import { EventInventoryComponent } from './eventinventory.component';
import { EventLocationsComponent } from './eventlocations.component';
//import { EventMembersComponent } from './eventmembers.component';
import { EventsComponent } from './events.component';
 
const eventsRoutes: Routes = [
  //  { path: 'groups', component: EventGroupsComponent },
  //  { path: 'inventory', component: EventInventoryComponent },
    { path: 'locations', component: EventLocationsComponent },
  //  { path: 'members', component: EventMembersComponent },
    { path: 'events', component: EventsComponent },
    { path: '', component: EventsComponent }
];

@NgModule({
    imports: [ RouterModule.forChild(eventsRoutes ) ],
    exports: [ RouterModule ]
  })
export class EventsRoutingModule { }
