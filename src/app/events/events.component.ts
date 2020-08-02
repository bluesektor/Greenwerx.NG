// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, OnInit, ViewChild, Input, Output, Inject, EventEmitter } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

import { SessionService } from '../services/user/session.service';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { AppService } from '../services/app.service';
import { BasicValidators } from '../common/basicValidators';


@Component({
    selector: 'tm-events', 
    templateUrl: './events.component.html'

})
export class EventsComponent implements OnInit {
 
    @ViewChild(MessageBoxesComponent) msgBox: MessageBoxesComponent;

    constructor(
        private _appService: AppService,
        private _sessionService: SessionService,
        @Inject(FormBuilder) fb: FormBuilder
        ) {
    }

    ngOnInit() {
       
    }
}
