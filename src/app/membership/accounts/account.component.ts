// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MessageBoxesComponent } from '../../common/messageboxes.component';
import { BasicValidators } from '../../common/basicValidators';
import { AccountService } from '../../services/user/account.service';
import { SessionService } from '../../services/user/session.service';
import { Account } from '../../models/account';

@Component({
    templateUrl: './account.component.html',

})
export class AccountComponent implements OnInit {

    form: FormGroup;
    title: string;
    newAccount = false;
    account = new Account();
    testMessage: string;
    savingData = false;
 
    constructor(
        fb: FormBuilder,
        private _router: Router,
        private _route: ActivatedRoute,
        private _accountService: AccountService,
        private _sessionService: SessionService
        ) {

        if (this._sessionService.CurrentSession.ValidSession) {

            this.form = fb.group({
                name: ['', Validators.required],
                Email: ['', BasicValidators.email],
                PasswordQuestion: ['', Validators.required],
                PasswordAnswer: ['', Validators.required],
            });
        } else {
            this.form = fb.group({
                name: ['', Validators.required],
                Email: ['', BasicValidators.email],
                password: ['', Validators.compose([
                    Validators.required
                ])],
                ConfirmPassword: ['', Validators.required],
                PasswordQuestion: ['', Validators.required],
                PasswordAnswer: ['', Validators.required],

            });
        }
    }

    ngOnInit() {

        this.title = this._sessionService.CurrentSession.ValidSession ? 'Edit Account' : 'New Account';
        this.newAccount = this._sessionService.CurrentSession.ValidSession ? false : true;

        if (!this._sessionService.CurrentSession.ValidSession) {
            return;
        }

    }

    SaveAccount() {

    }
}
