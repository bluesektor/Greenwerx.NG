import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NodeListsComponent} from './node.lists.component';

@NgModule({
    imports: [
        CommonModule,
      
  ],
    declarations: [
        NodeListsComponent
    ],
    exports: [
        NodeListsComponent
    ]
})
export class NodeListsModule {
}
