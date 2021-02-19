// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Component, ViewChild, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBoxesComponent } from '../common/messageboxes.component';
import { BasicValidators } from '../common/basicValidators';
import { SessionService } from '../services/user/session.service';
import { PlantsService } from '../services/plants.service';
import { ImageService } from '../services/image.service';
import { AccountService } from '../services/user/account.service';
import { CheckboxModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import {
    ConfirmDialogModule, ConfirmationService, AutoCompleteModule,
    AccordionModule, SelectItem, DropdownModule
} from 'primeng/primeng';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import { ProductService } from '../services/product.service';
import { CategoriesService } from '../services/categories.service';
import { UnitsOfMeasureService } from '../services/unitsofmeasure.service';
import {GetImageThumbPipe } from '../common/pipes/image.pipe';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { Location } from '../models/location';
import { GeoService } from '../services/geo.service';
import { Strain } from '../models/strain';
import {Api} from '../services/api';
import { ServiceResult } from '../models';


@Component({
    templateUrl: './products.component.html',

})
export class ProductsComponent implements OnInit {

    loadingData = false;
    deletingData = false;
    displayDialog = false;
    product: Product = new Product();
    selectedCategoryUUID: string;
    newProduct = false;
    products: Product[];
    categories: Category[];
    departments: Category[];
    selectedDepartmentUUID: string;
    selectedLocationtUUID = '';
    locations: Location[];
    totalRecords: number;
    formProductDetail: FormGroup;
    selectedStrainName: string;
    strains: Strain[] = [];
    strainOptions: SelectItem[] = [];
    searchStrains: Filter = new Filter();
    // =======----- Manufacturer -----========
    selectedManufacturerName: string;
    filteredAccounts: Account[] = [];
    searchAccountsFilter: Filter = new Filter();

    // ===--- Picture upload ---===
    editImage = false;
    uploadedFiles: any[] = [];
    imageUrl = '';
    imageUrlTmb = '';

    // ===--- Top Menu Bar ---===
    productActiveProduct = false;
    msgs: any[] = [];

    // =======----- Units of Measure-----========
   // = '';
    unitsOfMeasure: any[] = [];
    // had to create this for the cbo, and set the name and value to the name.
    // this was because the cbo keeps showing the value after selecting an option.
    unitsOfMeasureOptions: SelectItem[] = [];

    @ViewChild(MessageBoxesComponent) msgBox: MessageBoxesComponent;

    constructor(fb: FormBuilder,
        private _productService: ProductService,
        private _geoService: GeoService,
        private _confirmationService: ConfirmationService,
        private _sessionService: SessionService,
        private _categoriesService: CategoriesService,
        private _accountService: AccountService,
        private _plantsService: PlantsService,
        private _unitsOfMeasureService: UnitsOfMeasureService,
        private _router: Router,
        private _imageService:ImageService,
        private _route: ActivatedRoute) {

        this.formProductDetail = fb.group({
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
        this.loadDepartments();
        this.loadLocations();
        this.loadStrains();
    }

    onTabShow(e) {
        switch (e.index) {
            case 1:
                break;
            case 2: // set the strain name and manufacturer name

                if (this.product.StrainUUID) {
                    this._plantsService.getStrain(this.product.StrainUUID).subscribe(response => {
                        if (response.Code !== 200) {
                            this.msgBox.ShowMessage(response.Status, response.Message);
                            return false;
                        }
                        this.selectedStrainName = response.Result.Name;
                    });
                }
                if (this.product.ManufacturerUUID) {
                    this._accountService.getAccount(this.product.ManufacturerUUID).subscribe(response => {
                        if (response.Code !== 200) {
                            this.msgBox.ShowMessage(response.Status, response.Message);
                            return false;
                        }
                        this.selectedManufacturerName = response.Result.Name;
                    });
                }
                break;
            case 3: // Pricing
                const filter = new Filter();
                filter.PageResults = true;
                filter.StartIndex = 1;
                filter.PageSize = 25;

                this._unitsOfMeasureService.get(filter).subscribe(response => {
                    if (response.Code !== 200) {
                        this.msgBox.ShowMessage(response.Status, response.Message);
                        return false;
                    }
                    this.unitsOfMeasure = response.Result;
                    for (let i = 0; i < this.unitsOfMeasure.length; i++) {
                        this.unitsOfMeasureOptions.push({ label: response.Result[i].Name, value: response.Result[i].UUID });
                
                    }

                });
                break;
        }
    }

    onBeforeSendFile(event) {

        event.xhr.setRequestHeader('Authorization', 'Bearer ' + Api.authToken  );
    }

    onImageUpload(files, product) {
        const formData = new FormData();
       
        let currFile = files.item(0);
        console.log(currFile);
        this._imageService.uploadImage(currFile, product.UUID ,'Product')
            .subscribe(data =>{
                const response = data as ServiceResult;

                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }

                console.log('image upload response:',  response.Result);
               product.Image = response.Result.ImageThumb;

        });
        /*
        let currFile;
        for (const file of event.files) {
            this.uploadedFiles.push(file);
            currFile = file;
        }
        this.product.Image = Api.url + 'Content/Uploads/' +
            this._sessionService.CurrentSession.AccountUUID + '/' + currFile.name;
            */
    }

    // ===--- Top Menu Bar ---===

    loadCategoriesDropDown() {
        this.loadingData = true;
        const filter = new Filter();
        const screen = new Screen();
        screen.Field = 'CategoryType';
        screen.Command = 'SearchBy';
        screen.Value = 'Product';
        filter.Screens.push(screen);

        const res = this._productService.getProductCategories(filter);
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
                this._sessionService.logOut();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }

    cboCategoryChange(categoryUUID) {
        this.selectedDepartmentUUID = '';
        this.selectedCategoryUUID = categoryUUID;
        this.loadProducts(categoryUUID);
    }

    cboDepartmentChange(departmentUUD) {

        this.selectedCategoryUUID = '';
        this.selectedDepartmentUUID = departmentUUD;
        this.loadProductsByDepartment(departmentUUD);
    }

    loadDepartments(page?: number, pageSize?: number) {
        const filter = new Filter();
        if (page && pageSize) {
            filter.PageResults = true;
            filter.StartIndex = page;
            filter.PageSize = pageSize;
        }
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

            this.departments = response.Result;

            const c = new Category();
            c.UUID = '';
            c.Name = 'Select a department';
            this.departments.push(c);

            this.selectedDepartmentUUID = '';

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

    loadProductsByDepartment(departmentUUD: string, page?: number, pageSize?: number) {

        if (departmentUUD == null || departmentUUD === '') {
            return;
        }

        const filter = new Filter();
        filter.PageResults = true;
        filter.StartIndex = page;
        filter.PageSize = pageSize;
        const screen = new Screen();
        screen.Command = 'SearchBy';
        screen.Field = 'DEPARTMENT';
        screen.Value = departmentUUD;
        filter.Screens.push(screen);


        const res = this._productService.getProducts(filter);
        res.subscribe(response => {
            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            this.products = response.Result;
            this.totalRecords = response.TotalRecordCount;
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
                this._sessionService.logOut();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }

        });
    }

    onClickDeleteProduct() {

        if (confirm('Are you sure you want to delete ' + this.product.Name + '?')) {
            this.deleteProduct(this.product.UUID);
        }
    }

    deleteProduct(productUUID) {
        this.msgBox.closeMessageBox();
        this.deletingData = true;
        const res = this._productService.deleteProduct(productUUID);

        res.subscribe(response => {
            
            this.deletingData = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }

            this.msgBox.ShowMessage('info', 'Product deleted.');
            const index = this.findSelectedIndex(this.product);
            // Here, with the splice method, we remove 1 object
            // at the given index.
            this.products.splice(index, 1);
            this.loadProducts(this.selectedCategoryUUID, 1, 25);  // not updating the list so reload for now.
       //todo implement   this._cdr.detectChanges(); and remove the load function
        }, err => {
            this.deletingData = false;
            if (err.status === 401) {
                this._sessionService.logOut();
                this.msgBox.ShowMessage('error', err.status + ' Session expired.');

                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            } else {

                this.msgBox.ShowMessage('error', err.status + ' Failed to connect. Check your connection or try again later.');
            }
        });

    }

    lazyLoadProductsList(event) {
        this.loadProducts(this.selectedCategoryUUID, event.first, event.rows);

    }

    loadProducts(categoryUUID: string, page?: number, pageSize?: number) {

        if (categoryUUID == null || categoryUUID === '') {
            return;
        }
        this.loadingData = true;
        const filter = new Filter();
        filter.PageResults = true;
        filter.StartIndex = page;
        filter.PageSize = pageSize;
        const screen = new Screen();
        screen.Command = 'SearchBy';
        screen.Field = 'CATEGORYUUID';
        screen.Value = categoryUUID;
        filter.Screens.push(screen);

        const res = this._productService.getProducts(filter);
        res.subscribe(response => {
            if (response.Code !== 200) {
                this.loadingData = false;
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            this.loadingData = false;
            this.products = response.Result;
            this.totalRecords = response.TotalRecordCount;
        }, err => {
            this.msgBox.ShowResponseMessage(err.status);
            this.loadingData = false;
            if (err.status === 401) {
                this._sessionService.logOut();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }
        });
    }

    showDialogToAdd() {
        this.newProduct = true;
        this.product = new Product();
        this.displayDialog = true;
    }

    cancel() {
        this.displayDialog = false;
    }

    onRowSelect(event, data) {
        this.newProduct = false;
        this.product = this.cloneProduct(data);
        this.displayDialog = true;
    }

    cloneProduct(c: Product): Product {
        const product = new Product();
        for (const prop in c) {
            product[prop] = c[prop];
        }
        return product;
    }

    findSelectedIndex(product): number {
        for (let i = 0; i < this.categories.length; i++) {

            if (this.products[i].UUID === product.UUID) {
                return i;
            }
        }
        return -1;
    }

    saveProduct() {
        this.loadingData = true;
        this.msgBox.closeMessageBox();

        let res;

        if (this.newProduct === true) {
            res = this._productService.addProduct(this.product);
        } else {
            res = this._productService.updateProduct(this.product);
        }

        res.subscribe(response => {

            this.loadingData = false;
            this.displayDialog = false;

            if (response.Code !== 200) {
                this.msgBox.ShowMessage(response.Status, response.Message);
                return false;
            }
            if (this.newProduct) {
                this.msgBox.ShowMessage('info', 'Product added.');
                this.product.UUID = response.Result.UUID;
                this.newProduct = false;
                this.products.push(this.product);

            } else {
                this.msgBox.ShowMessage('info', 'Product updated.');
                this.products[this.findSelectedIndex(this.product)] = this.product;
            }
            this.loadProducts(this.selectedCategoryUUID, 1, 25);  // not updating the list so reload for now.
              //todo implement   this._cdr.detectChanges(); and remove the load function
        }, err => {
            this.loadingData = false;
            this.msgBox.ShowResponseMessage(err.status);

            if (err.status === 401) {
                this._sessionService.logOut();
                setTimeout(() => {
                    this._router.navigate(['/membership/login'], { relativeTo: this._route });
                }, 3000);
            }
        });
    }

    onSearchStrains(event) {
        console.log('products.compoentent.ts onSearchStrains');
        if (!event.query || event.query.length < 2) {
            return;
        }

        this.searchStrains.Screens = [];
        const screen = new Screen();
        screen.Command = 'SearchBy';
        screen.Operator = 'Contains';
        screen.Field = 'Name';
        if( event.query)
         screen.Value = event.query.toLowerCase();
        this.searchStrains.Screens.push(screen);
       
    }

    handleStrainsDropdownClick(event) {
        this.searchStrains.Screens = [];

        this.searchStrains.PageResults = false;
   
      
    }

    onSelectStrain(value) {
        this.product.StrainUUID = value.UUID;
        this.selectedStrainName = value.Name;
    }

    loadStrains() {

        
            this._plantsService.getStrains(this.searchStrains).subscribe(response => {
                if (response.Code !== 200) {
                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                this.strains = response.Result;
                this.totalRecords = response.TotalRecordCount;
                
                for (let i = 0; i < this.strains.length; i++) {
                    this.strainOptions.push({ label: this.strains[i].Name, value: this.strains[i].UUID });
                }
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

    // =======----- Manufacturer -----========

    filterAccounts(event) {
        console.log('products.compoentent.ts filterAccounts');
        this.searchAccountsFilter.Screens = [];
        this.searchAccountsFilter.PageResults = true;
        this.searchAccountsFilter.StartIndex = 1;
        this.searchAccountsFilter.PageSize = 25;
        const screen = new Screen();
        screen.Command = 'SearchBy';
        screen.Operator = 'Contains';
        screen.Field = 'Name';
        if( event.query)
            screen.Value = event.query.toLowerCase();

        this.searchAccountsFilter.Screens.push(screen);
        this.loadAccounts();
    }

    onSelectAccount(value) {
        this.product.ManufacturerUUID = value.UUID; // value.SyncKey;
        this.product.ManufacturerUUIDType = 'Account';
        this.selectedManufacturerName = value.Name;

    }

    handleAccountDropdownClick(event) {
        this.searchAccountsFilter.Screens = [];
        this.searchAccountsFilter.PageResults = true;
        this.searchAccountsFilter.StartIndex = 1;
        this.searchAccountsFilter.PageSize = 25;

        this.loadAccounts();
    }

    loadAccounts() {
        this.loadingData = true;
        setTimeout(() => {
            this._accountService.getAllAccounts(this.searchAccountsFilter).subscribe(response => {
                this.loadingData = false;
                if (response.Code !== 200) {

                    this.msgBox.ShowMessage(response.Status, response.Message);
                    return false;
                }
                this.filteredAccounts = response.Result;
            });
        }, 1000);
    }


    // =======----- Units of Measure-----========

    onCboChangeUOM(event) {
        this.product.UOMUUID = event;
    }

    getUOMName(uomUUID: string): string {
        for (let i = 0; i < this.unitsOfMeasure.length; i++) {

            if (this.unitsOfMeasure[i].UUID === uomUUID) {
                return this.unitsOfMeasure[i].Name;
            }
        }
        return '';
    }
}
