import { MatDialog,MAT_DIALOG_DATA ,MatDialogRef  } from '@angular/material/dialog';
import { ModalDialogComponent } from './modal.dialog';
import {StoreDetailsDialogComponent} from './store/store.details.dialog';
import { Observable, of as observableOf } from 'rxjs';
import { filter, throttleTime, map, tap, merge,    take, timeoutWith, switchMap, distinctUntilChanged, 
    share, takeUntil, debounceTime } from "rxjs/operators";
//import * as _ from 'lodash';

export class  DialogService {  
  
    constructor(private dialog: MatDialog,
       ) { 

        }  
       // dialogRef: MatDialogRef<ModalDialogComponent>; 
       dialogRef: any;
    
    public open(type:string, args) {
      switch(type){
        case 'store.detail':
          this.dialogRef = this.dialog.open(StoreDetailsDialogComponent, { data:{
              store: args
          }} );
          break;
      }
    
     /*
      if(!args){
         this.dialogRef = this.dialog.open(ModalDialogComponent  );
       }else{
        this.dialogRef = this.dialog.open(ModalDialogComponent, {    
            data: {
              title: args.title,
              content: args.content,
              message: args.message,
              cancelText: args.cancelText,
              confirmText: args.confirmText
            }
        });
      }  */

      this.dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }  


    public confirmed(): Observable<any> {
        return this.dialogRef.afterClosed().pipe(take(1), map(res => {
            return res;
          }
        ));
    }

    public close(){
      this.dialogRef.close();
    }
}