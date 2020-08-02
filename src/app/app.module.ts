import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  

// import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// 3rd Party
import { StepsModule, PanelMenuModule, CheckboxModule, ChartModule, ConfirmationService } from 'primeng';
import {PanelModule} from 'primeng/panel';
// Components
import { AboutComponent } from './about.component';
import { PreventUnsavedChangesGuard} from './prevent-unsaved-changes-guard.service';
import { CommonModuleEx } from './common/common.moduleex';
import { ContactFormComponent } from './contact-form.component';
import { HomeComponent } from './home.component';
import { InstallComponent } from './install.component';
import { NavBarAdminComponent } from './navbar.admin.component';
import { NavBarDefaultComponent } from './navbar.default.component';
import {CartDropdownComponent} from './store/cart.dropdown.component';
import { NotFoundComponent } from './not-found.component';
import { TermsComponent } from './terms.component';

import { PrivacyPolicyComponent } from './privacy-policy.component';

// Services
import { SessionService } from './services/user/session.service';
import {AppService} from './services/app.service';

import {FinanceService} from './services/finance.service';
import {GeoService}  from './services/geo.service';
import { MessageBoxesModule } from './common/messageboxes.module';
import { StoreService } from './services/store.service';
import {PlantsService} from './services/plants.service';
import {RoleService} from './services/roles.service';
import { EquipmentService } from './services/equipment.service';
import { InventoryService } from './services/inventory.service';
import { UnitsOfMeasureService } from './services/unitsofmeasure.service';
import { ProductService } from './services/product.service';
//Modules
import { AccountsModule } from './membership/accounts/accounts.module';
import { SystemModule } from './system/system.module';
import { UtilitiesModule } from './utilities/utilities.module';
import { StoreModule } from './store/store.module';
import {EventsModule} from './events/events.module';
import { FinanceModule } from './finance/finance.module';
import { GeneralModule } from './general/general.module'; 
import { GeoModule } from './geo/geo.module';
import { InventoryModule } from './inventory/inventory.module';
import { PlantsModule } from './plants/plants.module';
import { RolesModule } from './membership/roles/roles.module';
import { APIModule } from './membership/api/api.module';
import { UsersModule } from './membership/users/users.module';
import { GraphsModule } from './common/graphs.module';

 
@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CartDropdownComponent,
    ContactFormComponent,
    HomeComponent,
    InstallComponent,
    NavBarAdminComponent,
    NavBarDefaultComponent,
    NotFoundComponent,
    PrivacyPolicyComponent,
    TermsComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MessageBoxesModule,
    BrowserAnimationsModule,
    CommonModuleEx,
    FormsModule,
    PanelMenuModule,
    PanelModule,
    ReactiveFormsModule,
    StepsModule,
    HttpClientModule ,
    AccountsModule,
    APIModule,
    SystemModule,
    UtilitiesModule,
    StoreModule,
    EventsModule,
    UsersModule,
    InventoryModule,
    GeneralModule,
    FinanceModule,
    RolesModule,
    GeoModule,
    PlantsModule,
    CheckboxModule,
    HttpClientModule,
    ChartModule,
    GraphsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  ],
  providers: [AppService, FinanceService,GeoService, 
    EquipmentService, InventoryService, ProductService,
    StoreService,UnitsOfMeasureService,PreventUnsavedChangesGuard,
    ConfirmationService,
    PlantsService, RoleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

