import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {GetUOMPipe} from './uom.pipe';
import {GetLargeImagePipe} from './image.pipe';
 import {GetImageThumbPipe} from './image.pipe';

@NgModule({
  imports: [
    CommonModule,
  //  FormsModule,
   
    TranslateModule.forChild()
  ],
  declarations: [GetUOMPipe,GetLargeImagePipe,GetImageThumbPipe ],  
  exports: [GetUOMPipe,GetLargeImagePipe,GetImageThumbPipe ]  
})
export class PipesModule {}




