// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesModule } from '../common/categories.module';
import { MeasuresModule } from '../common/measures.module';
import { TableModule, SharedModule, DialogModule, CheckboxModule  } from 'primeng';
import { MessageBoxesModule } from '../common/messageboxes.module'; //'../messageboxes.module';
import { CategoriesComponent } from './categories.component';
import { GeneralComponent } from './general.component';
import { GeneralRoutingModule } from './general.routing';
import { UnitsOfMeasureComponent } from './unitsofmeasure.component';
import {AttributesComponent} from './attributes.component';
import {PipesModule} from '../common/pipes/pipes.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        CategoriesModule,
        MeasuresModule,
        GeneralRoutingModule,
        MessageBoxesModule,
        TableModule,
        DialogModule,
        SharedModule,
        CheckboxModule,
        PipesModule
    ],
    declarations: [
        CategoriesComponent,
        GeneralComponent,
        UnitsOfMeasureComponent,
        AttributesComponent
    ],
    exports: [
        CategoriesComponent,
        GeneralComponent,
        UnitsOfMeasureComponent,
        AttributesComponent
    ]
})
export class GeneralModule {

}
