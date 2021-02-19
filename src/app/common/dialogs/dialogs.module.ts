// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ModalDialogComponent} from './modal.dialog';
import {StoreDetailsDialogComponent} from './store/store.details.dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageBoxesModule } from '../../common/messageboxes.module';
import {DialogService} from './dialog.service';
import {PipesModule} from '../../common/pipes/pipes.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MatDialogModule,
        MessageBoxesModule,
        PipesModule
    ],
    declarations: [
        ModalDialogComponent,
        StoreDetailsDialogComponent
       
    ],
    exports: [
        ModalDialogComponent,
        StoreDetailsDialogComponent
       
    ],
    entryComponents: [ModalDialogComponent,StoreDetailsDialogComponent],
    providers: [DialogService]
})
export class DialogsModule {

}
