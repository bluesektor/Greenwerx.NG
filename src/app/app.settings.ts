import { HttpClient } from '@angular/common/http';

import { Injectable , Renderer2, RendererFactory2  } from '@angular/core';
import {   OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectFunctions } from './common/object.functions';
import {Parser} from './common/parser.functions';
import {MessagePump}  from './common/message.pump';
import { Observable } from 'rxjs';
declare var DeviceUUID: any;

@Injectable({
    providedIn: 'root'
  })
export class AppSetting implements  OnInit {
    manifest: any;
    settings: any;
   // private renderer: Renderer2;

    constructor(private http: HttpClient,
      private route: ActivatedRoute,
      private _messagePump:MessagePump,
      private router: Router,
      private rendererFactory: RendererFactory2
      ) {
        console.log('app.settings.ts  constructor');
       
        if (ObjectFunctions.isValid(this.manifest) === false) {
          this.loadSettings();
        }

        this.getDeviceSettings();
       
        console.log('app.settings.ts getURLParameter...');
        const type =  Parser.getURLParameter('type', location.search);
        const op = Parser.getURLParameter('operation', location.search);
        const code =  Parser.getURLParameter('code', location.search);

        if (Parser.getURLParameter('validate', location.search) === 'membership' ) {
          this.router.navigateByUrl('/membership/validate/type/' + type +
          '/operation/' + op + '/code/' + code);
        } 
     
      //  this.renderer = rendererFactory.createRenderer(null, null);
      
    }
    public loadSettings$( ) : Observable<Object>{
          return this.http.get('assets/data/environment.' + this.manifest.environment +  '.json');
           /* .subscribe(res => {
              if ( ObjectFunctions.isValid( res ) === false) {
                return;
              }
                this.settings = res;
                console.log('APP.SETTINGS.TS manifest.initialize this.settings:', this.settings);
                if (  ObjectFunctions.isValid( this.settings) === false) {
                  return;
                }

                this._messagePump.publish('settings:loaded', {
                  msg: 'message',
                   time: new Date()
                });
            this.renderer.addClass(document.body, this.settings.theme);
          });*/
     // });
     
    }

    public loadSettings( ) {
     
      const self = this;
      this.http //Must load the manifest before settings
        .get('assets/manifest.json') .subscribe(res => {
          console.log('APP.SETTINGS.TS res:', res);
          self.manifest = res;
          console.log('APP.SETTINGS.TS manifest:', self.manifest);
          console.log('app.settings.ts  loadSettings');
          if ( ObjectFunctions.isValid(this.settings)) {
         //   this.renderer.addClass(document.body, this.settings.theme);
            return;
          }
          this.http
            .get('assets/data/environment.' + this.manifest.environment +  '.json').subscribe(res => {
              if ( ObjectFunctions.isValid( res ) === false) {
                return;
              }
                this.settings = res;
                console.log('APP.SETTINGS.TS manifest.initialize this.settings:', this.settings);
                if (  ObjectFunctions.isValid( this.settings) === false) {
                  return;
                }

                this._messagePump.publish('settings:loaded', {
                  msg: 'message',
                   time: new Date()
                });
           // this.renderer.addClass(document.body, this.settings.theme);
          });
      });
    }

    ngOnInit() { 
      
      console.log('APP.settings.TS ngOnInit');
 
      /* moved to constructor, can't recall which worked better.
      console.log('app.settings.ts getURLParameter...');
      const type =  Parser.getURLParameter('type', location.search);
      const op = Parser.getURLParameter('operation', location.search);
      const code =  Parser.getURLParameter('code', location.search);

      if (Parser.getURLParameter('validate', location.search) === 'membership' ) {
        this.router.navigateByUrl('/membership/validate/type/' + type +
        '/operation/' + op + '/code/' + code);
      }
      */
    
    }

    getDeviceSettings(){

/*
        const du = new DeviceUUID().parse();
        const dua = [
          du.language,
          du.platform,
          du.os,
          du.cpuCores,
          du.isAuthoritative,
          du.silkAccelerated,
          du.isKindleFire,
          du.isDesktop,
          du.isMobile,
          du.isTablet,
          du.isWindows,
          du.isLinux,
          du.isLinux64,
          du.isMac,
          du.isiPad,
          du.isiPhone,
          du.isiPod,
          du.isSmartTV,
          du.pixelDepth,
          du.isTouchScreen
      ];
      */
      // console.log(dua);
     // // IE cpuClass
     // const uuid2 = du.hashMD5(dua.join(':'));
     // const uuid3 = du.hashInt(dua.join(':'));
    //  console.log(uuid2.slice(0, 8), uuid2.slice(8, 12), uuid2.slice(12, 16), uuid2.slice(16, 20), uuid2.slice(20));
     // // document.getElementById("fingerprint-2").innerHTML = uuid2;
     // // document.getElementById("fingerprint-3").innerHTML = uuid3;
    //  // todo create device key. user key?
    //  // in session add api request counter, every random number of calls generate device key and verify on service to make
    //  // sure the key matches on device and service (prevent session/token jacking).
    //  // create device key. on service save device key in session. On future requests send device key or see if we can replicate
    //  // creating the device key from request header. If device key doesn't match what is in session then token/session gets invalidated.

     //   // session logs : deviceKey, sessionStart,  sessionEnd(gobal.asax?) ip, userName, sessionToken,
    //  console.log(navigator, screen, window.performance);


     // console.log('app.settings.ts property Object.values(du):', Object.values(du));
    //  console.log('app.settings.ts property Object.entries(du):', Object.entries(du));
     // for (const key of Object.keys(du)) {
       // const value = du[key];
      //  // ... do something with mealName
     //   console.log(value);
     // }

     // for (const [key, value] of Object.entries(du)) {
     //   console.log(key + ':' + value);
    //  }
    }
}
