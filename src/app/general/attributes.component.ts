// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { NgModule } from '@angular/core';
import { Component, ViewChild, OnInit, Output, EventEmitter, ElementRef, Input,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { BasicValidators } from '../common/basicValidators';
import { Filter } from '../models/filter';
import { Screen} from '../models/screen';
import { SessionService } from '../services/user/session.service';
import { AccordionModule } from 'primeng';
import { PickListModule } from 'primeng';
import { ConfirmDialogModule, ConfirmationService, CheckboxModule } from 'primeng';
import { AttributeService } from '../services/attribute.service';
import { ProductService } from '../services/product.service';
import { Attribute } from '../models/attribute';
import {GetImageThumbPipe } from '../common/pipes/image.pipe';
import * as _ from 'lodash';
 

@Component({
    selector: 'tm-attribute',
    templateUrl: './attributes.component.html',

})
export class AttributesComponent implements OnInit {
    @Input() datatype: string;

    loadingData = false;
    deletingData = false;
    processingRequest = false;
    displayDialog = false;
    editImage = false;
    datatypes: string[] = [];
    newAttribute = false;
    attributes: Attribute[];
    attribute: Attribute = new Attribute();
   //  customDatatype: string = '';
    attributeFilter: Filter = new Filter();
    dataTypes: string[] = [];
    dataForType: any[] = [];
    dataItem: any;

    constructor(fb: FormBuilder,
        private _productService: ProductService,
        private _confirmationService: ConfirmationService,
        private _sessionService: SessionService,
        private _attributesService: AttributeService,
        private _router: Router,
        private _route: ActivatedRoute,
        private msgBox:MessageBoxesComponent,
        private _cdr:ChangeDetectorRef
) {
    this.attribute.ReferenceType = '';
    }

    ngOnInit() {

        if (!this._sessionService.CurrentSession.ValidSession) {
            return;
        }

        this.loadingData = true;
        this.loadAttributes();
        this.loadDataTypes();
    }

    loadAttributes() {
        var filter = new Filter();
        filter.PageResults = false;
        const res = this._attributesService.getAttributes(filter);
        res.subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.attributes = response.Result;
        }, err => {
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401 && err.statusText === 'Session expired.' ) {
                this._sessionService.clearSession();
                  setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }

    loadDataTypes(){
        var filter = new Filter();
        filter.PageResults = false;
        /*
        const screen = new Screen();
        screen.Field = 'Datatype';
        screen.Command = 'SearchBy';
        screen.Value = this.datatype;
        filter.Screens.push(screen);
        */
        const res = this._attributesService.getDataTypes(filter);
        res.subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            this.dataTypes = response.Result;
        }, err => {
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401 && err.statusText === 'Session expired.' ) {
                this._sessionService.clearSession();
                  setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }

    onRowSelect(event, data) {
        this.newAttribute = false;
        this.attribute = this.cloneAttribute(data);
        if(this.attribute.ReferenceType !== ''){
            this.loadDataForType(this.attribute.ReferenceType, this._sessionService.CurrentSession.AccountUUID);
        }
        this.displayDialog = true;
    }

     cloneAttribute(c: Attribute): Attribute {
        const attribute = new Attribute();
        for (const prop in c) {
            attribute[prop] = c[prop];
        }
        return attribute;
    }


     showDialogToAdd() {
         this.newAttribute = true;
         this.attribute = new Attribute();
         this.displayDialog = true;
     }

     onClickDeleteAttribute() {
       
         if (confirm('Are you sure you want to delete ' + this.attribute.Name + '?')) {
             this.deleteAttribute(this.attribute.UUID);
         }
         this.displayDialog = false;
     }

    deleteAttribute(attributeUUID) {
        this.msgBox.closeMessageBox();
        this.deletingData = true;
        const res = this._attributesService.deleteAttribute(attributeUUID);

        res.subscribe(response => {

            this.deletingData = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            this.msgBox.ShowMessage('info', 'Attribute deleted.');
            const index = this.findSelectedIndex(this.attribute);
            // Here, with the splice method, we remove 1 object
            // at the given index.
            this.attributes.splice(index, 1);
            this.loadAttributes();  // not updating the list so reload for now.
              //todo implement   this._cdr.detectChanges(); and remove the load function
        }, err => {
            this.deletingData = false;
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

    save() {
        this.msgBox.closeMessageBox();

        if (this.attribute.AccountUUID === '' || this.attribute.AccountUUID === null ) {
            this.attribute.AccountUUID = this._sessionService.CurrentSession.AccountUUID;
        }

       this.processingRequest = true;
        let res = null;
      //  this.attribute.Datatype = this.datatype;

        if (this.newAttribute) {// add
            res = this._attributesService.addAttribute(this.attribute);
        } else { // update
            res = this._attributesService.updateAttribute(this.attribute);
        }

        res.subscribe(response => {

            this.processingRequest = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            if (this.newAttribute) {// add
                this.msgBox.ShowMessage('info', 'Attribute added');
                this.attributes.push(response.Result);
            } else { // update
                this.msgBox.ShowMessage('info', 'Attribute updated');
                this.attributes[this.findSelectedIndex(this.attribute)] = this.attribute;
            }
            this.loadAttributes();  // not updating the list so reload for now.
              //todo implement   this._cdr.detectChanges(); and remove the load function
        }, err => {
            this.attribute = null;
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

    findSelectedIndex(attribute): number {

        for (let i = 0; i < this.attributes.length; i++) {

            if (this.attributes[i].UUID === attribute.UUID) {
                return i;
            }
        }
        return -1;
    }

    findDatatypeIndex(datatype): number {

        for (let i = 0; i < this.datatypes.length; i++) {

            if (this.datatypes[i] === datatype) {
                return i;
            }
        }
        return -1;
    }

    cboDataTypeChange(newType) {
        this.datatype = newType;
        this.attribute.ReferenceType  = newType;
        this.loadDataForType(newType, this._sessionService.CurrentSession.AccountUUID);
    }

    loadDataForType(type:string, accountUUID: string){
        console.log('attributes.component.ts loadDataForType');
        var filter = new Filter();
        filter.PageResults = false;
        const res = this._attributesService.getDataForType(type, filter );
        res.subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.dataForType = response.Result;
            this._cdr.detectChanges();
            var e = document.getElementById('att' +  this.attribute.ReferenceUUID);
            console.log('attributes.component.ts loadDataForType element:', e );

            if(e !== undefined && e !== null){
                e.style.backgroundColor = '#42A948';
            }
         
        }, err => {
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401 && err.statusText === 'Session expired.' ) {
                this._sessionService.clearSession();
                  setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }
        });
    }

    getRowColor(uuid){
      
        if(uuid === this.attribute.ReferenceUUID ){
            console.log('getrowcolor uuid:','selectedRow' + uuid);
            return 'selectedRow';
        }
        return 'unselectedRow';
    }
    
    onRowSelectDataItem(event, data) {
        console.log('attributes.component.ts onRowSelectDataItem event:', event);
        console.log('attributes.component.ts onRowSelectDataItem data:', data);
        var previous = document.getElementById('att' +  this.attribute.ReferenceUUID);
        if(previous !== undefined && previous !== null){
            previous.style.backgroundColor = 'white';
        }
        var e =  document.getElementById('att' + data.UUID);
        e.style.backgroundColor = '#42A948';
        this.attribute.ReferenceUUID = data.UUID;
       
    }
}
