import {  Injectable, OnInit } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Product } from  '../models/product';
import {Api} from './api';
import {Filter} from '../models/filter';


@Injectable({
    providedIn: 'root'
  })
export class ProductService {

    constructor(private api:Api) { }
 
    getProductCategories(filter: Filter) {
      return this.api.invokeRequest('GET', 'api/Products/Categories' ,filter    );
  }

  addProduct(product) {
      return this.api.invokeRequest('POST', 'api/Products/Add', product);
  }

  deleteProduct(productUUID) {
      return this.api.invokeRequest('DELETE', 'api/Products/Delete/' + productUUID, ''    );
  }

  getProducts(filter: Filter) {
      return this.api.invokeRequest('POST', 'api/Products' ,filter );
  }

  getProduct(productId) {
      return this.api.invokeRequest('GET', 'api/ProductsBy/' + productId, ''    );
  }

  getProductDetails(productId, productType) {
      return this.api.invokeRequest('GET', 'api/Product/' + productId + '/' + productType + '/Details' , ''    );
  }

  updateProduct(product) {
      return this.api.invokeRequest('PATCH', 'api/Products/Update', product);
  }

    // ===--- Vendors ---===
    addVendor(vendor) {
      return this.api.invokeRequest('POST', 'api/Vendors/Add', vendor);
  }

  getVendors(filter?: Filter) {

      return this.api.invokeRequest('GET', 'api/Vendor' ,filter );
  }

  deleteVendor(vendorUUID) {
      return this.api.invokeRequest('DELETE', 'api/Vendors/Delete/' + vendorUUID, ''    );
  }

  updateVendor(vendor) {
      return this.api.invokeRequest('PATCH', 'api/Vendors/Update', vendor);
  }
}
