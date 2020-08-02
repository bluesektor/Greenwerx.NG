import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionService } from '../../services/user/session.service';
import { MessageBoxesComponent } from '../../common/messageboxes.component';
import { TableModule, SharedModule, DialogModule } from 'primeng';

@Component({
    templateUrl: './api.component.html',

})
export class APIComponent implements OnInit {

    processingRequest = false;
    displayDialog: boolean;
    newUser: boolean;

    
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _sessionService: SessionService
        ,private msgBox : MessageBoxesComponent) {
  
    }

    ngOnInit() {
    }

}

