// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, OnInit, ViewChild, HostListener ,OnDestroy , AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavBarAdminComponent } from './navbar.admin.component';
import { NavBarDefaultComponent } from './navbar.default.component';
import { MessageBoxesComponent } from '../app/common/messageboxes.component';
import { SessionService } from '../app/services/user/session.service';//
import { Message } from '../app/models/message';
import { AppService } from '../app/services/app.service';
import { Filter } from '../app/models/filter';
import { Screen } from '../app/models/screen';
import {MessagePump}  from '../app/common/message.pump';
import { Subscription} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
/*
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Events, MenuController, Platform, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { AppSetting } from '../app/app.settings';
import { Filter, Screen } from '../app/models/index';
import { AffiliateService } from '../app/services/common/affiliate.service';
import { PostService } from '../app/services/documents/post.service';
import { EventService } from '../app/services/events/event.service';
import { SessionService } from '../app/services/session.service';
import { LocalSettings } from '../app/services/settings/local.settings';
import { ObjectFunctions } from './common/object.functions';
import { UiFunctions } from './common/uifunctions';
import { ServiceResult } from './models/';
import { AffiliateLog } from './models/affiliatelog';
import { ProfileService } from './services/user/profile.service';
import {CachedItems} from './services/cached.items';
import {FilterService} from './services/filter.service';
const EventSource: any = window['EventSource'];
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import {Parser} from './common/parser.functions';
import {Timer} from './common/timer';
import {Api} from '../app/services/api/api';
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageBoxesComponent] 
})
export class AppComponent implements OnInit,  OnDestroy, AfterViewInit {

    pageSettings: any;

    collapseDiv = false;
    minHeight = 230;

    processingRequest = false;
    currentYear: number;
    domainName: string;
    private _appStatus: string;
    showNavbar = true;

    loggedIn = false; 
    isAdmin = false;
    subscriptions:Subscription[] = [];


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
      private _appService: AppService,
        private _sessionService: SessionService,
        private _messagePump:MessagePump,
        private _router: Router,
        private _route: ActivatedRoute,
        private msgBox:MessageBoxesComponent,
        private translate: TranslateService,
        /* private apiService: Api,
    public alertController: AlertController,
    private cookieService: CookieService,
    private affiliateService: AffiliateService,
    private location: Location,
    private appSettings: AppSetting,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private profileService: ProfileService,
    private messages: Events,
    private http: HttpClient,
    private menu: MenuController,
    private router: Router,
    private eventService: EventService,
    public localSettings: LocalSettings,
    private session: SessionService,
    private route: ActivatedRoute,
    private notification: NotificationsService,
    private postService: PostService,
    private cache: CachedItems,
    private filterService: FilterService
        */
        ) {
            console.log('app.component.ts constructor');
         }

    checkLoginStatus() {
      console.log('APP.COMPONENT.TS checkLoginStatus');
      this.loggedIn = this._sessionService.validSession();
      console.log('APP.COMPONENT.TS checkLoginStatus:', this.loggedIn);
      return this.loggedIn;
    }

  

    private initTranslate(language: string) {
      console.log('app.components.ts _initTranslate()');
      this.translate.use(language);
    }

    ngOnInit() {
        console.log('app.component.ts ngOnInit');
        this.currentYear = new Date().getFullYear();
        this.loadApp();
         
      
        this._sessionService.loadSession();  

        if(this._sessionService.CurrentSession.ValidSession !== undefined)
            this.loggedIn = this._sessionService.CurrentSession.ValidSession;

        this.isAdmin = this._sessionService.CurrentSession.IsAdmin;

        this.initializeMessagePumpSubsriptions();
    }

    ngAfterViewInit() {
       
       // this.statusBar.styleDefault();
       // this.splashScreen.hide();
  
        this.translate.setDefaultLang('en');
  
        if (this.translate.getBrowserLang() !== undefined) {
          this.translate.use(this.translate.getBrowserLang());
        } else {// Set the default language for translation strings, and the current language.
          this.initTranslate('en'); // Set your language here
        }
   
    }

    ngOnDestroy(){
      
        this.subscriptions.forEach(s => s.unsubscribe());
      }

    loadApp() {
        console.log('app.component.ts loadApp');
        this.processingRequest = true;
 
        this._appService.getAppStatus().subscribe(response => {
            this.processingRequest = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this._appStatus = response.Result;

            if (this._appStatus === 'REQUIRES_INSTALL' || this._appStatus === 'INSTALLING') {
                this.showNavbar = false;
                this._router.navigate(['/install'], { relativeTo: this._route });
                return;
            }

            this.processingRequest = true;
            const filter = new Filter();
            filter.PageResults = true;
            filter.StartIndex = 1;
            filter.PageSize = 100;
            const screen = new Screen();
            screen.Command = 'SearchBy';
            screen.Field = 'Name';
            screen.Operator = 'CONTAINS';
            screen.Value = 'SiteDomain'; // for now we just need domain name.
            filter.Screens.push(screen);
            this._appService.getPublicSettings(filter).subscribe(settingResponse => {
                this.processingRequest = false;
                if (settingResponse.Code !== 200) {
                    this.msgBox.ShowMessage('error', response.Message);
                    return false;
                }
                if (settingResponse.Result.length > 0) {
                    this.domainName = settingResponse.Result[0].Value;
                }
            });

        }, err => {
            this.processingRequest = false;
            // Show everything but the session time out.
            if (err.status !== 401) {
                this.msgBox.ShowResponseMessage(err.status);
            }
        });
    }
   // Global logout, use
  //  this._messagePump.publish('user:logout');
  // to trigger the event that calls this function.
  //
  logout() {
    console.log('APP.COMPONENT.TS logout');
    this.loggedIn = false;
    // todo maybe move all these service logouts to session.logOut?
   // this.postService.logOut();
  //  this.cache.logOut();
   // this.filterService.logOut();
  //  this.profileService.logOut();
   // this.eventService.logOut();
  //  this.cookieService.delete('bearer');
  //  this._sessionService.logOut().then(() => {
   //   this._messagePump.publish('api:ok', 'You have been logged out.');
    //  this._messagePump.publish('content:refresh');
     // return this.navigate('/tabs/home');

   // });
  }

  initializeMessagePumpSubsriptions(){

    //
    this.subscriptions.push( this._messagePump.subscribe('user:login', (data: any) => {
        this.loggedIn = true;
          //TODO when after logged in we need to update the navbar(s) so the dropdowns are displayed
          // put input variables on the components
          // console.log('Welcome', data.user, 'at', data.time);
          //
          console.log('app.component.ts MessagePump user:login CurrentSession:', this._sessionService.CurrentSession);
          this.isAdmin = this._sessionService.CurrentSession.IsAdmin;
          this.loggedIn = this._sessionService.CurrentSession.ValidSession;
          this.processingRequest = false;

    }));

    this.subscriptions.push( this._messagePump.subscribe('user:logout', () => {
        console.log(
          'app.component.ts listenForLoginEvents this._messagePump.subscribe(user:logout:'
        );
        this.loggedIn = false;
        
        this.logout();
        this.isAdmin =false;
        this.loggedIn = false;
    }));

    this.subscriptions.push( this._messagePump.subscribe('console:log', (data:any ) => {
      console.log('APP.COMPONENT.TS listenForApiEvents console:log:', data.msg);
      switch (data.status) {
        case 'err':
          console.log('\x1b[41m' + data.msg);
          break;
        case 'warn':
          console.log('\x1b[33m' + data.msg);
          break;
        case 'info':
          console.log('\x1b[44m' + data.msg);
          break;
        default:
          console.log(data.msg);
      }
    }));

    this.subscriptions.push( this._messagePump.subscribe('api:ok', msg => {
      console.log('APP.COMPONENT.TS listenForApiEvents api:ok data:', msg);
      console.log('\x1b[44m' + msg);
    }));

    this.subscriptions.push( this._messagePump.subscribe('api:err', data => {
      console.log('APP.COMPONENT.TS listenForApiEvents api:err data:', data);
      console.log('\x1b[41m' + data.Message);
    }));

    this.subscriptions.push( this._messagePump.subscribe('app:err', msg => {
      console.log('APP.COMPONENT.TS listenForApiEvents msg:', msg);
      console.log('\x1b[41m' +msg);
    }));

    this.subscriptions.push( this._messagePump.subscribe('service:err', data => {
      console.log('app.compoennt.TS loadSession service:err data:', data);
      let errMsg = 'service error.';

      if (data !== undefined) {
        errMsg = data.statusText;
        if (errMsg === 'OK') {
          errMsg = data.message;
        }
        if (data.status === 401) {
          if (this._sessionService.validSession() === true) {
            errMsg = 'You are not authorized this functionality';
          
          }  
        
        }
      }
      console.log('\x1b[41m' +errMsg);
    }));

    this.subscriptions.push( this._messagePump.subscribe('user:session.loaded', () => {
      console.log('app.compoennt.TS   user:session.loaded' );
      this.checkLoginStatus();
    }));

    this.subscriptions.push( this._messagePump.subscribe('user:signup', () => {
      console.log('app.compoennt.TS   user:signup' );
      this.loggedIn = true;
    }));
  }

  useLanguage(language: string) {
    console.log('APP.COMPONENT.TS useLanguage');
    this.translate.use(language);
  }
}
