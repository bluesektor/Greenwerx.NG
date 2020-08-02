// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import {
    Component
} from '@angular/core';

import { BasicValidators } from './basicValidators';

//todo ad subscribe and unsubscribe, then add new parameter to display as notification or not
import {MessagePump} from '../common/message.pump';
import { NotificationsService, NotificationType } from 'angular2-notifications';
//import { triggerAsyncId } from 'async_hooks';

@Component({
    selector: 'app-messageboxes',
    templateUrl: './messageboxes.component.html'
})


export class MessageBoxesComponent  {

     showMessageBox = false;
     message: string;
     messageType: string;
    // types = ['alert', 'error', 'info', 'warn', 'success'];
    // animationTypes = ['fromRight', 'fromLeft', 'scale', 'rotate'];

     constructor( private _messagePump:MessagePump,
         private _notifications: NotificationsService ) {
  
     }


    public  notify(type: string, title:string, message:string){
        console.log('messageboxes NOTIFY');
        this._notifications.create(title, message, NotificationType.Error );
     }

    public ShowMessage(msgType: string, message: string,  pumpTo?: string) {
        console.log('message boxes.compoentent.ts ShowMEssage');
        if ( msgType && msgType !== null) {
            this.messageType = msgType.toLowerCase();
        }
        
        if(pumpTo !== null && pumpTo !== undefined){
                 this._messagePump.publish(pumpTo, {
                    msg: message,
                     time: new Date()
         });
        }

        switch(this.messageType){
                case 'error':
                    this._notifications.create("Error!", message, NotificationType.Error );
                    break;
                    case 'unauthorized':
                        this._notifications.create("Error!", message, NotificationType.Error );
                        break;
                    case 'badreqeust':
                        this._notifications.create("Error!", message, NotificationType.Error );
                        break;
              
                    case   'info':
                        this._notifications.create("Info", message, NotificationType.Info );
                        break;
                    case  'warning':
                        this._notifications.create("Warning", message, NotificationType.Warn );
                        break;
                    case  'ok':
                        this._notifications.create("Success", message, NotificationType.Success );
                        break;
                    case  'success':
                        this._notifications.create("Success", message, NotificationType.Success );
                        break;
                   // default:
                     //   this._notifications.create("", message, NotificationType.Bare );
                    //    break;
        }
       
        /*

        this.message = message;
        this.displayStyle = style;

        if (msgType === '' || message === '') {
            this.showMessageBox = false;
        } else {
            this.showMessageBox = true;
        }

        setTimeout(() => {
            this.showMessageBox = false;
        },  displayTimeSeconds * 1000);
        */
    }

    public ShowResponseMessage(code: number,  msg?: string,  pumpTo?: string ) {
        const msgType = 'error';
        let text = msg;

        if (BasicValidators.isNullOrEmpty(msg) === true) {
            text = '';
        }

        switch (code) {
            case 401:
                text += ' Session expired.';
                break;
            case 429:
                text += 'Too many requests being sent.';
                break;
        }

        this.ShowMessage(msgType, text, pumpTo);

    }


    public closeMessageBox() {
        this.showMessageBox = false;
        this.message = '';
    }
}
