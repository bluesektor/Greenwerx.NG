// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, OnInit, ViewChild, Input, ElementRef  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TableModule, SharedModule, DialogModule, AccordionModule, SelectItem, DropdownModule,
         InputSwitchModule, FileUploadModule, Table} from 'primeng';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { SessionService } from '../services/user/session.service';
import { EquipmentService } from '../services/equipment.service';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { InventoryItem } from '../models/inventory';
import { InventoryService } from '../services/inventory.service';
import { UnitsOfMeasureService } from '../services/unitsofmeasure.service';
import { GeoService } from '../services/geo.service';
import { ProductService } from '../services/product.service';
import { Location } from '../models/location';
import { UnitOfMeasure } from '../models/unitofmeasure';
import {Api} from '../services/api';
import {GetUOMPipe} from '../common/pipes/uom.pipe';
import * as _ from 'lodash';
import { Product } from '../models/product';
import { fromEvent,timer , Observable  } from 'rxjs';

import { delayWhen, map,  debounceTime,
   distinctUntilChanged,switchMap, retryWhen, startWith,tap } from 'rxjs/operators';

@Component({
    selector: 'pm-inventory',
    templateUrl: './inventory.component.html',
  
})


export class InventoryComponent implements OnInit {

    first = 0;
    rows = 10;
    @Input() defaultOnly = 'false';
    locationFilter: Filter = new Filter();

    editedItems: any[]= [];
    inventoryItems: any[] = [];                          // inventoryItems TODO MAKE SURE WHEN LOADING THE UOM is being set.
    totalInventoryItems = 0;

    addingToInventory = false;
    processingRequest = false;
    locations: Location[];

    displayDialog = false;
    dialogTitle = '';
    categories: SelectItem[]= [];

   
    // had to create this for the cbo, and set the name and value to the name.
    // this was because the cbo keeps showing the value after selecting an option.
    unitsOfMeasureOptions: SelectItem[] = [];

    itemGroup = ''; //   Product/Equipment

    itemQuantity = 0;

    editImage = false;


    selectedItemType = '';
    selectedLocationUUID = '';
    selectedLocationType = '';
    selectedUOM = '';

     // ==========================================================    Dialog data
    dlgFirst = 0;
    dlgRows = 10;

    @ViewChild('txtSearch', {static: false}) txtSearchInput: ElementRef;

     selectedCategoryUUID = '';
     availableItems: InventoryItem[];
     productFilter: Filter = new Filter();
     availableItemCount = 0;
     loadingProducts = false;
     nameFilter = '';

