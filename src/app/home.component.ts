// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component } from '@angular/core';
import { AppService } from './services/app.service';
import { MessageBoxesComponent} from '../app/common/messageboxes.component';
import {SessionService} from './services/user/session.service';
@Component({
  selector: 'page-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

    constructor( private _appService: AppService ,
      private _sessionService: SessionService,
      private msgBox:MessageBoxesComponent) {
        console.log('home.component.ts constructor session:', this._sessionService.CurrentSession);
    }
  
}