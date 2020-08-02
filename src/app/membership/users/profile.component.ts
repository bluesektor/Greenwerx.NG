import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MessageBoxesComponent } from '../../common/messageboxes.component';
import { BasicValidators } from '../../common/basicValidators';
import { PasswordValidators } from '../../common/passwordValidators';
import { UserService } from '../../services/user/user.service';
import { SessionService } from '../../services/user/session.service';

import { User } from '../../models/user';


@Component({

    templateUrl: './profile.component.html',
})
export class UserProfileComponent implements OnInit {

    form: FormGroup;
    title: string;
    newUser = false;
    user = new User();
    testMessage: string;
    savingProfile = false;

 
    constructor(
        fb: FormBuilder,
        private _router: Router,
        private _route: ActivatedRoute,
        private _userService: UserService,
        private _sessionService: SessionService
        ,private msgBox : MessageBoxesComponent
        ) {
        this.user.UUID = '';
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
                    Validators.required,
                    PasswordValidators.complexPassword
                ])],
                ConfirmPassword: ['', Validators.required],
                PasswordQuestion: ['', Validators.required],
                PasswordAnswer: ['', Validators.required],

            }, { validator: PasswordValidators.passwordsShouldMatch });
        }
    }

    ngOnInit() {

        this.title = this._sessionService.CurrentSession.ValidSession ? 'Edit User' : 'New User';
        this.newUser = this._sessionService.CurrentSession.ValidSession ? false : true;

        if (!this._sessionService.CurrentSession.ValidSession) {
            return;
        }
        this._userService.getUser(this._sessionService.CurrentSession.UserUUID)
            .subscribe(response => {
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                this.user = response.Result;
            }, err => {
                this.msgBox.ShowResponseMessage(err.status);

                if (err.status === 401 && err.statusText === 'Session expired.') {
                    this._sessionService.clearSession();
                    setTimeout(() => {
                        this._router.navigate(['/membership/login'], { relativeTo: this._route });
                    }, 3000);
                }

            });
    }

    SaveProfile() {

        this.savingProfile = true;
        this.msgBox.closeMessageBox();

        let result;

        if (this.user.UUID && this.user.UUID.length > 0) {
            result = this._userService.updateUser(this.user);
        } else {
            result = this._userService.register(this.user);
        }

        result.subscribe(response => {

            this.savingProfile = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            if (this.newUser) {
                // TODO re-implement when server is fixed.
               // this.msgBox.ShowMessage('info', 'You have been sent a confirmation email.
               // Please check our inbox or spam folders and click the link to proceed.');
               this.msgBox.ShowMessage('info', 'Registration successful, you will be redirected to the login page.');
                this.user = new User();
               setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                },  20000);

            } else {
                this.form.markAsPristine();
               this.msgBox.ShowMessage('info', 'Profile saved.');
            }
        }, err => {
            this.savingProfile = false;
            this.msgBox.ShowResponseMessage(err.status);


            } );
    }
}
