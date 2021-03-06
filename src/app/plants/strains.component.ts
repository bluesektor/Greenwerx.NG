﻿import { Component, ViewChild, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { BasicValidators } from '../common/basicValidators';
import { SessionService } from '../services/user/session.service';
import { AccountService } from '../services/user/account.service';

import { AccordionModule } from 'primeng';
import { CheckboxModule } from 'primeng';
import { PickListModule } from 'primeng';
import { ConfirmDialogModule, ConfirmationService, AutoCompleteModule } from 'primeng';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { PlantsService } from '../services/plants.service';
import { CategoriesService } from '../services/categories.service';
import { Strain } from '../models/strain';
import { Category } from '../models/category';
import { Location } from '../models/location';
import { Account } from '../models/account';
import { GeoService } from '../services/geo.service';


@Component({
    templateUrl: './strains.component.html',

})
export class StrainsComponent implements OnInit {

    loadingData = false;
    deletingData = false;
    displayDialog = false;
    selectedStrain: Strain = new Strain();
    selectedCategoryUUID: string;
    selectedAccount: string; // breeder
    newStrain = false;
    strains: Strain[] = [];
    categories: Category[];
    departments: Category[];
    selectedDepartmentUUID: string;
    selectedLocationtUUID = '';
    locations: Location[];
    totalRecords: number;
    formStrainDetail: FormGroup;
    filteredAccounts: Account[] = [];
    searching = false;
    searchTerm:string;
    searchStrains: Filter = new Filter();

    // ===--- Top Menu Bar ---===
    strainActiveStrain = false;
    msgs: any[] = [];
 
    constructor(fb: FormBuilder,
        private _strainService: PlantsService,
        private _geoService: GeoService,
        private _confirmationService: ConfirmationService,
        private _sessionService: SessionService,
        private _accountService: AccountService,
        private _categoriesService: CategoriesService,
        private _router: Router,
        private _route: ActivatedRoute
        ,private msgBox : MessageBoxesComponent) {

        this.formStrainDetail = fb.group({
            Name: ['', Validators.required],
            Email: ['', BasicValidators.email],
            Private: '',
            Active: '',
            SortOrder: 0
        });

    }

    // ===--- General Events ---===

    ngOnInit() {
        this.loadingData = true;

        if (!this._sessionService.CurrentSession.ValidSession) {
            return;
        }

        this.loadCategoriesDropDown();
        this.loadLocations();
    }

    onTabShow(e) {
        console.log('tab index:', e.index);
    }

    // ===--- Top Menu Bar ---===

    loadCategoriesDropDown() {
        this.loadingData = true;
        this.searching = false; // switch when using the combo. this way we know what filter to use.
        const filter = new Filter();
        const screen = new Screen();
        screen.Field = 'CategoryType';
        screen.Command = 'SearchBy';
        screen.Value = 'Variety';
        filter.Screens.push(screen);

        const res = this._categoriesService.getCategories(filter);
        res.subscribe(response => {
            this.loadingData = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.categories = response.Result;

            if (this.categories.length > 0) {

                const c = new Category();
                this.selectedCategoryUUID = '';
            }
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

    cboCategoryChange(categoryUUID) {
        this.selectedDepartmentUUID = '';
        this.selectedCategoryUUID = categoryUUID;
        this.loadStrains(categoryUUID);
    }

    loadLocations() {
        this.loadingData = true;
        const res = this._geoService.getCustomLocations();
        res.subscribe(response => {
            this.loadingData = false;
            this.displayDialog = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.locations = response.Result;

            const l = new Location();
            l.UUID = '';
            l.Name = 'Select a location';
            this.locations.push(l);

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

    onClickDeleteStrain() {

        if (confirm('Are you sure you want to delete ' + this.selectedStrain.Name + '?')) {
            this.deleteStrain(this.selectedStrain.UUID);
        }
    }

    deleteStrain(strainUUID) {
        this.msgBox.closeMessageBox();
        this.deletingData = true;
        const res = this._strainService.deleteStrain(strainUUID);

        res.subscribe(response => {

            this.deletingData = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            this.msgBox.ShowMessage('info', 'Strain deleted.');
            const index = this.findSelectedIndex(this.selectedStrain);
            // Here, with the splice method, we remove 1 object
            // at the given index.
            this.strains.splice(index, 1);
            this.loadStrains(this.selectedCategoryUUID, 1, 25);  // not updating the list so reload for now.
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

    loadStrains(categoryUUID: string, page?: number, pageSize?: number) {

        if (this.searching === false && (categoryUUID == null || categoryUUID === '')) {
            return;
        }
        this.loadingData = true;
        let filter = new Filter();
        if (this.searching === true) {
            filter = this.searchStrains;
        } else {
            const screen = new Screen();
            screen.Command = 'SearchBy';
            screen.Field = 'CategoryUUID';
            screen.Value = categoryUUID;
            filter.Screens.push(screen);
        }
        filter.PageResults = true;
        filter.StartIndex = page;
        filter.PageSize = pageSize;

        const res = this._strainService.getStrains(filter);
        res.subscribe(response => {
            this.loadingData = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.strains = response.Result;
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

    lazyLoadStrainsList(event) {
        this.loadStrains(this.selectedCategoryUUID, event.first, event.rows);

    }

    showDialogToAdd() {
        this.newStrain = true;
        this.selectedStrain = null;
        this.selectedStrain = new Strain();
        this.displayDialog = true;
    }

    cancel() {
        this.displayDialog = false;
    }

    onRowSelect(event, data) {
        this.newStrain = false;
        this.selectedStrain = this.cloneStrain(data);

        if ( !BasicValidators.isNullOrEmpty(  this.selectedStrain.BreederUUID)) {
            console.log('strains.component.ts onRowSelect this.selectedStrain.BreederUUID:',this.selectedStrain.BreederUUID);
            // get the acount name. todo add this to the service when retrieving the record.
            this._accountService.getAccount(this.selectedStrain.BreederUUID).subscribe(response => {

                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                this.selectedAccount = response.Result.Name;
            });
        }
        this.displayDialog = true;
    }

    cloneStrain(c: Strain): Strain {
        const strain = new Strain();
        for (const prop in c) {
            if (prop != null) {
            strain[prop] = c[prop];
        }
        }
        return strain;
    }

    findSelectedIndex(strain): number {
        for (let i = 0; i < this.categories.length; i++) {

            if (this.strains[i].UUID === strain.UUID) {
                return i;
            }
        }
        return -1;
    }

    saveStrain() {
        this.loadingData = true;
        this.msgBox.closeMessageBox();

        let res;

        if (this.newStrain === true) {
            this.selectedStrain.UUID = '';
            res = this._strainService.addStrain(this.selectedStrain);

        } else {
            res = this._strainService.updateStrain(this.selectedStrain);
        }

        res.subscribe(response => {

            this.loadingData = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            if (this.newStrain) {
                this.msgBox.ShowMessage('info', 'Strain added.');
                this.selectedStrain.UUID = response.Result.UUID;
                this.newStrain = false;
                this.strains.push(this.selectedStrain);

            } else {
                this.msgBox.ShowMessage('info', 'Strain updated.');
                this.strains[this.findSelectedIndex(this.selectedStrain)] = this.selectedStrain;
            }
            this.loadStrains(this.selectedCategoryUUID, 1, 25);  // not updating the list so reload for now.
              //todo implement   this._cdr.detectChanges(); and remove the load function
        }, err => {
            this.loadingData = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.clearSession();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }
        });
    }

    filterAccounts(event) {
        console.log('strains.compoentent.ts filterAccounts');
        const filter = new Filter();
        filter.PageResults = true;
        filter.StartIndex = 1;
        filter.PageSize = 25;
        const screen = new Screen();
        screen.Command = 'SearchBy';
        screen.Operator = 'Contains';
        screen.Field = 'Name';
        screen.Operator = 'CONTAINS';
        if( event.query)
         screen.Value = event.query.toLowerCase();

        filter.Screens.push(screen);
        this._accountService.getAllAccounts(filter).subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.filteredAccounts = response.Result;
        });
    }

    onSelectAccount(value) {
        this._accountService.getAccount(value.UUID).subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.selectedStrain.BreederUUID = value.UUID;
            this.selectedAccount = value.Name;
        });
    }

    handleAccountDropdownClick(event) {
        const filter = new Filter();
        filter.PageResults = true;
        filter.StartIndex = 1;
        filter.PageSize = 25;

        this._accountService.getAllAccounts(filter).subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.filteredAccounts = response.Result;
        });
    }



    onSearchStrains(searchText) {

        if (!searchText || searchText.length < 2) {
            return;
        }
        this.loadingData = true;
        this.searching = true; // switch when text is being searched for in table..
        this.searchStrains.Screens = [];
        const screen = new Screen();
        screen.Command = 'SearchBy';
        screen.Operator = 'Contains';
        screen.Field = 'Name';
        screen.Value = searchText;
        this.searchStrains.Screens.push(screen);


        setTimeout(() => {

            this._strainService.getStrains(this.searchStrains).subscribe(response => {
                this.loadingData = false;
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                this.strains = response.Result;
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

        }, 1000);
    }

}
