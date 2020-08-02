import { Component, ViewChild, Inject } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms'; //

import { MessageBoxesComponent } from './common/messageboxes.component';
import { AppService } from './services/app.service';
import { BasicValidators } from './common/basicValidators';
import { Message } from './models/message';

@Component({

    templateUrl: './contact-form.component.html',
})

export class ContactFormComponent {
    form: FormGroup;
    sendingMessage = false;
    
    SentFrom: string;
    Subject: string;
    Comment: string;
    Type = 'contact_us';

    constructor(
        @Inject(FormBuilder) fb: FormBuilder,
        private _appService: AppService,
        private msgBox:MessageBoxesComponent

    ) {

        this.form = fb.group({
            sentFrom: ['', Validators.compose([Validators.required, BasicValidators.email])],
            subject: ['', Validators.nullValidator],
            comment: ['', Validators.required],
            type: ['contactus', Validators.nullValidator]
        });

    }

    SendContactMessage() {
        this.sendingMessage = true;
       // this.form.controls['type'].setValue('contactus');  todo test that we don't need this
        const result = this._appService.sendMessage(this.form.value);
        result.subscribe(
            response => {

                this.sendingMessage = false;

                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }

                this.form.reset();
                this.form.markAsPristine();
                this.msgBox.ShowMessage('info', 'Your email has been sent. Thank you.');
            },
            err => {
                this.sendingMessage = false;
                this.msgBox.ShowResponseMessage(err.status);


        });
    }
}

