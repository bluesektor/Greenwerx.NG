import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { SessionService } from '../../services/user/session.service';

import { MessageBoxesComponent } from '../../common/messageboxes.component';

@Component({

    templateUrl: './users-validate.component.html',
})

export class UsersValidateComponent implements OnInit {
    validationType: string;
    operation: string;
    validationCode: string;
    validating = true;

 
    constructor(
        private _userService: UserService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _sessionService: SessionService
        ,private msgBox : MessageBoxesComponent
    ) {     }

    ngOnInit() {
        this._route.params.subscribe(params => {
            this.validationCode = params['code'];
        });

        this._route.params.subscribe(params => {
            this.operation = params['operation'];
        });

        this._route.params.subscribe(params => {
            this.validationType = params['type'];
        });

        if (!this.validationCode || this.validationCode.length === 0) {

            this.msgBox.ShowMessage('error', 'Validation code is wrong!');
            this.validating = false;
            return;
        }

        if (!this.operation || this.operation.length === 0) {
            this.msgBox.ShowMessage('error', 'operation is wrong!');
            this.validating = false;
            return;
        }

        if (!this.validationType || this.validationType.length === 0) {
            this.msgBox.ShowMessage('error', 'operation type is wrong!');
            this.validating = false;
            return;
        }

        this._userService.validateUser( this.validationType, this.operation, this.validationCode ).subscribe(response => {
            this.validating = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.msgBox.ShowMessage(response.Status, response.Message);

            let typeOperation = this.validationType + '_' + this.operation;

            switch (typeOperation.toLocaleLowerCase()) {
                    case 'mbr_mreg': // user validated email after registering.
                        this.msgBox.ShowMessage('info', 'Account has been activated. You will be redirected to the login.');
                        setTimeout(() => { this._router.navigate(['/membership/login'], { relativeTo: this._route }); }, 5000);
                    break;
                    case 'mbr_mdel': // membership oops/remove
                        this.msgBox.ShowMessage('info', 'Your account has been deleted.');
                        break;
                    case 'mbr_pwdr': // password reset
                        let url = '/users/changepassword/operation/' + this.operation + '/code/' + this.validationCode;
                        setTimeout(() => { this._router.navigate([url], { relativeTo: this._route }); }, 1000);
                    break;
                    default:
                        // Invalid code.
                        this.msgBox.ShowMessage('info', 'Invalid code.');
                }

        }, err => {
            this.validating = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.clearSession();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }


}
