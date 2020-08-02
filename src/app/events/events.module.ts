// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng';
import { TableModule, SharedModule, DialogModule, StepsModule, //TableModule
         AutoCompleteModule, AccordionModule} from 'primeng';
import { ConfirmDialogModule, ConfirmationService, PanelModule,
         InputSwitchModule, FileUploadModule, DropdownModule } from 'primeng';
import { PreventUnsavedChangesGuard } from '../prevent-unsaved-changes-guard.service';
import { SessionService } from '../services/user/session.service';

import { CategoriesModule } from '../common/categories.module';
import { InventoryModule } from '../inventory/inventory.module';  
import { ProductService } from '../services/product.service';
//import { ProductsComponent } from './products.component';
import { MessageBoxesModule } from '../common/messageboxes.module';
import { EventsRoutingModule } from './events.routing';
   
//import { EventInventoryComponent } from './eventinventory.component';
import { EventLocationsComponent } from './eventlocations.component';
import { EventsComponent } from './events.component';

 
@NgModule({
    imports: [
        CommonModule,
        CategoriesModule,
        FormsModule,
        ReactiveFormsModule,
        CheckboxModule,
        TableModule,
        SharedModule,
        DialogModule,
        RouterModule,
        InventoryModule,
        TableModule,
        PanelModule,
        StepsModule,
        InputSwitchModule,
        FileUploadModule,
        AutoCompleteModule,
        AccordionModule,
        DropdownModule,
        EventsRoutingModule,
        MessageBoxesModule
    ]
    ,
    declarations: [
       // ProductsComponent,
       
        //EventInventoryComponent,
        EventsComponent,
        EventLocationsComponent,
  
        
    ],
    exports: [
       //EventInventoryComponent,
        EventsComponent,
        EventLocationsComponent,
  
        
    ],
})
export class EventsModule {

}
