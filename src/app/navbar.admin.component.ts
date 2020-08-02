// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, ElementRef, OnInit, HostListener } from '@angular/core';
import { PanelMenuModule, MenuItem } from 'primeng';
import { AppService } from './services/app.service';
import { SessionService } from './services/user/session.service';
import { Setting } from './models/setting';
import { SettingsService } from './services/settings/settings.service';
import {CartDropdownComponent} from './store/cart.dropdown.component';
@Component({
        selector: 'tm-navbar-admin',
        templateUrl: './navbar.admin.component.html',

})
export class NavBarAdminComponent implements OnInit {

    isExpanded = false;
    collapseDiv = false;
    minHeight = 230; //  <= this is in app.component.ts also
    userDropDownExpanded = false;
    pageTitle = '';
    pageSettings: any;
    navbarLinks: any[] = [];
    highlightedDiv: number;
    sidePanelItems: MenuItem[]= [];

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        let topOffset = 50;
        const width = (event.target.innerWidth > 0) ? event.target.innerWidth : event.target.screen.width;

        if (width < 768) {
            this.collapseDiv = true;
            topOffset = 100; // 2-row-menu
        } else {
            this.collapseDiv = false;
        }

        let height = ((event.target.innerHeight > 0) ? event.targetinnerHeight : event.target.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) { height = 1; }
        if (height > topOffset) {
           this.minHeight = height;
        }
    }

    constructor(
       
      public  _sessionService: SessionService,
       private _appService: AppService
    ) {
        console.log('navbar.admin.component.ts constructor');
    }

    ngOnInit() {
        console.log('navbar.admin.component.ts ngOnInit');
        this.loadSettings();
    }

    loadSettings() {
        console.log('navbar.admin.component.ts loadSettings');
 
        const res = this._appService.getDashboard('navbar_admin' );

        res.subscribe(response => {

            if (response.Code !== 200) { return false; }

            this.pageSettings = response.Result;
            this.pageTitle = this.pageSettings.Title;
            this.sidePanelItems = this.initializeSidePanel(this.pageSettings.SideMenuItems);
        }, err => { });
         
    }

    initializeSidePanel(navLinks: any[]) {
        const menuItems =  [];

        for (let i = 0; i < navLinks.length; i++) {
            const itm = {
                label: navLinks[i].label,
                icon: navLinks[i].icon,
                routerLink: [navLinks[i].href],
                // url: navLinks[i].href,
                items: this.initializeSidePanel(navLinks[i].items) // recursive add sub-menu

                // command?: (event?: any) => void;
                // url?: string;
                // routerLink?: any;
                // eventEmitter?: EventEmitter<any>;
                // items?: MenuItem[];
                // expanded?: boolean;
                // disabled?: boolean;
                // visible?: boolean;
                // target?: string;
            };
            if (navLinks[i].items.length === 0) {
                itm.items = null;
            }

            menuItems.push(itm);
        }
        return menuItems;
    }

    toggleUserDropDown() {
        console.log('navbar.admin.component.ts toggleUserDropDown'); 
        this.userDropDownExpanded = !this.userDropDownExpanded;
    }

    toggleActive(index) {
        console.log('navbar.admin.component.ts toggleActive');
        if (this.highlightedDiv !== index) {
            this.highlightedDiv = index;
        }
    }

}
