// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckboxModule, FileUploadModule, SelectItem, DropdownModule, InputSwitchModule } from 'primeng';

import { SessionService } from '../services/user/session.service';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { TableModule, SharedModule, DialogModule, AccordionModule } from 'primeng';
import {ServiceResult} from '../models/serviceresult';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { Currency } from '../models/currency';
import { FinanceService } from '../services/finance.service';
import {ImageService} from '../services/image.service';
import { AppService } from '../services/app.service';
import { Node } from '../models/node';
import {Api} from '../services/api';
@Component({
    templateUrl: './currency.component.html',
 

})
export class CurrencyComponent implements OnInit {

    displayDialog = false;
    newCurrency = false;
    processingRequest = false;
    defaultData: any[];
    listData: Currency[];
    currency: Currency = new Currency();
    listCount = 0;

    baseUrl: string;
    fileUploadUrl = '';
    loadDefaultData = true; // note:set false to show currencies created by this account

    currencySymbolOptions: SelectItem[] = [];
    assetClassOptions: SelectItem[] = [];
    uploadedFiles: any[] = [];


    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _appService: AppService,
        private _sessionService: SessionService,
        private _currencyService: FinanceService
        ,private msgBox : MessageBoxesComponent,
        private _imageService:ImageService) {
    }

    ngOnInit() {

        this.baseUrl = Api.url;
        this.fileUploadUrl =  Api.url + 'api/File/Upload/';
        this.currency.Image = '/Content/Default/Images/add.png';
        this.loadCurrencySymbols();
        this.loadAssetClasses();
    }

    loadDefaultsClick(event) {
        this.loadCurrencies(1, 25);
    }

    loadCurrencies(page?: number, pageSize?: number) {
        this.processingRequest = true;

        const filter = new Filter();
     
/*
        if (this.loadDefaultData === false) {
            const screen = new Screen();
            screen.Command = 'SEARCH!BY';
            screen.Field = 'ACCOUNTUUID';
            screen.Value = 'system.default.account';

            filter.Screens.push(screen);
            let screenDistinct = new Screen();
            screenDistinct.Field = 'NAME';
            screenDistinct.Command = 'DISTINCTBY';
            screenDistinct.Value = '';
            filter.Screens.push(screen);
        } else {
            const screen = new Screen();
            screen.Command = 'SEARCHBY';
            screen.Field = 'ACCOUNTUUID';
            screen.Value = 'system.default.account';
            filter.Screens.push(screen);
        }
        */
        filter.PageResults = true;
        filter.StartIndex = page;
        filter.PageSize = pageSize;
        
        const res = this._currencyService.getCurrencies(filter);
        res.subscribe(response => {
            this.displayDialog = false;
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.listData = response.Result;
            this.listCount = response.TotalRecordCount;

        }, err => {
            this.processingRequest = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.clearSession();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }
        });

    }

    lazyLoadCurrencyList(event) {
        this.loadCurrencies(event.first, event.rows);
    }

    showDialogToAdd() {
        this.newCurrency = true;
        //this.currency = null;
         this.currency = new Currency();
       // this.currency.Image = '/Content/Default/Images/add.png';
        this.displayDialog = true;
    }

    onRowSelect(event) {
        this.newCurrency = false;
        this.currency = this.cloneItem(event);
        this.displayDialog = true;
    }

    cloneItem(c: Currency): Currency {
        const item = new Currency();
        for (const prop in c) {
            item[prop] = c[prop];
        }
        return item;
    }

    cancel() {
        this.displayDialog = false;
        // todo delete image?
    }

    delete() {
        this.msgBox.closeMessageBox();
        if (confirm('Are you sure you want to delete ' + this.currency.Name + '?')) {
            this.processingRequest = true;
            const res = this._currencyService.deleteCurrency(this.currency.UUID);
            res.subscribe(response => {
                this.displayDialog = false;
                this.processingRequest = false;
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                const index = this.getItemIndex(this.currency.UUID); 
                // Here, with the splice method, we remove 1 object
                // at the given index.
                this.listData.splice(index, 1);
                this.loadCurrencies(1, 25); // not updating the list so reload for now.
                  //todo implement   this._cdr.detectChanges(); and remove the load function
                this.msgBox.ShowMessage('info', 'Currency deleted.');
            }, err => {
                this.processingRequest = false;
                this.msgBox.ShowResponseMessage(err.status);

                if (err.status === 401) {
                    this._sessionService.clearSession();
                    setTimeout(() => {
                        this._router.navigate(['/membership/login'], { relativeTo: this._route });
                    }, 3000);
                }
            });
        }
    }

    save() {
        this.msgBox.closeMessageBox();
        this.processingRequest = true;
        let res = null;

        if (this.newCurrency) {// add
            res = this._currencyService.addCurrency(this.currency);
        } else { // update
            res = this._currencyService.updateCurrency(this.currency);
        }

        res.subscribe(response => {

            this.processingRequest = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            if (this.newCurrency) {// add
                this.msgBox.ShowMessage('info', 'Currency added.');
                this.listData.push(this.currency);
            } else { // update
                this.msgBox.ShowMessage('info', 'Currency updated.');
                this.listData[this.getItemIndex(this.currency.UUID)] = this.currency;
            }
            this.currency = null;
            this.newCurrency = false;
            this.loadCurrencies(1, 25); // not updating the list so reload for now.
              //todo implement   this._cdr.detectChanges(); and remove the load function
        }, err => {
            this.currency = null;
            this.displayDialog = false;
            this.processingRequest = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.clearSession();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }
        });

    }

    onBeforeSendFile(event) {

        event.xhr.setRequestHeader('Authorization', 'Bearer ' + Api.authToken);
    }

    onImageUpload(files: FileList, currency) {
        const formData = new FormData();
       
        let currFile = files.item(0);
        console.log(currFile);
        this._imageService.uploadImage(currFile, currency.UUID ,'Currency')
            .subscribe(data =>{
                const response = data as ServiceResult;

                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }

                console.log('image upload response:',  response.Result);
                //this.images.push(response.Result);
               // this.selectedProfile.Image =
               currency.Image = response.Result.ImageThumb;

        });
    }

    onTabShow(e) {
        console.log('tab index:', e.index);
    }

    loadCurrencySymbols() {

        this._currencyService.getCurrencySymbols(null).subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            for (let i = 0; i < response.Result.length; i++) {
                this.currencySymbolOptions.push({ label: response.Result[i], value: response.Result[i] });
            }
        });
    }

    onCboChangeSymbol(event) {
        this.currency.Symbol = event.value;
    }

    onCboLeaveSymbol(event) {

        if (event.currentTarget.value.length > 0) {
            this.currency.Symbol = event.currentTarget.value;
        }
    }

    loadAssetClasses() {
        // Load the symbols for the dropdown also
        // var filter = new Filter();
        // filter.Field = 'NAME';
        // filter.Command = "DISTINCTBY";
        // filter.Value = '';
        // this.defaultFilters.push(filter);

        this._currencyService.getAssetClasses(null).subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            for (let i = 0; i < response.Result.length; i++) {
                this.assetClassOptions.push({ label: response.Result[i], value: response.Result[i] });
            }
        });
    }

    onCboChangeAssetClass(event) {
        this.currency.AssetClass = event.value;
    }

    onCboLeaveAssetClass(event) {

        if (event.currentTarget.value.length > 0) {
            this.currency.AssetClass = event.currentTarget.value;
        }
    }

    getItemIndex(uuid): number {
        for (let i = 0; i < this.listData.length; i++) {

            if (this.listData[i].UUID === uuid) {
                return i;
            }
        }
        return -1;
    }

    findItemIndex(itemName): number {
        for (let i = 0; i < this.listData.length; i++) {

            if (this.listData[i].Name === itemName) {
                return i;
            }
        }
        return -1;
    }
}
