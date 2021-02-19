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
import { ProductsComponent } from './products.component';
import { MessageBoxesModule } from '../common/messageboxes.module';
import { StoreRoutingModule } from './store.routing';
   
import { StoreInventoryComponent } from '../store/storeinventory.component';
import { StoreComponent } from '../store/store.component';
import { DepartmentsComponent} from './departments.component';
import { StoreCategoriesComponent } from './storecategories.component';
import { CartDetailComponent } from './cartdetail.component';
import { CheckOutComponent } from './checkout.component';
import { OrdersComponent } from './orders.component';


import { PayOptionsComponent } from './payoptions.component';
import { FinanceModule } from '../finance/finance.module';
import { AddressComponent } from './address.component';

import {PipesModule} from '../common/pipes/pipes.module';
import {VendorsExComponent} from './vendors.component';
import { DialogsModule } from '../common/dialogs/dialogs.module';
 
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
      FinanceModule,
        AutoCompleteModule,
        AccordionModule,
        DropdownModule,
       StoreRoutingModule,
        MessageBoxesModule,
        PipesModule,
        DialogsModule

    ]
    ,
    declarations: [
        ProductsComponent,
        DepartmentsComponent,
      
        StoreInventoryComponent,
        StoreComponent,
        StoreCategoriesComponent,
        CartDetailComponent,
        CheckOutComponent,
        PayOptionsComponent,
        AddressComponent,
        OrdersComponent,
        VendorsExComponent
        
    ],
    exports: [
        ProductsComponent,
             DepartmentsComponent,
       
        StoreInventoryComponent,
        StoreComponent,
        StoreCategoriesComponent,
        CartDetailComponent,
        CheckOutComponent,
        PayOptionsComponent,
        AddressComponent,
        OrdersComponent,
        VendorsExComponent
        
    ],
})
export class StoreModule {

}
