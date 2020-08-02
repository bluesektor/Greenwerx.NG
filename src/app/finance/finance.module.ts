// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageBoxesModule } from '../common/messageboxes.module';
import { CheckboxModule } from 'primeng';

import {
     TableModule, SharedModule, DialogModule, AccordionModule, DropdownModule,
    InputSwitchModule, FileUploadModule, AutoCompleteModule, CalendarModule
} from 'primeng';
import { PreventUnsavedChangesGuard } from '../prevent-unsaved-changes-guard.service';

import { CommonModuleEx } from '../common/common.moduleEx';
import { CurrencyComponent } from './currency.component';
import { PriceRulesComponent } from './pricerules.component';
import { FinanceAccountsComponent } from './financeaccounts.component';
import { FinanceAccountTransactionsComponent } from './financeaccounttransactions.component';
import { PayPalComponent } from './gateways/paypal.component';
import { SessionService } from '../services/user/session.service';

import { FinanceService } from '../services/finance.service';
import { FinanceRoutingModule } from './finance.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CheckboxModule,
        TableModule,
        AccordionModule,
        SharedModule,
        DialogModule,
        RouterModule,
        DropdownModule,
        InputSwitchModule,
        FileUploadModule,
        AutoCompleteModule,
        CalendarModule,
        FinanceRoutingModule,
        MessageBoxesModule
    ]
    ,
    declarations: [
        CurrencyComponent,
        PriceRulesComponent,
        FinanceAccountsComponent,
        FinanceAccountTransactionsComponent,
        PayPalComponent
    ],
    exports: [
        CurrencyComponent,
        PriceRulesComponent,
        FinanceAccountsComponent,
        FinanceAccountTransactionsComponent,
        PayPalComponent
    ],
})
export class FinanceModule {

}
