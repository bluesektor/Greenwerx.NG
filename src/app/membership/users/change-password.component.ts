import { Component, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; //
import { UserService } from '../../services/user/user.service';
import { SessionService } from '../../services/user/session.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MessageBoxesComponent } from '../../common/messageboxes.component';
import { PasswordValidators } from '../../common/passwordValidators';
@Component({

    templateUrl: './change-password.component.html',
})

export class ChangePasswordComponent {
    form: FormGroup;

     // True if the user initiated a password reset.
     // Old password will be blank so don't check it.
    resetPassword = false;
    confirmationCode = '';
    pageTitle = 'Change Password';
    updating = false;

     constructor(
        @Inject(FormBuilder) fb: FormBuilder,
        public _userService: UserService,
        public _sessionService: SessionService,
        private _router: Router,
        private _route: ActivatedRoute
        ,private msgBox : MessageBoxesComponent
        ) {

        this._route.params.subscribe(params => {
            this.resetPassword = params['operation'] === 'pwdr' ? true : false;

            if (this.resetPassword === true) {
                this.confirmationCode = params['code'];
                this.pageTitle = 'Reset Password';
            }

        });

        const validator = (this.resetPassword === true) ? Validators.nullValidator : Validators.required;


        this.form = fb.group({
            Email: '',
            oldPassword: ['', validator],
                newPassword: ['', Validators.compose([
                    Validators.required,
                    PasswordValidators.complexPassword
                ])],
                // Note that here is no need to apply complexPassword validator
                // to confirm password field. It's sufficient to apply it only to
                // new password field. Next, passwordsShouldMatch validator
                // will compare confirm password with new password and this will
                // implicitly enforce that confirm password should match complexity
                // rules.
                ConfirmPassword: ['', Validators.required],
                resetPassword: 'false',
                confirmationCode : ''
        }, { validator: PasswordValidators.passwordsShouldMatch });


        this.form.controls['resetPassword'].setValue(this.resetPassword);
        this.form.controls['confirmationCode'].setValue(this.confirmationCode);
    }

    changePassword() {
        this.updating = true;
        const result = this._userService.changePassword(this.form.value);
        result.subscribe(
           response => {
                this.updating = false;
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }

                this.msgBox.ShowMessage('success', 'Password updated.');
                if (this.resetPassword) {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }

            },
            err => {
                this.updating = false;
                this.msgBox.ShowMessage('error', 'Failed to connect. Check your connection or try again later.');
        });
    }


}
