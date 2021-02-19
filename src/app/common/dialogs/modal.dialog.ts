import { Component, Input, Output, ElementRef, EventEmitter, AfterViewInit, Inject,HostListener } from '@angular/core';
import { MAT_DIALOG_DATA ,MatDialogRef  } from '@angular/material/dialog';

//https://levelup.gitconnected.com/how-to-create-a-reusable-modal-dialog-component-in-angular-8-241cc738d260

//https://itnext.io/building-a-reusable-dialog-module-with-angular-material-4ce406117918

@Component({
  selector: 'gwxmodal-dialog',
  styleUrls: ['./modal.dialog.scss'  ],
  templateUrl: './modal.dialog.html',
  
})
export class ModalDialogComponent   {
  @Input() title: string;
  @Input() width: string;
  @Input() content:string;

 
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    cancelText: string,
    confirmText: string,
    content:string,
    message: string,
    title: string
}, private mdDialogRef: MatDialogRef<ModalDialogComponent>) { 
  this.content = data.content;
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

 