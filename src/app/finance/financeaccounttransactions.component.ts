// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckboxModule, FileUploadModule } from 'primeng';

import { SessionService } from '../services/user/session.service';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { TableModule, SharedModule, DialogModule, AccordionModule } from 'primeng';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { FinanceAccountTransaction } from '../models/financeaccountransaction';
import { FinanceService } from '../services/finance.service';
import { AppService } from '../services/app.service';
import {Api} from '../services/api';

@Component({
    templateUrl: './financeaccounttransactions.component.html',

})
export class FinanceAccountTransactionsComponent implements OnInit {

    displayDialog = false;
    newFinanceAccountTransaction = false;
    processingRequest = false;
    listData: FinanceAccountTransaction[];
    transaction: FinanceAccountTransaction = new FinanceAccountTransaction();
    listCount = 0;
    baseUrl; string;
    fileUploadUrl = '';
    loadDefaultData = false;
    defaultFilter: Filter = new Filter();
    uploadedFiles: any[] = [];

  
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _appService: AppService,
        private _sessionService: SessionService,
        private _financeaccounttransactionsService: FinanceService
        ,private msgBox : MessageBoxesComponent) {
   
    }

    ngOnInit() {
        this.baseUrl = Api.url;
        this.fileUploadUrl = Api.url + 'api/File/Upload/';
        this.transaction.Image = '/Content/Default/Images/add.png';
    }

    loadFinanceAccountTransactions(page?: number, pageSize?: number) {
        this.processingRequest = true;
        this.defaultFilter.Screens = [];
        this.defaultFilter.PageResults = true;
        this.defaultFilter.StartIndex = page;
        this.defaultFilter.PageSize = pageSize;

            const filter = new Filter();
            filter.PageResults = true;
            filter.StartIndex = page;
            filter.PageSize = pageSize;
            const screen = new Screen();
            screen.Field = 'TransactionDate';
            screen.Command = 'ORDERBY';
            screen.Value = '';
            filter.Screens.push(screen);
            const res = this._financeaccounttransactionsService.getFinanceAccountTransactions(filter);
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

    lazyLoadFinanceAccountTransactionList(event) {
        this.loadFinanceAccountTransactions(event.first, event.rows);
    }

    loadSystemData() {
        // type

    }


    showDialogToAdd() {
        this.newFinanceAccountTransaction = true;
        this.transaction = null;
        this.transaction = new FinanceAccountTransaction();
        this.displayDialog = true;
    }

    onRowSelect(event) {
        this.newFinanceAccountTransaction = false;
        this.transaction = this.cloneItem(event);
        this.displayDialog = true;
    }

    cloneItem(c: FinanceAccountTransaction): FinanceAccountTransaction {
        const item = new FinanceAccountTransaction();
        for (const prop in c) {
            item[prop] = c[prop];
        }
        return item;
    }

    cancel() {
        this.displayDialog = false;
    }

    delete() {
        this.msgBox.closeMessageBox();
        if (confirm('Are you sure you want to delete ' + this.transaction.Name + '?')) {
            this.processingRequest = true;
            const res = this._financeaccounttransactionsService.deleteFinanceAccountTransaction(this.transaction.UUID);
            res.subscribe(response => {
                this.displayDialog = false;
                this.processingRequest = false;
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                const index = this.findSelectedItemIndex(this.transaction.UUID); //  this.locations.indexOf(this.location)
                // Here, with the splice method, we remove 1 financeaccounttransactionsect
                // at the given index.
                this.listData.splice(index, 1);
                this.msgBox.ShowMessage('info', 'FinanceAccountTransaction deleted.');
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

        if (this.newFinanceAccountTransaction) {// add
            res = this._financeaccounttransactionsService.addFinanceAccountTransaction(this.transaction);
        } else { // update
            res = this._financeaccounttransactionsService.updateFinanceAccountTransaction(this.transaction);
        }

        res.subscribe(response => {

            this.processingRequest = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            if (this.newFinanceAccountTransaction) {// add
                this.msgBox.ShowMessage('info', 'FinanceAccountTransaction added');
                this.listData.push(this.transaction);
            } else { // update
                this.msgBox.ShowMessage('info', 'FinanceAccountTransaction updated');
                this.listData[this.findSelectedItemIndex(this.transaction.UUID)] = this.transaction;
            }
            this.transaction = null;
            this.newFinanceAccountTransaction = false;

        }, err => {
            this.transaction = null;
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

    onImageUpload(event, itemUUID) {
        let currFile;
        for (const file of event.files) {
            this.uploadedFiles.push(file);
            currFile = file;
        }

        if (this.newFinanceAccountTransaction === true) {
            const idx = this.findSelectedItemIndex(itemUUID);
            this.listData[idx].Image = '/Content/Uploads/' + this._sessionService.CurrentSession.AccountUUID + '/' + currFile.name;
        } else {
            this.transaction.Image = '/Content/Uploads/' + this._sessionService.CurrentSession.AccountUUID + '/' + currFile.name;
        }
    }

    onTabShow(e) {
        console.log('tab index:', e.index);
    }

    findSelectedItemIndex(uuid): number {
        for (let i = 0; i < this.listData.length; i++) {

            if (this.listData[i].UUID === uuid) {
                return i;
            }
        }
        return -1;
    }
}
