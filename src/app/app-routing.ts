import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';
import { ContactFormComponent } from './contact-form.component';
import { TermsComponent } from './terms.component';
import { InstallComponent } from './install.component';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { CategoriesComponent } from './common/categories.component';

const routes: Routes = [
  { path: 'system', loadChildren: 'src/app/system/system.module#SystemModule' },
  { path: 'utilities', loadChildren: 'src/app/utilities/utilities.module#UtilitiesModule' },
  { path: 'finance', loadChildren: 'src/app/finance/finance.module#FinanceModule' },
  { path: 'general', loadChildren: 'src/app/general/general.module#GeneralModule' },
  { path: 'membership', loadChildren: 'src/app/membership/api/api.module#APIModule' },
  { path: 'membership', loadChildren: 'src/app/membership/roles/roles.module#RolesModule' },
  { path: 'membership', loadChildren: 'src/app/membership/accounts/accounts.module#AccountsModule' },
  { path: 'membership', loadChildren: 'src/app/membership/users/users.module#UsersModule' },
  { path: 'assets', loadChildren: 'src/app/store/store.module#StoreModule' },
  { path: 'assets', loadChildren: 'src/app/plants/plants.module#PlantsModule' },
  { path: 'store', loadChildren: 'src/app/inventory/inventory.module#InventoryModule' },
  { path: 'assets', loadChildren: 'src/app/geo/geo.module#GeoModule' },
  { path: 'store', loadChildren: 'src/app/store/store.module#StoreModule' },
  { path: 'events', loadChildren: 'src/app/events/events.module#EventsModule' },
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactFormComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'install', component: InstallComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, 
    //{ enableTracing:true }
    )],
  
  exports: [RouterModule]
})
export class AppRoutingModule {}
