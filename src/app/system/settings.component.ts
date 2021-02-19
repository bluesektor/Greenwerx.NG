// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionService } from '../services/user/session.service';
import { Setting } from '../models/setting';
import { SettingsService } from '../services/settings/settings.service';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { TableModule, SharedModule, DialogModule } from 'primeng';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',

})
export class SettingsComponent implements OnInit {

    displayDialog = false;
    newSetting = false;
    processingRequest = false;
    settings: Setting[];
    setting: Setting = new Setting();
    settingFilters: Filter[] = [];
    totalSettings = 0;
    @Input() settingType: string;
    @Input() settingClass: string;


    types: any[] = [
        { 'name': 'Select one...', 'value': '' },
        { 'name': 'String', 'value': 'STRING' },
        { 'name': 'Numeric', 'value': 'INT' },
        { 'name': 'Decimal', 'value': 'DECIMAL' },
        { 'name': 'Date Time', 'value': 'DATETIME' },
        { 'name': 'True/False', 'value': 'BOOL' },
        { 'name': 'Encrypted String', 'value': 'STRING.ENCRYPTED' }
    ];

   
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _settingService: SettingsService,
        private _sessionService: SessionService
        ,private msgBox : MessageBoxesComponent,
        private _cdr:ChangeDetectorRef) {

      

    }

    ngOnInit() {
        this.loadSettings(1, 25);
    }

    cboTypeChange(newType) {
        this.setting.Type = newType;
    }

    loadSettings(  page?: number, pageSize?: number) {
        this.processingRequest = true;
        const filter = new Filter();
        filter.PageResults = true;
        filter.StartIndex = page;
        filter.PageSize = pageSize;
/*
        if (this.settingType !== '') {
            const screen = new Screen();
            screen.Command = 'SEARCHBY';
            screen.Field = 'UUIDType';
            screen.Value = this.settingType;
            filter.Screens.push(screen);
        }

        if (this.settingClass !== '') {
            const classScreen = new Screen();
            classScreen.Command = 'SEARCHBY';
            classScreen.Field = 'SettingClass';
            classScreen.Value = this.settingClass;
            filter.Screens.push(classScreen);
        }
        */

        const res = this._settingService.getSettings(filter);

        res.subscribe(response => {
            this.displayDialog = false;
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.settings = response.Result;
            for(var i = 0; i < this.settings.length; i++){
                this.settings[i].Type = this.settings[i].Type.toUpperCase();
            }
            this.totalSettings = response.TotalRecordCount;
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

    lazyLoadSettingsList(event) {

        this.loadSettings( event.first, event.rows);
    }

    keyPressRoleWeight(event: any) {
        const keychar = String.fromCharCode(event.charCode);

        //  numbers
         if ((('0123456789').indexOf(keychar) > -1)) {
             return;
        }
        event.preventDefault();
    }

    delete() {
        this.msgBox.closeMessageBox();

        if (confirm('Are you sure you want to delete ' + this.setting.Name + '?')) {

            this.processingRequest = true;

            const res = this._settingService.deleteSetting(this.setting.UUID);

            res.subscribe(response => {
                this.displayDialog = false;
                this.processingRequest = false;

                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }

                const index = this.findSelectedSettingIndex(this.setting); //  this.settings.indexOf(this.setting)
                // Here, with the splice method, we remove 1 object
                // at the given index.
                this.settings.splice(index, 1);
                this.msgBox.ShowMessage('info', 'Setting deleted.');
               this._cdr.detectChanges();
            }, err => {
                this.processingRequest = false;
                this.msgBox.ShowResponseMessage(err.status);
                if (err.status === 429) {
                    this._sessionService.clearSession();
                    this.msgBox.ShowMessage('error', 'Too many requests being sent.');
                    return;
                }
                if (err.status === 401) {
                    this._sessionService.clearSession();
                    setTimeout(() => {
                        this._router.navigate(['/membership/login'], { relativeTo: this._route });
                    }, 3000);
                }
            });
        }
    }

    showDialogToAdd() {
        this.newSetting = true;
        this.setting = new Setting();
        this.displayDialog = true;
    }

    save() {
        this.msgBox.closeMessageBox();

        if ( this.setting.AccountUUID ===  '' || this.setting.AccountUUID === null ) {
            this.setting.AccountUUID = this._sessionService.CurrentSession.AccountUUID;
        }

      //  this.settings.push(this.setting);
        this.processingRequest = true;

        let res = null;

        if (this.newSetting) {// add
            res = this._settingService.addSetting(this.setting);
        } else { // update
            res = this._settingService.updateSetting(this.setting);
        }

        res.subscribe(response => {

            this.processingRequest = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            if (this.newSetting) {// add
                this.msgBox.ShowMessage('info', 'Setting added.');
                this.setting = response.Result;
                this.settings.push(this.setting);
            } else { // update
                this.msgBox.ShowMessage('info', 'Setting updated.');
                this.settings[this.findSelectedSettingIndex(this.setting)] = this.setting;
            }
            this._cdr.detectChanges();
        }, err => {
            this.setting = null;
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

    cancel() {
        this.displayDialog = false;
    }

    onRowSelect(event, setting) {
        this.newSetting = false;
        this.setting = this.cloneSetting(setting);
        this.setting.Type = this.setting.Type.toUpperCase();
        this.displayDialog = true;
    }

    cloneSetting(c: Setting): Setting {
        const setting = new Setting();
        for ( var prop in c ) {
            setting[prop] = c[prop];
        }
        return setting;
    }

    findSelectedSettingIndex(setting): number {
      //  return this.settings.indexOf(this.setting);
      for (let i = 0; i < this.settings.length; i++) {
        if (this.settings[i].UUID === setting.UUID) {
            return i;
        }
    }
    return -1;
    }
}
