﻿// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.
import { Component, ViewChild, OnInit, Output, EventEmitter, ElementRef,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { BasicValidators } from '../common/basicValidators';
import { SessionService } from '../services/user/session.service';
import { AccountService } from '../services/user/account.service';
import { CategoriesService } from '../services/categories.service';

import { AccordionModule } from 'primeng';
import { CheckboxModule } from 'primeng';
import { PickListModule } from 'primeng';
import { ConfirmDialogModule, ConfirmationService, AutoCompleteModule } from 'primeng';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';

import { UnitsOfMeasureService } from '../services/unitsofmeasure.service';
import { UnitOfMeasure } from '../models/unitofmeasure';
import { Category } from '../models/category';


@Component({
    templateUrl: './measures.component.html',
    selector: 'tm-measures',
})
export class MeasuresComponent implements OnInit {

    loadingData = false;
    deletingData = false;
    displayDialog = false;
    newMeasure = false;
    selectedMeasure: UnitOfMeasure = new UnitOfMeasure();
    selectedCategoryUUID: string;
    categories: Category[];
    newUnitOfMeasure = false;
    measures: UnitOfMeasure[] = [];
    totalRecords: number;
    formUnitOfMeasureDetail: FormGroup;

    // ===--- Top Menu Bar ---===
    strainActiveUnitOfMeasure = false;
    msgs: any[] = [];


    constructor(fb: FormBuilder,
        private _confirmationService: ConfirmationService,
        private _sessionService: SessionService,
        private _accountService: AccountService,
        private _measuresService: UnitsOfMeasureService,
        private _categoriesService: CategoriesService,
        private _router: Router,
        private _route: ActivatedRoute,
        private msgBox:MessageBoxesComponent,
        private _cdr: ChangeDetectorRef
) {

        this.formUnitOfMeasureDetail = fb.group({
            Name: ['', Validators.required],
            Email: ['', BasicValidators.email],
            Private: '',
            Active: '',
            SortOrder: 0
        });
    }

    ngOnInit() {
        if (!this._sessionService.CurrentSession.ValidSession) {
            return;
        }
        this.loadCategoriesDropDown();
    }

    onDeleteMeasure() {

        if (confirm('Are you sure you want to delete ' + this.selectedMeasure.Name + '?')) {
            this.deleteUnitOfMeasure(this.selectedMeasure.UUID);
        }
    }

    deleteUnitOfMeasure(uuid) {
        this.msgBox.closeMessageBox();
        this.deletingData = true;
        const res = this._measuresService.delete(uuid);

        res.subscribe(response => {

            this.deletingData = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            this.msgBox.ShowMessage('info', 'UnitOfMeasure deleted.');
            const index = this.findSelectedIndex(this.selectedMeasure);
            // Here, with the splice method, we remove 1 object
            // at the given index.
            this.measures.splice(index, 1);
            this.loadUnitOfMeasures(this.selectedCategoryUUID, 1, 25);  // not updating the list so reload for now.
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

    loadUnitOfMeasures(categoryUUID: string, page?: number, pageSize?: number) {
        let filter = new Filter();
        filter.PageResults = true;
        filter.StartIndex = page;
        filter.PageSize = pageSize;

        const res = this._measuresService.get(filter);
        res.subscribe(response => {
            this.loadingData = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.measures = response.Result;
            this.totalRecords = response.TotalRecordCount;
        }, err => {
            this.msgBox.ShowResponseMessage(err.status);
            this.loadingData = false;
            if (err.status === 401) {
                this._sessionService.clearSession();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }

    lazyLoadUnitOfMeasuresList(event) {
        this.loadUnitOfMeasures(this.selectedCategoryUUID, event.first, event.rows);

    }

    showDialogToAdd() {
        this.newUnitOfMeasure = true;
        this.selectedMeasure = null;
        this.selectedMeasure = new UnitOfMeasure();
        this.displayDialog = true;
    }

    cancel() {
        this.displayDialog = false;
    }

    onRowSelect(event,data) {
        this.newUnitOfMeasure = false;
        this.selectedMeasure = this.cloneUnitOfMeasure(data);
        this.displayDialog = true;
    }

    cloneUnitOfMeasure(c: UnitOfMeasure): UnitOfMeasure {
        const measure = new UnitOfMeasure();
        for (const prop in c) {
            if (prop != null) {
                measure[prop] = c[prop];
            }
        }
        return measure;
    }

    findSelectedIndex(strain): number {
        for (let i = 0; i < this.measures.length; i++) {

            if (this.measures[i].UUID === strain.UUID) {
                return i;
            }
        }
        return -1;
    }

    saveMeasure() {
        this.loadingData = true;
        this.msgBox.closeMessageBox();

        let res;

        if (this.newUnitOfMeasure === true) {
            this.selectedMeasure.UUID = '';
            res = this._measuresService.add(this.selectedMeasure);

        } else {
            res = this._measuresService.update(this.selectedMeasure);
        }
        var self = this;
        res.subscribe(response => {

            self.loadingData = false;
            self.displayDialog = false;

            if (response.Code !== 200) {
                self.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            if (self.newUnitOfMeasure) {
                self.msgBox.ShowMessage('info', 'UnitOfMeasure added.');
                self.selectedMeasure.UUID = response.Result.UUID;
                self.newUnitOfMeasure = false;
                self.measures.push(self.selectedMeasure);

            } else {
                self.msgBox.ShowMessage('info', 'UnitOfMeasure updated.');
                self.measures[this.findSelectedIndex(this.selectedMeasure)] = this.selectedMeasure;
            }
            self.loadUnitOfMeasures(this.selectedCategoryUUID, 1, 25);  // not updating the list so reload for now.
              //todo implement   this._cdr.detectChanges(); and remove the load function
            self._cdr.detectChanges();
            console.log('measures.component.ts saveMeasure this.selectedMeasure.Category:', this.selectedMeasure.Category);
        }, err => {
            self.loadingData = false;
            self.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                self._sessionService.clearSession();
                setTimeout(() => {
                    self._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }
        });
    }

    cboCategoryChange(categoryUUID) {
        console.log('measures.component.ts cboCategoryChange ');
        this.selectedMeasure.Category = categoryUUID;

    }

    loadCategoriesDropDown() {
        console.log('measures.component.ts loadCategoriesDropDown ');
       this.loadingData = true;
        const filter = new Filter();
        const screen = new Screen();
        screen.Field = 'CategoryType';
        screen.Command = 'SearchBy';
        screen.Value = 'Product';
        filter.Screens.push(screen);

        const res = this._categoriesService.getCategories(filter);
        res.subscribe(response => {
            this.loadingData = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            this.categories = response.Result;
        }, err => {
            this.msgBox.ShowResponseMessage(err.status);
            this.loadingData = false;
            if (err.status === 401) {
                this._sessionService.clearSession();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }
}
