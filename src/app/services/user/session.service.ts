// Copyright 2015, 2017 greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.


// import * as moment from 'moment';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

import { Injectable} from '@angular/core';
import { map } from 'rxjs/operators';
import { Session, Role, ServiceResult, Profile } from '../../models/index';

import { Api } from '../api';
import { Events } from '../../common/events';
//import { Storage } from '@ionic/storage';
import {LocalSettings} from  '../../services/settings/local.settings';
import {ObjectFunctions} from '../../common/object.functions';
import * as jwt_decode from 'jwt-decode';
import {DateTimeFunctions} from '../../common/date.time.functions';
import {Timer} from '../../common/timer';


@Injectable({
    providedIn: 'root'
  })
export class SessionService {

    CurrentSession: Session  = new Session();
    AccountRoles: Role[] = [];

   constructor(
    private api: Api,
     public messages: Events,
     public localSettings: LocalSettings
   //  @Inject(SESSION_STORAGE) private storage: StorageService
    ) {

       
    }

    clearSession() {
        this.AccountRoles = [];
         this.CurrentSession = new Session();
        this.CurrentSession.IsAdmin = false;
        this.CurrentSession.Expires = new Date();
        this.CurrentSession.AccountUUID = '';
        this.CurrentSession.UserUUID = '';
        this.CurrentSession.LastSettingUUID = '';
        this.CurrentSession.IsPersistent = false;
        Api.authToken = '';
        this.CurrentSession.Profile = null;
        this.CurrentSession.Profile = new Profile();
       
        this.localSettings.remove(LocalSettings.SessionToken );
        this.localSettings.remove(LocalSettings.UserName );
        this.localSettings.remove(LocalSettings.SessionData );
        this.localSettings.remove(LocalSettings.HasLoggedIn );
    }

    getRole(category: string, categoryName: string): Role {
        for (let i = 0; i < this.AccountRoles.length; i++) {
            if (this.AccountRoles[i].Category.toUpperCase() === category.toUpperCase() &&
                this.AccountRoles[i].CategoryRoleName.toUpperCase() === categoryName.toUpperCase()      ) {
                    return this.AccountRoles[i];
            }
        }
        return null;
    }

    getSession(sessionToken: string) {
       return this.api.invokeRequest('POST', 'api/Sessions' , sessionToken );
    }

    isUserInAdminRole(): boolean {
        if ( ObjectFunctions.isNullOrWhitespace(Api.authToken) === true ) {
              console.log('session.service.ts isUserInAdminRole invalid authtoken');
              return false;
          }
          const tokens = jwt_decode(Api.authToken);
          if ( ObjectFunctions.isValid(tokens) === false ) {
             console.log('session.service.ts isUserInAdminRole tokens:', tokens);
              return false;
          }
           console.log('session.service.ts isUserInAdminRole jwt_decode tokens:', tokens);
          if ( ObjectFunctions.isValid(tokens.roleNames) === false ) {
              console.log('session.service.ts isUserInAdminRole tokens.roleNames:', tokens.roleNames);
              return false;
          }
          const roleWeights = tokens.roleWeights.split(',');
          for (let i = 0; i < roleWeights.length; i++) {
              if ( roleWeights[i] >= 90 ) {
                    console.log('session.service.ts isUserInAdminRole TRUE');
                  return true;
              }
          }
         console.log('session.service.ts isUserInAdminRole FALSE');
          return false;
    }

    isUserInRole(roleName: string): boolean {
      //  console.log('session.service.ts isUserInRole roleName:', roleName);
       // console.log('session.service.ts isUserInRole Api.authToken:', Api.authToken);
        if ( ObjectFunctions.isNullOrWhitespace(Api.authToken) === true ) {
          //  console.log('session.service.ts isUserInRole invalid authtoken');
            return false;
        }

        const tokens = jwt_decode(Api.authToken);
        if ( ObjectFunctions.isValid(tokens) === false ) {
           // console.log('session.service.ts isUserInRole tokens:', tokens);
            return false;
        }
        roleName = roleName.toUpperCase();
        // console.log('session.service.ts isUserInRole jwt_decode tokens:', tokens);
        if ( ObjectFunctions.isValid(tokens.roleNames) === false ) {
           // console.log('session.service.ts isUserInRole tokens.roleNames:', tokens.roleNames);
            return false;
        }
        console.log('split a session.service.ts');
        const roleNames = tokens.roleNames.split(',');
        for (let i = 0; i < roleNames.length; i++) {
            if (roleName === roleNames[i]) {
        //        console.log('session.service.ts isUserInRole TRUE');
                return true;
            }
        }
       // console.log('session.service.ts isUserInRole FALSE');
        return false;
    }

    loadLocalSession() {
        this.CurrentSession  = this.localSettings.getValue( LocalSettings.SessionData, null );
     /*   this.localSettings.getValue( LocalSettings.SessionData, null ).then(sData => {
            this.CurrentSession = sData;
            console.log('SESSION.SERVICE.TS loadSession storage.get() this.CurrentSession:', this.CurrentSession);
        });*/
      }

