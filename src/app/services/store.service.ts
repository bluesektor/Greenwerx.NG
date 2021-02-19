// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Api } from './api';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { UnitOfMeasure } from '../models/unitofmeasure';
import { ShoppingCart } from '../models/shoppingcart';
import { InventoryItem } from '../models/inventory';
import { ServiceResult } from '../models/serviceresult';
import { PriceRule } from '../models/pricerule';

@Injectable()
export class StoreService  {

    constructor( private api: Api ) {
        
    }

    getShoppingCart(cartUUID: string) {
        
        return this.api.invokeRequest('GET', 'api/Store/Cart/' + cartUUID);
    }

    getStores(locaitionUUID:string , filter:Filter){
        return this.api.invokeRequest('POST', 'api/Stores', filter);
    }
    getStoresForAccount(accountUUID:string , filter:Filter){
        return this.api.invokeRequest('POST', 'api/Stores/Accounts/'+  accountUUID, filter);
    }

    

    getNewShoppingCart() {
        return this.api.invokeRequest('GET', 'api/Store/NewCart');
    }

    checkOut(cart: ShoppingCart) {
        return this.api.invokeRequest('POST', 'api/Store/CheckOut', cart);
    }


    calcCartTotals(cart: ShoppingCart) {
        cart.subTotal = 0;
        cart.total = 0;

        for (let i = 0; i < cart.CartItems.length; i++) {
            cart.subTotal += cart.CartItems[i].Price * cart.CartItems[i].Quantity;
            cart.total = cart.subTotal;
        }
        if (!cart.coupon  ) {
            cart.coupon = new PriceRule();
            cart.coupon.Result = 0;
        } else {
            cart.discount = this.applyCalculation(cart.subTotal, cart.coupon.Operator, cart.coupon.Operand);
            cart.total = cart.subTotal - cart.discount;
        }
        return cart;
    }

    applyCalculation( amount: number, calcOperator: string, operand: number): number        {
        let res = -1;
        if (!calcOperator || calcOperator === '') {
            return 0;
        }

        switch (calcOperator) {
        case '*':
            res = amount * operand;
            break;
        case '%':
            if (operand === 0) {
                res = 0;
            } else {
                operand = operand / 100;
                res = amount * operand;
            }
            break;
        case '=':
            res = operand;
            break;
        case '+':
            res = amount + operand;
            break;
        case '-':
            res = amount - operand;
            break;
        case '/':
            if (amount === 0 || operand === 0) {
                res = 0;
            } else {
                res = amount / operand;
            }
            break;
        }
        return res;
    }

    // This is different from getInvetory in that it returns published items.
    //
    getStoreInventory(filter?: Filter) {
        return this.api.invokeRequest('GET', 'api/Store' , filter);
    }

    getItemsInCart(cartUUID: string ) {
        return this.api.invokeRequest('GET', 'api/Store/Cart/' + cartUUID + '/Items');
    }

    addToCart(cartUUID: string , item: InventoryItem, quantity: number) {
        return this.api.invokeRequest('POST', 'api/Store/Cart/' + cartUUID + '/Add/' + item.UUID + '/quantity/' + quantity);
    }

    deleteCartItem(cartUUID: string, cartItemUUID: string, itemUUID: string ) {

        return this.api.invokeRequest('DELETE', 'api/Store/Cart/' + cartUUID + '/Item/' + cartItemUUID + '/Delete' );
    }

}
