import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

const STORAGE_KEY = 'greenwerx';
/**
 * TODO implement AppSettings and LocalSettings in SettingsService.
 * AppSettings reads from assets/data/enviroment.local.json these should be default values for resetting the app or initial install etc.
 * LocalSettings for saving locally if network isn't available or member is not logged in.
 * SettingsService loads and saves settings from the server. Settings in the service should be lower level
 * options like api url whereas what to load and theme should be in the members profile.
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalSettings {

  static readonly HasSeenTutorial = 'HAS_SEEN_TUTORIAL';
  static readonly HasLoggedIn = 'HAS_LOGGED_IN';
  static readonly UserName = 'USERNAME';
  static readonly SessionToken = 'SESSION_TOKEN';
  static readonly SessionData = 'SESSION_DATA'; // stores the session.ts
  static readonly Theme = 'THEME';
  static readonly ViewType = 'VIEW_TYPE'; // Used in home page for loading the data
  static readonly ReferringMember = 'REFERRING_MEMBER';

  private SETTINGS_KEY = 'defaults';
 

  //Settings:Map<string, any> = new Map<string,any>(); 

  //_defaults: any;
  _readyPromise: Promise<any>;

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService
    ) {  }

  getValue(key: string, defaultValue: string) {
    console.log('setting.ts getValue key:', key);
    const value = this.storage.get(key);//this.SETTINGS_KEY);
    if(!value)
      return defaultValue;

    return value;
  }

  setValue(key: string, value: any) {
     return this.storage.set(key, value);
   }

  remove(key: string) {
    return this.storage.remove(key);
   }

  /*
    _mergeDefaults(defaults: any) {
    for (const k in defaults) {
     
      if (!this.Settings.has(k)) {this.Settings.set(k, defaults[k]);}
    }
    return this.setAll(this.Settings);
  }
  
  
  load( key: string ) {
    if (key === undefined || key === '' || key === '-') {
      key = 'default';
    }
    console.log('settings.load.settingsKey:', key);

    this.SETTINGS_KEY = key;

    return this.storage.get(this.SETTINGS_KEY).then((value) => {
      if (value) {
        this.Settings.set(this.SETTINGS_KEY,value);
        return this._mergeDefaults(this._defaults);
      } else {
        return this.setAll(this._defaults);
      }
    });

  }

  merge(settings:  Map<string,any>() {
    for (const k in settings) {
      if (settings[k]) {
        this.settings[k] = settings[k];
      }
    }
    return this.save();
  }
  

  save() {
    return this.setAll(this.settings);
  }

  setAll(value: any) {
   return this.storage.set(this.SETTINGS_KEY, value);
  }*/
 
/*
 

  get allSettings() {
    return this.settings;
  }
  */
}
