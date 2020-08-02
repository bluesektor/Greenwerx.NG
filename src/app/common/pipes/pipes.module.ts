import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {GetUOMPipe} from './uom.pipe';
@NgModule({
  imports: [
    CommonModule,
  //  FormsModule,
   
    TranslateModule.forChild()
  ],
  declarations: [GetUOMPipe ],
  exports: [GetUOMPipe ]
})
export class PipesModule {}




