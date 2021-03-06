﻿import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionService } from '../../services/user/session.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';
import { MessageBoxesComponent } from '../../common/messageboxes.component';
import { TableModule, SharedModule, DialogModule } from 'primeng';

@Component({
    templateUrl: './users.component.html',

})
export class UsersComponent implements OnInit {

    processingRequest = false;

    users: User[];

    displayDialog: boolean;

    user: User = new User();

    selectedUser: User;

    newUser: boolean;

   
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _userService: UserService,
        private _sessionService: SessionService
        ,private msgBox : MessageBoxesComponent
        ) {
 

    }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this._userService.getUsers()
        .subscribe(response => this.users = response.Result);
    }

    delete() {
        this.msgBox.closeMessageBox();

        if (confirm('Are you sure you want to delete ' + this.user.Name + '?')) {

          this.processingRequest = true;

          const res = this._userService.deleteUser(this.user.UUID);

            res.subscribe(response => {
            this.displayDialog = false;
                this.processingRequest = false;

                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }

                const index = this.findSelectedUserIndex(); // this.users.indexOf(this.user)
                 // Here, with the splice method, we remove 1 object
                 // at the given index.
                this.users.splice(index, 1);
                this.msgBox.ShowMessage('info', 'User deleted.');
                this.loadUsers(); // not updating the list so reload for now.
                  //todo implement   this._cdr.detectChanges(); and remove the load function

            }, err => {
                this.processingRequest = false;
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

    showDialogToAdd() {
        this.newUser = true;
        this.user = new User();
        this.displayDialog = true;
    }

    save() {
        this.msgBox.closeMessageBox();

        if (this.user.AccountUUID === '' || this.user.AccountUUID == null ) {
            this.user.AccountUUID = this._sessionService.CurrentSession.AccountUUID;
        }

        this.processingRequest = true;
        let res = null;

        if (this.newUser) { // add
            res = this._userService.addUser(this.user);
        } else { // update
            res = this._userService.updateUser(this.user);
        }

        res.subscribe(response => {

            this.processingRequest = false;

            this.displayDialog = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            if (this.newUser) { // add
                this.msgBox.ShowMessage('info', 'User added');
                this.user.UUID = response.Result;
                this.users.push(this.user);
            } else { // update
                this.msgBox.ShowMessage('info', 'User updated');
                this.users[this.findSelectedUserIndex()] = this.user;
            }
            this.loadUsers(); // not updating the list so reload for now.
              //todo implement   this._cdr.detectChanges(); and remove the load function
        }, err => {
             this.user = null;
            this.displayDialog = false;
            this.processingRequest = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.clearSession();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }

    cancel() {
        this.displayDialog = false;
    }

    onRowSelect(event, user) {
        this.newUser = false;
        this.user = this.cloneUser(user);
        this.displayDialog = true;
    }

    cloneUser(c: User): User {
        const user = new User();
        for (const prop in c) {
            if (prop != null) {
                user[prop] = c[prop];
            }
        }
        return user;
    }

    findSelectedUserIndex(): number {
        return this.users.indexOf(this.selectedUser);
    }
}

