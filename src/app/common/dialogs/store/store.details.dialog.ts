import { Component, Input,ViewChild, Output,OnInit, ElementRef, EventEmitter, AfterViewInit, Inject,HostListener } from '@angular/core';
import { MAT_DIALOG_DATA ,MatDialogRef  } from '@angular/material/dialog';
import { MessageBoxesComponent } from '../../../common/messageboxes.component';
import { AttributeService } from '../../../services/attribute.service';
import { SessionService } from   '../../../services/user/session.service';
import { Filter } from '../../../models/filter';
import { Screen } from '../../../models/screen';
import {Attribute} from '../../../models/attribute';
import {GetImageThumbPipe} from '../../../common/pipes/image.pipe';
//https://levelup.gitconnected.com/how-to-create-a-reusable-modal-dialog-component-in-angular-8-241cc738d260

//https://itnext.io/building-a-reusable-dialog-module-with-angular-material-4ce406117918

@Component({
  selector: 'store-details-dialog',
  styleUrls: ['../modal.dialog.scss'  ],
  templateUrl: './store.details.dialog.html',
  
})
export class StoreDetailsDialogComponent implements OnInit   {

  @Input() width: string;
  @Input() body:string;
  selectedStore:any;
  public validSession = false;
  attributes:  Attribute[];
  @ViewChild(MessageBoxesComponent) msgBox: MessageBoxesComponent;
 
  constructor(@Inject(MAT_DIALOG_DATA)public data: { store: any  },
   private mdDialogRef: MatDialogRef<StoreDetailsDialogComponent>,
   private attributeService:AttributeService,
   private _sessionService: SessionService,) { 
   this.selectedStore = data.store;
    this.validSession = this._sessionService.validSession();
}

ngOnInit() {

  const filter = new Filter();
  const screen = new Screen();
  screen.Field = 'REFERENCEUUID';
  screen.Command = 'SearchBy';
  screen.Value = this.selectedStore.UUID;
  filter.Screens.push(screen);
  this.attributeService.getAttributes(filter).subscribe(response => {

      if (response.Code !== 200) {
         this.msgBox.ShowMessage(response.Status, response.Message);
          return false;
      }
      this.attributes= response.Result;
  }, err => {
      this.msgBox.ShowResponseMessage(err.status);

      if (err.status === 401) {
          this._sessionService.logOut();
          setTimeout(() => {
          //    this._router.navigate(['/membership/login'], { relativeTo: this._route });
          }, 3000);
      }

  });

}
  public cancel() {
    this.close(false);
  }
  
  public close(value) {
    this.mdDialogRef.close(value);
  }
  public confirm() {
    this.close(true);
  }
  
  @HostListener("keydown.esc") 
  public onEsc() {
    this.close(false);
  }

  
}

 