    // When app is loading is calls checkLoginStatus() (basically checks the session)
    // if it returns false then look for local storage to see if there's a key and/or
    // session data to load.
    //
    async loadSession() {
        console.log('session.service.ts loadSession');
        const tidx = Timer.start('session.service.ts loadSession');
        let res = this.localSettings.getValue(LocalSettings.SessionToken, null);
        
        console.log('session.service.ts loadSession res:', res);
        if (ObjectFunctions.isValid(res) === false) {
            console.log('SESSION.SERVICE.TS loadSession ObjectFunctions.isValid = false');
            return false; // no token so we can't load any data.
        }
        Api.authToken = res; // set the authorization token
        console.log('SESSION.SERVICE.TS loadSession Api.authToken:', Api.authToken);
            // Load the session data..
        let sData =  this.localSettings.getValue( LocalSettings.SessionData, null );
                
        if (ObjectFunctions.isValid(sData) === false) {
            this.getSession(Api.authToken).subscribe((sessionResponse) => {
                const data = sessionResponse as ServiceResult;
                if (data.Code !== 200) {
                    // this.clearSession();
                    if (data.Code === 401) {
                        // this.messages.publish('user:logout');
                        return;
                    }
                    this.messages.publish('api:err', data);
                    //
                    return false;
                }
                this.CurrentSession = data.Result;
                console.log('SESSION.SERVICE.TS loadSession api.getSession() this.CurrentSession:', this.CurrentSession);
                this.messages.publish('user:session.loaded');
                Timer.stop(tidx);
            });
        } else {
            this.CurrentSession = sData;
            console.log('SESSION.SERVICE.TS loadSession storage.get() this.CurrentSession:', this.CurrentSession);
            this.messages.publish('user:session.loaded');
            Timer.stop(tidx);
        }
             

        if (ObjectFunctions.isValid( this.CurrentSession) === false ) {
            console.log('SESSION.SERVICE.TS loadSession ObjectFunctions.isValid( this.CurrentSession) = false');
            // this.messages.publish('user:logout');
            return false;
        }
       
    }

    login(userCredentials) {
        console.log('SESSION.SERVICE.TS login this.api:', this.api);
        return this.api.invokeRequest('POST', 'api/Accounts/Login', userCredentials);
    }

    logOut(){
        console.log('session.service.ts logOut this.api:', this.api);
        this.clearSession();

       if ( this.api.invokeRequest('GET', 'api/Accounts/LogOut', ''    )) {  // .then(() => {
            this.clearSession();
            this.localSettings.remove(LocalSettings.HasLoggedIn);
            this.localSettings.remove( LocalSettings.UserName);
             
        }
    }

    saveSessionLocal() {
        // this.storage.set(LocalSettings.SessionToken, Api.authToken);
        // this.storage.set(LocalSettings.UserName, this.login.UserName);
        this.localSettings.setValue(LocalSettings.SessionData, this.CurrentSession);
        // this.storage.set(LocalSettings.HasLoggedIn, true);
    }

    validSession(): boolean {

        console.log('SESSION.SERVICE.TS validSession Api.authToken:', Api.authToken);

        if (ObjectFunctions.isValid( this.CurrentSession) === false ||
            ObjectFunctions.isNullOrWhitespace(this.CurrentSession.UserUUID) === true  ) {
            console.log('SESSION.SERVICE.TS validSession ObjectFunctions.isValid( this.CurrentSession) = false');
            // this.messages.publish('user:logout');
            return false;
        }
          // check if session has expired if not persistent.
        console.log('SESSION.SERVICE.TS validSession.this.CurrentSession.IsPersistent:', this.CurrentSession.IsPersistent );

        if (this.CurrentSession.IsPersistent === true) {
            return true; // has a session and it's persistant so no need to check expiration.
        }
        console.log('SESSION.SERVICE.TS validSession this.CurrentSession.expires:', this.CurrentSession.Expires);
        const diff = DateTimeFunctions.getDifference(new Date(), this.CurrentSession.Expires);

        console.log('SESSION.SERVICE.TS validSession getDifference:', diff);
        if (diff === false ||  diff <= 0) {
            console.log('SESSION.SERVICE.TS validSession RETURNING false');
           return false;
        }
        return true;
        /*
        const end = moment(new Date());
        const now =  moment(this.CurrentSession.Expires).local();
        const duration = moment.duration(now.diff(end));
        const ms = duration.asMilliseconds();

        console.log('SESSION.SERVICE.TS validSession ms left in session:', ms);

        if (ms > 0) {
            console.log('SESSION.SERVICE.TS validSession RETURNING TRUE:');
            return true;
        }
        return false;
        */
    }

     isLocationSet(): boolean {
        console.log('session.service.ts isLocationSet');

      if (this.validSession() === true) {
        console.log('session.service.ts isLocationSet (this.sessionService.validSession() === true');
        if (   ObjectFunctions.isValid(this.CurrentSession.Profile ) === true &&
            ObjectFunctions.isValid(this.CurrentSession.Profile.LocationDetail) === true &&
          ( this.CurrentSession.Profile.LocationDetail.Latitude !== '0' &&
            this.CurrentSession.Profile.LocationDetail.Longitude !== '0' )) {



          console.log('session.service.ts isLocationSet SETTING LOCATION Latitude:', this.CurrentSession.Profile.LocationDetail.Latitude);
          // tslint:disable-next-line:max-line-length
          console.log('session.service.ts isLocationSet SETTING LOCATION  Longitude:',  this.CurrentSession.Profile.LocationDetail.Longitude);
          return true;
        }
      }
    return false;
    }

    
    // Use this when the user is a guest or there is no connection.
    saveCart(shoppingCartUUID: string) {
        this.localSettings.setValue('shoppingcart', shoppingCartUUID);
    }

    getCart(): string {
        const cookie = this.localSettings.getValue('shoppingcart','');
        if (cookie === null || cookie === undefined) {
            return '';
        }
        return cookie;
    }

    clearCart() {
        this.localSettings.remove('shoppingcart');
    }
}
