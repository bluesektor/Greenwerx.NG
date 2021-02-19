// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService } from '../services/user/account.service';
import { SessionService } from '../services/user/session.service';
import { GeoService } from '../services/geo.service';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { TableModule, SharedModule, DialogModule, AccordionModule, AutoCompleteModule } from 'primeng';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { Account } from '../models/account';
import { Location } from '../models/location';
import { BasicValidators } from '../common/basicValidators';

@Component({
    templateUrl: './locations.component.html',

})
export class LocationsComponent implements OnInit {

    isSuperAdmin = false;
    allowAllAcocunts = false;
    displayDialog = false;
    newLocation = false;
    processingRequest = false;
    locations: Location[];
    location: Location = new Location();
    totalLocations = 0;
    locationTypes: string[];
    selectedLocationType = '';
    customLocation = '';

    selectedAccount: Account = new Account();
    filteredAccounts: Account[] = [];
    loadingAccounts = false;

    countries: Location[];
    states: Location[];
    cities: Location[];

   
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _accountService: AccountService,
        private _geoService: GeoService,
        private _cdr: ChangeDetectorRef,
        private _sessionService: SessionService
        ,private msgBox : MessageBoxesComponent) {
    
        if (   this._sessionService.CurrentSession.Profile.User.RoleWeight >= 99){
            this.isSuperAdmin = true;}
    }

    ngOnInit() {
        this.loadLocationTypes();
    }

    cboLocationTypeChange(newType) {
        console.log('locations.component.ts ');
        if (!newType || newType === '' || newType === null) {
            return;
        }
        this.selectedLocationType = newType;
        this.loadLocations(newType, 1, 25);
    }

    cboLocationAddEditLocationTypeChange(newType) {

        console.log('locations.component.ts ');
        this.customLocation = '';
        if (newType === '') {
            return;
        }
        this.location.LocationType = newType;
    }

    toggleViewAllAccounts(event){
        console.log('locations.component.ts  toggleViewAllAccounts allowAllAcocunts:', this.allowAllAcocunts);
        if(this.allowAllAcocunts && this._accountService.Accounts.length > 0 ){
            console.log('filteredAccounts LOADED ********************************************************************************************');
            this.filteredAccounts = this._accountService.Accounts;
        }else{
            const filter = new Filter();
            filter.PageResults = false;
            this._accountService.getAllAccounts(filter).subscribe(response => {
                this.processingRequest = false;
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                this._accountService.Accounts  = response.Result;
                console.log('filteredAccounts LOADED ********************************************************************************************');
                this.filteredAccounts = response.Result;
                console.log('locations.component.ts  loadMemberAccounts filteredAccounts:', this.filteredAccounts);
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
    //Only assign a location to the accounts the user is amember of
    // don't wan't to let someoneassing a location so some arbitrary account.
     //if site admin allow all accounts. 
        // todo show checkbox if site admin
        //api/Accounts
           // 
    loadMemberAccounts() {
  
        const filter = new Filter();
        filter.PageResults = false;
        this._accountService.getAccounts(filter).subscribe(response => {
            console.log('locations.component.ts  loadMemberAccounts response:', response);
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            console.log('filteredAccounts LOADED ********************************************************************************************');
            this.filteredAccounts = response.Result;
            console.log('locations.component.ts  loadMemberAccounts filteredAccounts:', this.filteredAccounts);
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

    loadLocationTypes() {
        console.log('locations.component.ts loadLocationTypes');
        this.processingRequest = true;
        const res = this._geoService.getLocationTypes();
        res.subscribe(response => {
            console.log('locations.component.ts loadLocationTypes response');
            this.displayDialog = false;
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.locationTypes = response.Result;

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

    loadLocations(locationType: string, page: number, pageSize: number) {
        console.log('locations.component.ts loadLocations');
        this.processingRequest = true;

        const filter = new Filter();
        filter.PageResults = true;
        filter.StartIndex = page;
        filter.PageSize = pageSize;
        const screen = new Screen();
        screen.Command = 'SEARCHBY';
        screen.Field = 'LocationType';
        screen.Value = locationType;
        filter.Screens.push(screen);

        const res = this._geoService.getLocations(locationType, filter);
        res.subscribe(response => {
            this.displayDialog = false;
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.locations = response.Result;
            this.totalLocations = response.TotalRecordCount;

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

    lazyLoadLocationsList(event) {
        console.log('locations.component.ts lazyLoadLocationsList');

        if (!this.selectedLocationType || this.selectedLocationType === '') {
            return;
        }

        this.loadLocations(this.selectedLocationType, event.first, event.rows);
    }

    delete() {
        console.log('locations.component.ts delete');
        this.msgBox.closeMessageBox();
        if (confirm('Are you sure you want to delete ' + this.location.Name + '?')) {
            this.processingRequest = true;
            const res = this._geoService.deleteLocation(this.location.UUID);
            res.subscribe(response => {
                this.displayDialog = false;
                this.processingRequest = false;
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                const index = this.findLocationIndex(this.location.UUID);
                // Here, with the splice method, we remove 1 object
                // at the given index.
                this.locations.splice(index, 1);
                this.msgBox.ShowMessage('info', 'Location deleted.');
                this.loadLocations(this.selectedLocationType, 1, 25);   // not updating the list so reload for now.
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
        this.loadCountries();
        this.newLocation = true;
        this.location = new Location();
        this.location.LocationType = this.selectedLocationType;
        this.displayDialog = true;
    }

    save() {
        for (let i = 0; i < this.countries.length; i++) {

            if (this.countries[i].Name === this.location.Country) {
                console.log('this.location found country:', this.location.Country);
                console.log('this.countries found country:', this.countries[i].Name);
            }
        }

        console.log('locations.component.ts save');
        this.msgBox.closeMessageBox();

        if (this.location.LocationType === 'custom') {
            this.locationTypes.push(this.customLocation);
            this.location.LocationType = this.customLocation;

            this.location.AccountUUID = this._sessionService.CurrentSession.AccountUUID;

            if (this.location.City !== '') {
                this.location.UUParentID =  this.cities.find( x => x.Name ===  this.location.City ).UUID;
            } else if (this.location.State !== '') {
                this.location.UUParentID = this.states.find(x => x.Name ===  this.location.State).UUID;
            } else if (this.location.Country !== '') {
                this.location.UUParentID = this.countries.find(x =>  x.Name === this.location.Country).UUID;
            }
        }

        if (!this.locations) {
            this.locations = [];
        }

        if (this.findLocationIndex(this.location.UUID) < 0) {
            this.locations.push(this.location);
        }

        this.processingRequest = true;

        let res = null;

        if (this.newLocation) {// add
            res = this._geoService.addLocation(this.location);
        } else { // update
            res = this._geoService.updateLocation(this.location);
        }

        res.subscribe(response => {

            this.processingRequest = false;
            this.location = null;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            if (this.newLocation) {// add
                this.msgBox.ShowMessage('info', 'Location added.');
                this.locations.push(this.location);
            } else { // update
                this.msgBox.ShowMessage('info', 'Location updated.');
                this.locations[this.findSelectedLocationIndex()] = this.location;
            }
            this.loadLocations(this.selectedLocationType, 1, 25);   // not updating the list so reload for now.
              //todo implement   this._cdr.detectChanges(); and remove the load function
        }, err => {
            this.location = null;
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
        this.newLocation = false;
    }

    cancel() {
        this.displayDialog = false;
    }

    onRowSelect(event, data) {
        console.log('locations.component.ts onRowSelect');
       
        this.newLocation = false;
        this.location = this.cloneLocation(data);
        this._accountService.getAccount(this.location.AccountUUID).subscribe(response => {
          //  if (response.Code !== 200) {
          //      this.msgBox.ShowMessage(response.Status, response.Message);
          //      return false;
          //  }
          if(response.Code === 200){
          
            this.selectedAccount = response.Result;
            console.log('onRowSelect countries:', this.countries);
            this.loadMemberAccounts();
            this.loadCountries();
            this._cdr.detectChanges();
          }
            this.displayDialog = true;
        });
    }

    onTabShow(e) {
        console.log('tab index:', e.index);
    }

    cloneLocation(c: Location): Location {
        const location = new Location();
        for (const prop in c) {
            location[prop] = c[prop];
        }
        return location;
    }

    findSelectedLocationIndex(): number {
        return this.locations.indexOf(this.location);
    }

    loadCountries() {
        console.log('locations.component.ts loadCountries');

        this.processingRequest = true;
        const filter = new Filter();
        filter.PageResults = false;

        const res = this._geoService.getLocations('country', filter);
        res.subscribe(response => {
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.countries = response.Result;
           
            for(var i = 0; i < this.countries.length; i++){
                if(this.countries[i].Name.trim() === this.location.Country.trim()) {
                    this.countries[i].Selected = true;//only way I could get the stupid option selected.
                    this.loadStates(this.countries[i].Name);
                    break;
                }
            }
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

    findLocationIndex(locationUUID): number {
        console.log('locations.component.ts findLocationIndex');

        for (let i = 0; i < this.locations.length; i++) {

            if (this.locations[i].UUID === locationUUID) {
                return i;
            }
        }
        return -1;
    }

    loadStates(countryName) {
        console.log('locations.component.ts loadStates');
        // _.find(this.Countries.value, (x: Country) => (x && x.CountryCode) === this.model.Country) : null;
        var countryUUID = this.countries.find(x => x.Name === countryName).UUID;
        const filter = new Filter();
        filter.PageResults = false;
        this.processingRequest = true;
        const res = this._geoService.getChildLocations(countryUUID, filter);
        res.subscribe(response => {
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.states = response.Result;
            for(var i = 0; i < this.states.length; i++){
                if(this.states[i].Name.trim() === this.location.State.trim()) {
                    this.states[i].Selected = true;//only way I could get the stupid option selected.
                    this.loadCities(this.states[i].Name);
                    break;
                }
            }

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

    loadCities(stateName) {
        console.log('locations.component.ts loadCities');
        var stateUUID = this.states.find(x => x.Name === stateName).UUID;
        this.processingRequest = true;
        const filter = new Filter();
        filter.PageResults = false;
        const res = this._geoService.getChildLocations(stateUUID, filter);
        res.subscribe(response => {
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.cities = response.Result;
            for(var i = 0; i < this.cities.length; i++){
                if(this.cities[i].Name.trim() === this.location.City.trim()) {
                    this.cities[i].Selected = true;//only way I could get the stupid option selected.
                    break;
                }
            }
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

    filterAccounts(event) {
        console.log('locations.compoentent.ts filterAccounts');
        if ( this.loadingAccounts === true) {
            return;
        }
/*
        this.loadingAccounts = true;
        const filter = new Filter();
        filter.PageResults = true;
        filter.StartIndex = 1;
        filter.PageSize = 25;
        if ( BasicValidators.isNullOrEmpty(event.query) === false) {
            const screen = new Screen();
            screen.Command = 'SearchBy';
            screen.Operator = 'Contains';
            screen.Field = 'Name';
            if( event.query)
               screen.Value = event.query.toLowerCase();

            filter.Screens.push(screen);
        }

        this._accountService.getAllAccounts(filter).subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.filteredAccounts = response.Result;
            this.loadingAccounts = false;
        });
        */
    }

    onSelectAccount(value) {
        console.log('locations.component.ts onSelectAccount');
        this._accountService.getAccount(value.UUID).subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            console.log('selectedAccount LOADED b------------------------------------------------------------------------------------------------');
            this.selectedAccount.Name = value.Name;
            this.selectedAccount.UUID = value.UUID;
            
            if ( BasicValidators.isNullOrEmpty(this.location.Name) === true) {
                this.location.Name = value.Name;
            }
        });
    }

    handleAccountDropdownClick(event) {
        console.log('locations.component.ts handleAccountDropdownClick event:',event);
        if ( this.loadingAccounts === true) {
            return;
        }
        /*
        this.loadingAccounts = true;
        const filter = new Filter();
        filter.PageResults = true;
        filter.StartIndex = 1;
        filter.PageSize = 25;

        // only get accounts the user is a member of, unless they'r admin
        this._accountService.getAllAccounts(filter).subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.filteredAccounts = response.Result;
            this.loadingAccounts = false;
        });
        */
    }
}
