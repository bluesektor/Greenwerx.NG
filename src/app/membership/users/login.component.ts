import { Component, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms'; //
import { UserService } from '../../services/user/user.service';
import { SessionService } from '../../services/user/session.service';
import { CheckboxModule } from 'primeng';
import { MessageBoxesComponent } from '../../common/messageboxes.component';
import { Api } from 'src/app/services/api';
import { Session } from 'src/app/models';
@Component({

    templateUrl: './login.component.html',
})

export class LoginComponent {
    form: FormGroup;
    userName: string;
    passWord: string;
    rememberMe = false;
    returnUrl: string;
    authorizing = false;
  
    constructor(
        @Inject(FormBuilder)  fb: FormBuilder,
        public _userService: UserService,
        private _router: Router,
        private _route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        public _sessionService: SessionService 
        ,private msgBox : MessageBoxesComponent ) {

        this.form = fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: ''
        });

        this._route.params.subscribe(params => {
            this.returnUrl = params['returnUrl'];
            this.rememberMe = true;
        });
        if (!this.returnUrl) {
            this.returnUrl = '';
        }

        this.userName = this._sessionService.localSettings.getValue('userName', '');
    }

    toggleRememberMe($event) {
        this.rememberMe = $event.target.checked;
    }

    LogIn() {
        this.msgBox.closeMessageBox();
        this.authorizing = true;
        if (this.rememberMe) {
            this._sessionService.localSettings.setValue('userName', this.userName);
        } else {
            this._sessionService.localSettings.remove('userName');
        }
        console.log('login..        ');
        const result = this._sessionService.login(this.form.value);
        result.subscribe( response => {
            this.authorizing = false;
            if (response.Code !== 200) {
                console.log('login        ', response.Message);
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.form.markAsPristine();
           Api.authToken = response.Result.Authorization;
           this._sessionService.CurrentSession = new Session();
            this._sessionService.CurrentSession.IsAdmin = response.Result.IsAdmin;
            this._sessionService.CurrentSession.AccountUUID = response.Result.AccountUUID;
            this._sessionService.CurrentSession.UserUUID = response.Result.UserUUID;
            this._sessionService.CurrentSession.DefaultLocationUUID = response.Result.DefaultLocationUUID;
            this._sessionService.CurrentSession.ValidSession = true;
            this._sessionService.saveSessionLocal();
            this.msgBox.ShowMessage( 'ok', 'Login success!','user:login');
            this._router.navigate(['/' ], { relativeTo: this._route });
            },
            err => {
                this.authorizing = false;
                this.msgBox.ShowResponseMessage(err.status);
            }
        );
    }

    LogOut() {
        this.authorizing = false;
        this.msgBox.ShowMessage('', '', 'user:logout');
        setTimeout(() => {
            this._router.navigate(['/membership/login'], { relativeTo: this._route });
        }, 3000);
    }
}