    equipment: any[] = [
        { 'name': 'Select one...', 'value': '' },
        { 'name': 'Ballast', 'value': 'Ballast' },
        { 'name': 'Bulb', 'value': 'Bulb' },
        { 'name': 'Custom', 'value': 'Custom' },
        { 'name': 'Fan', 'value': 'Fan' },
        { 'name': 'Filter', 'value': 'Filter' },
        { 'name': 'Plant', 'value': 'Plant' },
        { 'name': 'Pump', 'value': 'Pump' },
        { 'name': 'Vehicle', 'value': 'Vehicle' }
    ];

  
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _equipmentService: EquipmentService,
        private _geoService: GeoService,
        private _productService: ProductService,
        private _inventoryService: InventoryService,
        private _sessionService: SessionService,
        private _unitsOfMeasureService: UnitsOfMeasureService
        ,private msgBox : MessageBoxesComponent
    ) {
       
        this.fileUploadUrl = Api.url + 'api/File/Upload/';
    }

    imageUrl = '';
    imageUrlTmb = '';

    fileUploadUrl = '';
    uploadedFiles: any[] = [];

    ngOnInit() {
        console.log('inventory.component.ts ngOnInit');
        const filter = 
        new Filter();
        filter.PageResults = true;
        filter.StartIndex = 1;
        filter.PageSize = 25;
        
        this.loadLocations('custom');
        this.loadListFilters();

        if(  this._unitsOfMeasureService.unitsOfMeasure === undefined|| 
                this._unitsOfMeasureService.unitsOfMeasure === null ||
                this._unitsOfMeasureService.unitsOfMeasure.length === 0 ){
            this._unitsOfMeasureService.get(filter).subscribe(response => {
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                console.log('invintory.component.ts _unitsOfMeasureService.get',response);
                this._unitsOfMeasureService.unitsOfMeasure= response.Result;
                this.initializeUOMOptions();

            
            });
        }else{
            console.log('invintory.component.ts else');
            this.initializeUOMOptions();
        }
     
    }

    initializeUOMOptions(){
        console.log('invintory.component.ts initializeUOMOptions');
        console.log('invintory.component.ts initializeUOMOptions',this._unitsOfMeasureService.unitsOfMeasure);
        for (let i = 0; i < this._unitsOfMeasureService.unitsOfMeasure.length; i++) {
            console.log('invintory.component.ts initializeUOMOptions name', this._unitsOfMeasureService.unitsOfMeasure[i].Name);
            this.unitsOfMeasureOptions.push({ label: this._unitsOfMeasureService.unitsOfMeasure[i].Name, value: this._unitsOfMeasureService.unitsOfMeasure[i].UUID });
        }
    }

    onBeforeSendFile(event) {

        event.xhr.setRequestHeader('Authorization', 'Bearer ' + Api.authToken);
    }

    onCboChangeUOM(event, itemUUID) {
        let uom = _.find(this._unitsOfMeasureService.unitsOfMeasure, x => x.UUID === event.value);
      
        if (!uom) 
            return;

        let editIndex = this.findEditItemIndex(itemUUID);
        const inventoryIdx = this.findInventoryItemIndex(itemUUID);
        if (editIndex < 0) {
            this.inventoryItems[inventoryIdx].UOMUUID = uom.UUID;
            this.inventoryItems[inventoryIdx].UOM = uom.Name;
            this.editedItems.push(this.inventoryItems[inventoryIdx]);
            editIndex = this.findEditItemIndex(itemUUID);
        } else {
            this.inventoryItems[inventoryIdx].UOMUUID = uom.UUID;
            this.inventoryItems[inventoryIdx].UOM = uom.Name;
            this.editedItems[editIndex].UOMUUID = uom.UUID;
            this.editedItems[editIndex].UOM = uom.Name;
        }
    }

    // We need to check if a custom value was entered.
    // Then add accordingly
    //
    onCboLeaveUOM(event, productUUID) {
        let uom = _.find(this._unitsOfMeasureService.unitsOfMeasure, x => x.UUID === event.value);
      
        // not custom so return
        if (uom || event.currentTarget.value === '') {return; }

        const newUOM = new UnitOfMeasure();
        newUOM.AccountUUID = this._sessionService.CurrentSession.AccountUUID;
        newUOM.Name = event.currentTarget.value;
        newUOM.Category = 'product.weight';

        this._unitsOfMeasureService.add(newUOM).subscribe( response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            // Update all...
            const newUOM = response.Result;
            this._unitsOfMeasureService.unitsOfMeasure.push(newUOM);
            this.unitsOfMeasureOptions.push({ label: newUOM.Name, value: newUOM.Name });
            const inventoryIdx = this.findInventoryItemIndex(productUUID);
            let editIndex = this.findEditItemIndex(productUUID);
            if (editIndex < 0) {
                this.editedItems.push(this.inventoryItems[inventoryIdx]);
                editIndex = this.findEditItemIndex(productUUID);
            }

            this.inventoryItems[inventoryIdx].UOMUUID = newUOM.UUID;
            this.inventoryItems[inventoryIdx].UOM = newUOM.Name;
            this.editedItems[editIndex].UOMUUID = newUOM.UUID;
            this.editedItems[editIndex].UOM = newUOM.Name;
        });
    }

    onImageUpload(event, productUUID) {
        let currFile;
        for (const file of event.files) {
            this.uploadedFiles.push(file);
            currFile = file;
        }

        const idx = this.findInventoryItemIndex(productUUID);
        this.inventoryItems[idx].Image = Api.url + 'Content/Uploads/' + this._sessionService.CurrentSession.AccountUUID + '/' + currFile.name;

    }

    cboItemTypeChange(type) {
        this.selectedItemType = type;
    }

    onRowSelect(event) {

    }

    loadLocations( inventoryType: string, page?: number, pageSize?: number ) {
        this.processingRequest = true;
        let res = null;
        this.locationFilter.PageResults = true;
        this.locationFilter.PageSize = pageSize;
        this.locationFilter.StartIndex = page;
        if (inventoryType === 'custom') {
            // this will only load what was created by the web admin (web store, dispensary...). It won't load states, countries etc.
            res = this._geoService.getCustomLocations( );
        } else {
            res = this._geoService.getLocations(inventoryType, this.locationFilter);
        }

        res.subscribe(response => {
            this.displayDialog = false;
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.locations = response.Result;

            for (let i = 0; i < this.locations.length; i++) {

                if (this.locations[i].isDefault === true) {
                    this.selectedLocationUUID = this.locations[i].UUID;
                    this.loadInventory(this.selectedLocationUUID, 1, 25);
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

    lazyLoadInventoryList(event) {
        console.log('inventory.component.ts lazyLoadInventoryList');
        if (!this.selectedLocationUUID || this.selectedLocationUUID === '') {
            return;
        }

        const idx = this.findSelectedLocationIndex(this.selectedLocationUUID);

        if (idx < 0) {
            return;
        }

        const loc = this.locations[idx];

        this.loadInventory(this.selectedLocationUUID, event.first, event.rows);
        // use the Filter object for sorting
        // in a real application, make a remote request to load data using state metadata from event
        // event.first = First row offset
        // event.rows = Number of rows per page
        // event.sortField = Field name to sort with
        // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        // filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    }

    cboLocationChange(newLocation) {
        this.selectedLocationUUID = newLocation;
        this.loadInventory(newLocation, 1, 25);
    }

    findSelectedLocationIndex(locationUUID: string): number {
        for (let i = 0; i < this.locations.length; i++) {

            if (this.locations[i].UUID === locationUUID) {
                return i;
            }
        }
        return -1;
    }

    loadInventory(locationUUID: string,  page?: number, pageSize?: number) {
        console.log('inventory.component.ts loadInventory');
        this.locationFilter.PageResults = true;
        this.locationFilter.PageSize = pageSize;
        this.locationFilter.StartIndex = page;
        this.processingRequest = true;
        const res = this._inventoryService.getInventory(locationUUID,  this.locationFilter);
        res.subscribe(response => {
            console.log('inventory.component.ts loadInventory response:', response);
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.inventoryItems = response.Result;
            this.totalInventoryItems = response.TotalRecordCount;
        
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

    // (onEditComplete)="onEditValueComplete($event)"
    //
    onEditValue(event: any): void {

        const editIndex = this.findEditItemIndex(event.data.UUID);
        if (editIndex < 0) {
            this.editedItems.push(event.data);

        } else {
            this.editedItems[editIndex] = event.data;
        }

    }

    onEditTemplateValue(event, itemUUID) {

        const inventoryIdx = this.findInventoryItemIndex(itemUUID);
        if (inventoryIdx < 0) {
            return;
        }

        let editIndex = this.findEditItemIndex(itemUUID);

        if (editIndex < 0) {
            this.editedItems.push(this.inventoryItems[this.findInventoryItemIndex(itemUUID)]);
            editIndex = this.findEditItemIndex(itemUUID);
        }
console.log('inventory.component.ts onEditTemplateValue  this.inventoryItems[inventoryIdx]:', this.inventoryItems[inventoryIdx]);
        this.editedItems[editIndex] = this.inventoryItems[inventoryIdx];
    }

    saveEditedItems(event) {
        console.log('inventory.component.ts saveEditedItems');
        this.msgBox.closeMessageBox();

        // after save reload the list incase a system.default.account item had to be cloned as users account
        this.processingRequest = true;
        const res = this._inventoryService.updateItems(this.editedItems);
        res.subscribe(response => {
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.msgBox.ShowMessage('info', 'Inventory updated');
            this.loadInventory(this.selectedLocationUUID, 1, 25);
            this.editedItems = [];

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

    removeItemFromInventory(event, productUUID) {

        this.msgBox.closeMessageBox();
        if (confirm('Are you sure you want to delete this from your inventory?')) {
            this.processingRequest = true;

            this._inventoryService.deleteItem(productUUID).subscribe(response => {
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                let editIndex = this.findEditItemIndex(productUUID);

                if (editIndex >= 0) {
                    this.editedItems[editIndex].Deleted = true;
                } else {
                    editIndex = this.findInventoryItemIndex(productUUID);
                    this.inventoryItems[this.findInventoryItemIndex(productUUID)].Deleted = true;
                    this.editedItems.push(this.inventoryItems[this.findInventoryItemIndex(productUUID)]);
                    editIndex = this.findEditItemIndex(productUUID);
                }
                editIndex = this.findInventoryItemIndex(productUUID);
                this.inventoryItems.splice(editIndex, 1);
                this.loadInventory(this.selectedLocationUUID, 1, 25); // not updating the list so reload for now.
            });
        }
    }

    onRowEditCancel(item: any, index: number) {
        console.log('inventory.component.ts onRowEditCancel');
       //this.cars2[index] = this.clonedCars[car.vin];
        //delete this.clonedCars[car.vin];
    }

    next() {
        console.log('inventory.component.ts next');
        this.first = this.first + this.rows;
    }

    prev() {
        console.log('inventory.component.ts prev');
        this.first = this.first - this.rows;
    }

    reset() {
        console.log('inventory.component.ts reset');
        this.first = 0;
    }

    isLastPage(): boolean {
        console.log('inventory.component.ts isLastPage');
        return this.first === (this.inventoryItems.length - this.rows);
    }

    isFirstPage(): boolean {
        console.log('inventory.component.ts isFirstPage');
        return this.first === 0;
    }

    // ==========================================================    Dialog data
    //
    @ViewChild('lstAvailableItems') lstAvailableItems: Table;
    dlgNext() {
        console.log('inventory.component.ts next');
        this.dlgFirst = this.dlgFirst + this.dlgRows;
     //  this.lstAvailableItems.onPageChange 
    }

    dlgOnPage(event){
        console.log('inventory.component.ts dlgOnPage event:', event);
        this.first = event.first;
        this.rows = event.rows;
         //  event.first: Index of first record
        //event.rows: Number of rows to display in new page
        //event.page: Index of the new page
        //event.pageCount: Total number of pages 
    }
 
    dlgPrev() {
        console.log('inventory.component.ts prev');
        this.dlgFirst = this.dlgFirst - this.dlgRows;
    }

    dlgReset() {
        console.log('inventory.component.ts reset');
        this.dlgFirst = 0;
    }

    dlgIsLastPage(): boolean {
        console.log('inventory.component.ts isLastPage');
        return this.dlgFirst === (this.availableItems.length - this.dlgRows);
    }

    dlgIsdlgFirstPage(): boolean {
        console.log('inventory.component.ts isdlgFirstPage');
        return this.dlgFirst === 0;

        
     //   this.lstAvailableItems.paginator
    }

    showDialogToAdd(group) {
        console.log('inventory.compoent.ts showDialogToAdd group:', group);
        this.msgBox.closeMessageBox();
        this.dialogTitle = group;
        this.itemGroup = group;

        this.loadListFilters();
        this.loadAvailableItems(1, 25);
        this.addingToInventory = true;
        this.displayDialog = true;
       
    }

    close() {
        
        this.displayDialog = false;
    }

    loadListFilters() {

        this.categories = [];

        if (this.itemGroup === 'Equipment') {

            for (let i = 0; i < this.equipment.length; i++) {
                this.categories.push({ label: this.equipment[i].name, value: this.equipment[i].value });
            }
        } else { // Product
            const filter = new Filter();
        
            const res = this._productService.getProductCategories(filter);
            res.subscribe(response => {
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                this.categories.push({ label: 'Select one...', value: '' });

                for (let i = 0; i < response.Result.length; i++) {

                    this.categories.push({ label: response.Result[i].Name, value: response.Result[i].UUID });
                }
            }, err => {
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

    filterByCategory(selected) {
        this.selectedCategoryUUID = selected.value;

        this.initFilters();
        this.loadAvailableItems(1);
    }

    loadAvailableItems(page?: number, pageSize?: number) {
        console.log('inventory.components.ts loadAvailableItems  a');
        if (this.loadingProducts === true) {
            return;
        }
        console.log('inventory.components.ts loadAvailableItems  b:');
        this.availableItemCount = 0;
        this.loadingProducts = true;
        this.productFilter.PageResults = true;
        this.productFilter.PageSize = pageSize;
        this.productFilter.StartIndex = page;

        let res = null;
        if (this.itemGroup === 'Equipment') {
            if (this.selectedCategoryUUID === '') {
                this.selectedCategoryUUID = 'all';
            }
            res = this._equipmentService.getEquipment(this.selectedCategoryUUID, this.productFilter);

        } else {
            res = this._productService.getProducts(this.productFilter);
        }

        res.subscribe(response => {
            console.log('inventory.components.ts loadAvailableItems  response:',response);
            this.loadingProducts = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.availableItems = response.Result;
            this.availableItemCount = response.TotalRecordCount;
           //this.inventoryItems = response.Result;
           //this.totalInventoryItems = response.TotalRecordCount;
            this.initItems();

        }, err => {
            this.loadingProducts = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.clearSession();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }

    loadAvailableItems$(page?: number, pageSize?: number): Observable<any> {

        if (this.loadingProducts === true) {
            return;
        }
        this.initFilters();
        this.availableItemCount = 0;
        this.loadingProducts = true;
        this.productFilter.PageResults = true;
        this.productFilter.PageSize = pageSize;
        this.productFilter.StartIndex = page;

        let res = null;
        if (this.itemGroup === 'Equipment') {
            if (this.selectedCategoryUUID === '') {
                this.selectedCategoryUUID = 'all';
            }
            return this._equipmentService.getEquipment(this.selectedCategoryUUID, this.productFilter);

        } 
        
        return this._productService.getProducts(this.productFilter);

    }

    initItems() {

        for (let i = 0; i < this.availableItems.length; i++) {
            if (this.itemGroup === 'Equipment') {
                this.availableItems[i].CategoryName = this.getCategoryName(this.availableItems[i].UUIDType);
            } else {
                this.availableItems[i].CategoryName = this.getCategoryName(this.availableItems[i].CategoryUUID);
            }
        }
    }

    getCategoryName(productUUID) {
        for (let i = 0; i < this.categories.length; i++) {

            if (this.categories[i].value === productUUID) {
                return this.categories[i].label;
            }
        }
        return '';
    }

    lazyLoadProductsList(event) {
        this.loadAvailableItems( event.first, event.rows );
        // use the Filter object for sorting
        // in a real application, make a remote request to load data using state metadata from event
        // event.first = First row offset
        // event.rows = Number of rows per page
        // event.sortField = Field name to sort with
        // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        // filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    }

    filterProductsByName(filter) {
       
        this.nameFilter = filter;
        console.log('inventory.compent.ts filterProductsByName filter:', filter);
        this.initFilters();
       _.debounce(  
        
            this.loadAvailableItems(1, 25)
           , 600);
        
    }

    initFilters() {
        this.productFilter = new Filter();

        let searchBy = 'UUIDTYPE';

        if (this.itemGroup !== 'Equipment') {
            searchBy = 'CATEGORYUUID';
        }

        let screen = new Screen();
        if (this.selectedCategoryUUID !== '') {
            screen.Command = 'SearchBy';
            screen.Field = searchBy;
            screen.Operator = 'CONTAINS';
            screen.Value = this.selectedCategoryUUID;
            this.productFilter.Screens.push(screen);
        }

        screen = new Screen();
        if (this.nameFilter !== '' && this.nameFilter.length > 2) {
            screen.Command = 'SearchBy';
            screen.Field = 'NAME';
            screen.Operator = 'CONTAINS';
            screen.Value = this.nameFilter;
            this.productFilter.Screens.push(screen);
        }
        this.loadAvailableItems(1, 25);
    }

    addItemToInventory( event , productUUID ) {

        const prodIdx = this.findAvailableItemIndex(productUUID);
        if (prodIdx < 0) {
            return;
        }
        this.processingRequest = true;
        // add to inventory
        const ii =  this.cloneItem(this.availableItems[prodIdx]);
        ii.AccountUUID = this._sessionService.CurrentSession.AccountUUID;
        ii.LocationUUID = this.selectedLocationUUID;
        ii.UUIDType = 'Item';
        ii.Quantity = 0;
        ii.Published = false;
        ii.ReferenceType = this.availableItems[prodIdx].UUIDType;  //   product, item, user, ballast, plant
        ii.ReferenceUUID = productUUID; // id of the item in inventory if we have to break it down to individual items.
        ii.Link = this.availableItems[prodIdx].Link;
        ii.LinkProperties = this.availableItems[prodIdx].LinkProperties;

        const res =  this._inventoryService.addToInventory(ii).subscribe(response => {
            this.displayDialog = false;
            this.processingRequest = false;
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            this.availableItems.splice(prodIdx, 1);   // remove from local availableItems.
            this.inventoryItems.push(ii); // add to inventory locally
            this.loadInventory(this.selectedLocationUUID, 1, 25); // not updating the list so reload for now.
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
  //  ii.Status: string;
        //  ii.CreatedBy: string;
        //  ii.DateCreated: string;
        //  ii.RoleWeight: number;
        //  ii.RoleOperation: string;

    }

    cloneItem(c: InventoryItem): InventoryItem {
        const item = new InventoryItem();
        for (const prop in c) {
            item[prop] = c[prop];
        }
        return item;
    }

    findAvailableItemIndex(productUUID: string): number {
        for (let i = 0; i < this.availableItems.length; i++) {

            if (this.availableItems[i].UUID === productUUID) {
                return i;
            }
        }
        return -1;
    }

    findInventoryItemIndex(productUUID: string): number {
        for (let i = 0; i < this.inventoryItems.length; i++) {

            if (this.inventoryItems[i].UUID === productUUID) {
                return i;
            }
        }
        return -1;
    }

    findEditItemIndex(productUUID: string): number {
        for (let i = 0; i < this.editedItems.length; i++) {

            if (this.editedItems[i].UUID === productUUID) {
                return i;
            }
        }
        return -1;
    }

  
 
}
