
// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.
import { Component, OnInit, ViewChild, Input, OnDestroy, ElementRef} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { AppService } from '../services/app.service';

import { TableModule, PanelModule } from 'primeng/primeng';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { SessionService } from '../services/user/session.service';
import { ProductService } from '../services/product.service';
import { InventoryService } from '../services/inventory.service';
import { StoreService } from '../services/store.service';
import { GeoService } from '../services/geo.service';
import { AccountService } from '../services/user/account.service';
import { Account } from '../models/account';
import { InventoryItem } from '../models/inventory';
import { Setting } from '../models/setting';
import { Guid } from '../common/guid';
import { BasicValidators } from '../common/basicValidators';
import { ShoppingCart } from '../models/shoppingcart';
import { ObjectFunctions } from '../common/object.functions';
import { Subscription} from 'rxjs';
import {MessagePump}  from '../common/message.pump';
import {GetImageThumbPipe} from '../common/pipes/image.pipe';
import { DialogService } from '../common/dialogs/dialog.service'; 
import { MAT_DIALOG_DATA ,MatDialogRef  } from '@angular/material/dialog';

@Component({
    templateUrl: './store.component.html',

})
export class StoreComponent implements OnInit, OnDestroy {

    @Input() defaultOnly = 'true';
    subscriptions:Subscription[] = [];
    currencySymbol = '$';
    showInventoryPanel = true;
    loadingData = false;
    inventoryItems: any[] = [];
    totalInventoryItems = 0;
    totalStores = 0;
    locationFilters: Filter[] = [];
    selectedProduct: InventoryItem;
    selectedProductDetails: any[] = [];
    displayDialog = false;
    stores: Location[] = [];
    @ViewChild(MessageBoxesComponent) msgBox: MessageBoxesComponent;
    
    shoppingCart: ShoppingCart = new ShoppingCart();

    constructor(
        private _dialogService: DialogService,
        private _geoService: GeoService,
        private _inventoryService: InventoryService,
        private _sessionService: SessionService,
        private _accountService: AccountService,
        private _productService: ProductService,
        private _storeService: StoreService,
        private _appService: AppService,
        private _messagePump:MessagePump,
        private _router: Router,
        private _route: ActivatedRoute) {
/*
            this.subscriptions.push( this._messagePump.subscribe('settings:loaded', (data: any) => {
                this.msgBox.ShowMessage('success', 'SETTINGS LOADED FIRED IN STORE COMPENENT');
                //Wait until settings are loaded in app.component before trying to load data for stores.
                const filter2 = new Filter();
                filter2.PageResults = true;
                filter2.StartIndex = 1;
                filter2.PageSize = 50;

                if( ObjectFunctions.isNullOrWhitespace(this._sessionService.CurrentSession.DefaultLocationUUID) === false 
                ){  // if we have a location uuid then is should be the store, so load the inventory
                    this.loadInventory(this._sessionService.CurrentSession.DefaultLocationUUID, filter2);
                    this.createShoppingCart();
                }
                else if( ObjectFunctions.isNullOrWhitespace(this._sessionService.CurrentSession.DefaultLocationUUID) === true &&
                    ObjectFunctions.isNullOrWhitespace(this._sessionService.CurrentSession.AccountUUID) === false
                ){  
                    filter2.PageResults = false;
                    this.loadStoresForAccount(this._sessionService.CurrentSession.AccountUUID, filter2);
                } else{
                    //TODO  //if both are blank then load by system default account 
                    filter2.PageResults = false;
                    this.loadStores('', filter2)
                }
            }));
            */
    }

    // ===--- General Events ---===

