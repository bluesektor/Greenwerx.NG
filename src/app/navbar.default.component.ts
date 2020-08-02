// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, ElementRef, Input } from '@angular/core';
 
import { AppService } from './services/app.service';
import { SessionService } from './services/user/session.service';
import { Setting } from './models/setting';
import { SettingsService } from './services/settings/settings.service';
import {CartDropdownComponent} from './store/cart.dropdown.component';

@Component({
    selector: 'ctl-navbar-default',
    templateUrl: './navbar.default.component.html',
})

export class NavBarDefaultComponent {
    pageTitle = '';
    pageSettings: any;
    highlightedDiv: number;
    navbarLinks: any[] = [];
   @Input() userIsLoggedIn =  false;
   @Input()  userIsAdmin = false;
    userDropDownExpanded = false;

    constructor(
        private _sessionService: SessionService,
        private _appSettings: AppService,
        private _settingsService: SettingsService
        ) {
           
        this.loadSettings();
        console.log('navbar.default.component.ts constructor CurrentSession:', this._sessionService.CurrentSession);
    }

    loadSettings() {
        console.log('navbar.default.component.ts loadSettings');

        if(this._sessionService.CurrentSession.ValidSession !== undefined)
            this.userIsLoggedIn = this._sessionService.CurrentSession.ValidSession;
        if(this._sessionService.CurrentSession.IsAdmin !== undefined)   
            this.userIsAdmin =  this._sessionService.CurrentSession.IsAdmin;

        const res = this._appSettings.getDashboard('navbar_default' );
        res.subscribe(response => {
            if (response.Code !== 200) {return false; }
            this.pageSettings = response.Result;
            this.pageTitle = this.pageSettings.Title;
            this.navbarLinks = this.initializeTopMenu(this.pageSettings.TopMenuItems);

            this.toggleActive(0); // set first one as active. should be home page
        }, err => {

        });
       
    }

    initializeTopMenu(navLinks: any[]) {
        console.log('navbar.default.component.ts initializeTopMenu');
        const menuItems = [];

        for (let i = 0; i < navLinks.length; i++) {
            const itm = {
                label: navLinks[i].label,
                icon: navLinks[i].icon,
                routerLink: navLinks[i].href, // [navLinks[i].href], <= use this if converting to primeng
                // url: navLinks[i].href,
                // items: this.initializeTopMenu(navLinks[i].items) //recursive add sub-menu

                // command?: (event?: any) => void;
                // url?: string;
                // routerLink?: any;
                // eventEmitter?: EventEmitter<any>;
                //  items?: MenuItem[];
                // expanded?: boolean;
                // disabled?: boolean;
                // visible?: boolean;
                // target?: string;
            };
            // if (navLinks[i].items.length == 0) {
            //    itm.items = null;
            // }

            menuItems.push(itm);
        }
        return menuItems;
    }

    toggleActive(index) {

        console.log('navbar.default.component.ts toggleActive');
        if (this.highlightedDiv !== index) {
            this.highlightedDiv = index;
        }
    }

    toggleUserDropDown() {
        console.log('navbar.default.component.ts toggleUserDropDown');
        this.userDropDownExpanded = !this.userDropDownExpanded;
    }

}
