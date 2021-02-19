// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, ViewChild, OnInit, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { BasicValidators } from '../common/basicValidators';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { SessionService } from '../services/user/session.service';
import { AccordionModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { CategoriesService } from '../services/categories.service';
import { ProductService } from '../services/product.service';
import { Category } from '../models/category';

@Component({
    templateUrl: './departments.component.html',

})
export class DepartmentsComponent implements OnInit {

    loadingData = false;
    deletingData = false;
    processingRequest = false;
    displayDialog = false;
    category: Category = new Category();
    newCategory = false;
    categories: Category[];
    categoryFilter: Filter = new Filter();

    @ViewChild(MessageBoxesComponent) msgBox: MessageBoxesComponent;

    constructor(fb: FormBuilder,
        private _productService: ProductService,
        private _confirmationService: ConfirmationService,
        private _sessionService: SessionService,
        private _categoriesService: CategoriesService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _cdr:ChangeDetectorRef) {
    }

    ngOnInit() {

        if (!this._sessionService.CurrentSession.ValidSession) {
            return;
        }
        this.loadingData = true;
        this.loadCategories();
    }

    loadCategories() {
        const filter = new Filter();
        const screen = new Screen();
        screen.Command = 'SearchBy';
        screen.Field = 'CategoryType';
        screen.Value = 'Store.Department';  
        filter.Screens.push(screen);


        const res = this._categoriesService.getCategories(filter);
        res.subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            this.categories = response.Result;

        }, err => {
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.logOut();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }

    onRowSelect(event, category) {
        this.newCategory = false;
        this.category = this.cloneCategory(category); // to be updated in the dialog
        this.displayDialog = true;
    }

    cloneCategory(c: Category): Category {
        const category = new Category();
        for (const prop in c) {
            category[prop] = c[prop];
        }
        return category;
    }


    showDialogToAdd() {
        this.newCategory = true;
        this.category = new Category();
        this.displayDialog = true;
    }

    onClickDeleteCategory() {

        if (confirm('Are you sure you want to delete ' + this.category.Name + '?')) {
            this.deleteCategory(this.category.UUID);
        }
        this.displayDialog = false;
    }

    deleteCategory(categoryUUID) {
        this.msgBox.closeMessageBox();
        this.deletingData = true;
        const res = this._categoriesService.deleteCategory(categoryUUID);

        res.subscribe(response => {

            this.deletingData = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            this.msgBox.ShowMessage('info', 'Department deleted.');
            const index = this.findSelectedIndex(this.category);
            // Here, with the splice method, we remove 1 object
            // at the given index.
            this.categories.splice(index, 1);
            this.loadCategories(); // not updating the list so reload for now
              //todo implement   this._cdr.detectChanges(); and remove the load function.

        }, err => {
            this.deletingData = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.logOut();
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

        if (this.category.AccountUUID === '' || this.category.AccountUUID == null) {
            this.category.AccountUUID = this._sessionService.CurrentSession.AccountUUID;
        }

        this.processingRequest = true;

        let res = null;

        // NOTE: make sure you change this per type your working on. For strains this would be 'Variety'
        this.category.CategoryType = 'Store.Department';

        if (this.newCategory) {// add
            res = this._categoriesService.addCategory(this.category);
        } else { // update
            res = this._categoriesService.updateCategory(this.category);
        }

        res.subscribe(response => {

            this.processingRequest = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            if (this.newCategory) {// add
                this.msgBox.ShowMessage('info', 'Department added');
                this.categories.push(this.category);
            } else { // update
                this.msgBox.ShowMessage('info', 'Department updated');
                this.categories[this.findSelectedIndex(this.category)] = this.category;
            }

           this._cdr.detectChanges();
        }, err => {
            this.category = null;
            this.displayDialog = false;
            this.processingRequest = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.logOut();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }

    findSelectedIndex(category): number {
        for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].UUID === category.UUID) {
                return i;
            }
        }
        return -1;
    }
}