    ngOnInit() {
        const filter = new Filter();
        filter.PageResults = true;
        filter.StartIndex = 0;
        filter.PageSize = 1;
        const screen = new Screen();
        screen.Command = 'SearchBy';
        screen.Field = 'Name';
        screen.Value = 'default.currency.symbol';
        filter.Screens.push(screen);

        this._appService.getPublicSettings(filter).subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            if (response.Result.length > 0) {
                this.currencySymbol = response.Result[0].Value;
            }
        });

        console.log('store.component.ts ngOnInit DefaultLocationUUID:',this._sessionService.CurrentSession.DefaultLocationUUID);
        //Wait until settings are loaded in app.component before trying to load data for stores.
        const filter2 = new Filter();
        filter2.PageResults = true;
        filter2.StartIndex = 1;
        filter2.PageSize = 50;

        let validLocation = !ObjectFunctions.isNullOrWhitespace(this._sessionService.CurrentSession.DefaultLocationUUID);
        let validAccount = !ObjectFunctions.isNullOrWhitespace(this._sessionService.CurrentSession.AccountUUID);

        if(validLocation === true  ){  // if we have a location uuid then is should be the store, so load the inventory
            this.loadInventory(this._sessionService.CurrentSession.DefaultLocationUUID, filter2);
            this.showInventoryPanel = true;
            this.createShoppingCart();
        }
        else if( validAccount === true){  
            filter2.PageResults = false;
            this.showInventoryPanel = false;
            this.loadStoresForAccount(this._sessionService.CurrentSession.AccountUUID, filter2);
        } else{
            //TODO  //if both are blank then load by system default account 
            filter2.PageResults = false;
            this.showInventoryPanel = false;
            this.loadStores('', filter2)
        }
        /*
    if no default location UUID
	    get all from Locations where locationType == 'online store'
	    is active and not private
	    get all, on client look for default flag,
    if there's a default then use that.
	
    else there is a location id show the inventory
 
        only show stores and products. leave the accounts list to another section like look up  or something

        use assets\data\environment.xx.json appid to get the settings,
        the settings should have an entry for the account id. 
        use this account id to get the stores for this appid
        gwxlcl 
get from settings where [UUParentID]= gwxlcl && [UUParentIDType] = appid
        greenwerx.local accountUUID: ec8664adfdf345c29b555c3c47fd0498

        */
    
    }

    ngOnDestroy(){
      
        this.subscriptions.forEach(s => s.unsubscribe());
      }

    loadStores(locationUUID:string, filter:Filter) {
        this.loadingData = true;
        this._storeService.getStores(locationUUID, filter).subscribe(response => {
            this.loadingData = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.stores = response.Result;
            this.totalStores = response.TotalRecordCount;
            this.showInventoryPanel = false;
                 //if logged in get stores in account,
            //if not logged in get system default account
            //    get all from Locations where locationType == 'online store'
            //  is active and not private
            //  get all, on client look for default flag,
            //*****************************************************if there's a default then use that.
        }, err => {
            this.loadingData = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.logOut();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }

    loadStoresForAccount(accountUUID:string , filter: Filter){
        this.loadingData = true;
        this._storeService.getStoresForAccount(accountUUID, filter).subscribe(response => {
            this.loadingData = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.stores = response.Result;
            this.totalStores = response.TotalRecordCount;
            this.showInventoryPanel = false;
        }, err => {
            this.loadingData = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.logOut();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
        
    }

    loadInventory(locationUUID: string, filter: Filter) {

        this.loadingData = true;
        this._storeService.getStoreInventory(filter).subscribe(response => {
            this.loadingData = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.inventoryItems = response.Result;
            this.totalInventoryItems = response.TotalRecordCount;
            this.showInventoryPanel = true;
        }, err => {
            this.loadingData = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.logOut();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }
        });
    }

    createShoppingCart(): string {
        let cartUUID = this._sessionService.getCart();

        if (!cartUUID || cartUUID === '') {// if no cart create one.
            this._storeService.getNewShoppingCart().subscribe(response => {

                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                this.shoppingCart = new ShoppingCart();
                this.shoppingCart = response.Result;
                cartUUID = this.shoppingCart.UUID;
                this._sessionService.saveCart(cartUUID); // save id  locally for guest purposes
            });
        } else {// get existing cart
            this._storeService.getShoppingCart(cartUUID).subscribe(response => {
                if (response.Code !== 200) {
                    // cart wasn't found in the database. so clear the local cart and create a new one.
                    this._sessionService.clearCart();
                    this.createShoppingCart();
                    return false;
                }
                this.shoppingCart = new ShoppingCart();
                this.shoppingCart = response.Result;
                cartUUID = this.shoppingCart.UUID;
                this._sessionService.saveCart(cartUUID); // save id  locally for guest purposes
            });
        }
        return cartUUID;
    }

    showProductDetail(product) {

        this.displayDialog = true;
        this.selectedProduct = product;

        // call to load keyvalue list of product details/attributes.

        this._productService.getProductDetails(product.ReferenceUUID, product.ReferenceType).subscribe(
            response => {
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                this.selectedProductDetails = response.Result;
            });
    }

    onDialogHide() {
        this.displayDialog = false;
    }

    addToCart(event, productUUID) {
        let cartUUID = this._sessionService.getCart();

        if (!cartUUID || cartUUID === '') {// if no cart create one.
            cartUUID = this.createShoppingCart();
            this.shoppingCart = new ShoppingCart();
        }

        this._storeService.getShoppingCart(cartUUID).subscribe(response => {

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.shoppingCart = response.Result;
        });

        const idx = this.getInventoryItem(productUUID);
        if (idx < 0) {
            return false;
        }

         this._storeService.addToCart(this.shoppingCart.UUID, this.inventoryItems[idx], 1.0)
            .subscribe(response => {
                this.loadingData = false;
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                this.shoppingCart = response.Result;
        });
    }

    getInventoryItem(productUUID: string): number {
        for (let i = 0; i < this.inventoryItems.length; i++) {

            if (this.inventoryItems[i].UUID === productUUID) {
                return i;
            }
        }
        return -1;
    }

    isNullOrEmpty(link): boolean {
        return BasicValidators.isNullOrEmpty(link);
    }

    showStoreDetails(store:any) {
        console.log('store.component.ts showStoreDetails store:', store);
        this.displayDialog = true;
        this._dialogService.open( 'store.detail', store);
    }
   
	closeStoreDetails() {
        this._dialogService.close();
	}
}
