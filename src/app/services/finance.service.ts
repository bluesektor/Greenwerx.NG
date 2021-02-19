// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { Api } from './api';
import { SessionService } from '../services/user/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { UnitOfMeasure } from '../models/unitofmeasure';
import { Currency } from '../models/currency';
import { FinanceAccount } from '../models/financeaccount';
import { FinanceAccountTransaction } from '../models/financeaccountransaction';
import { PriceRule } from '../models/pricerule';
import { BasicValidators } from '../common/basicValidators';

@Injectable()
export class FinanceService   {

    constructor(private api: Api) {
    }
    getPriceRule(priceRuleCode: string) {
        return this.api.invokeRequest('POST', 'api/Finance/PriceRules/' + priceRuleCode);
    }
    getPriceRules(filters?: Filter[]) {
        return this.api.invokeRequest('POST', 'api/Finance/PriceRules/' ,filters);
    }


    deletePriceRule(priceRuleUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/Finance/PriceRules/Delete/' + priceRuleUUID);
    }

    addPriceRule(priceRule: PriceRule) {
        return this.api.invokeRequest('POST', 'api/Finance/PriceRules/Insert', priceRule);
    }

    updatePriceRule(priceRule: PriceRule) {
        return this.api.invokeRequest('PATCH', 'api/Finance/PriceRules/Update', priceRule);
    }

    calcPriceRule(amount: number, operator: string, operand: number): number {

        let res = 0;

        if (BasicValidators.isNullOrEmpty(operator)) { return res; }

        if (!operand) { return res; }

        switch (operator) {
            case '*':
                res = amount * operand;
                break;
            case '%':
                if (operand === 0) {
                    res = 0;
                } else {
                    const pct = operand / 100;
                    const pctChange = amount * pct;
                    res = amount + pctChange;
                }
                break;
            case '=':
                res = amount;
                break;
            case '+':
                res = Number(amount) + Number(operand);
                break;
            case '-':
                res = amount - operand;
                break;
            case '/':
                if (amount === 0 || operand === 0) {
                    console.log('Cannot divide by zero!');
                    res = 0;
                } else {
                    res = amount / operand;
                }
                break;
            default:
                console.log('FORGOT THE OPERATOR!');
                break;
        }
        return res;
    }

    getFinanceAccountTransactions(filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Finance/Accounts/Transactions/' ,filter );
    }

    deleteFinanceAccountTransaction(financeAccountUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/Finance/Accounts/Transactions/Delete/' + financeAccountUUID);
    }

    addFinanceAccountTransaction(financeAccount: FinanceAccountTransaction) {
        return this.api.invokeRequest('POST', 'api/Finance/Accounts/Transactions/Add', financeAccount);
    }

    updateFinanceAccountTransaction(currency: FinanceAccountTransaction) {
        return this.api.invokeRequest('PATCH', 'api/Finance/Accounts/Transactions/Update', currency);
    }

    getFinanceAccounts(filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Finance/Accounts/' ,filter);
    }

    getPaymenOptions() {
        return this.api.invokeRequest('POST', 'api/Finance/PaymentOptions');
    }

    deleteFinanceAccount(financeAccountUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/Finance/Accounts/Delete/' + financeAccountUUID);
    }

    addFinanceAccount(financeAccount: FinanceAccount) {
        return this.api.invokeRequest('POST', 'api/Finance/Accounts/Add', financeAccount);
    }

    updateFinanceAccount(account: FinanceAccount) {
        return this.api.invokeRequest('PATCH', 'api/Finance/Accounts/Update', account);
    }

    getCurrencies(filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Finance/Currency' ,filter);
    }

    getCurrency(name: string) {
        return this.api.invokeRequest('POST', 'api/Finance/Currency/' + name);
    }

    getCurrencySymbols(filter?: Filter ) {
        return this.api.invokeRequest('POST', 'api/Finance/Currency/Symbols');
    }
    getAssetClasses(filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Finance/AssetClasses');
    }


    addCurrency(currency: Currency) {
        return this.api.invokeRequest('POST', 'api/Finance/Currency/Add', currency);
    }

    updateCurrency(currency: Currency) {
        return this.api.invokeRequest('PATCH', 'api/Finance/Currency/Update', currency);
    }

    deleteCurrency(currencyUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/Finance/Currency/Delete/' + currencyUUID );
    }
}
