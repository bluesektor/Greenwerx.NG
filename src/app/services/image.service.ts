// Copyright 2015, 2017 GreenWerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to http://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import { Api } from './api';
import { SessionService } from '../services/user/session.service';
import { Filter } from '../models/filter';
import { Screen } from '../models/screen';
import {FileEx} from '../models/fileex';

@Injectable()
export class ImageService     {
    images:  Array<FileEx> = [];
    queuedImages:  Array<File> = [];
    constructor(private api:Api) {
      
    }
     //   this.fileUploadUrl = Api.url + 'api/File/Upload/';
     
    uploadImage( image: File, UUID: string, type: string) {

      const formData = new FormData();
      formData.append('defaultImage', image);
      /*
      console.log('appending form data:', file);

      if (this.picsReadOnly === true) {
          console.log('gallery is read only, uploads are not allowed.');
          return;
      }
      // if it's new or the default image is empty then set the first image to the default image.
       // todo put a button on gallery to let user select default image
       //
      if (   this.isDefaultSet() === false ) {
          formData.append('defaultImage', file);
          console.log('setting defaultImage');

      } else {

          formData.append('settingImage', file);
          console.log('setting settingImage');
      }
      */
      //  return this.api.uploadForm( 'api/file/upload/' + UUID + '/' + type, form);
      return this.api.uploadForm( 'api/file/upload/' + UUID + '/' + type, formData);
       
    }
/*
     uploadForm(endPoint: string, formData: FormData) {
        const url = Api.url +  endPoint;
        return new Observable(observer => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
    
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
    
                    }
                }
            };
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + Api.authToken);
            xhr.send(formData);
        });
      }*/
    // This add the selected image to the images array so when the
    // user selects save they will be uploaded.
    /*   queueImage(imageEvent) {
     
            // if (imageIndex > 2 || imageIndex < 0) {      console.log('image index out of range:', imageIndex);      return;    }
        
            // if ( this.images.length === this.maxFileUpload  )
            // {  this.messages.publish('app:err', 'Maximum number of images is three.'); return; }
        
            if (!imageEvent.target.files || imageEvent.target.files.length === 0) {
                this.messages.publish('app:err', 'You must select a file to upload.');
              return;
            }
        
            // this.showSpinner(true);
            const self = this;
            const files =  imageEvent.target.files;
        
            for (let i = 0; i < files.length; i++) {
              console.log('processing file:', i);
              const file = files[i];
        
               // Only pics
              if (!file.type.match('image')) {
                console.log('file type is not an image!');
                continue;
              }
              const picReader = new FileReader();
              picReader.addEventListener('load', function(readerEvent) {
                 console.log('addEventListener load');
                 // if (self.images.length < this.maxFileUpload ) {
                    console.log('adding image to queuedImages');
                    self.queuedImages.push(file);            // <=== save for uploading
                    console.log('adding image to images');
                    console.log('readerEvent:', readerEvent);
                    const target = readerEvent.target as any;
                    console.log('target:', target);
                    const targetResult = target.result;
                    console.log('targetResult:', targetResult);
                    const fileex = new FileEx();
                    fileex.data = targetResult;
                    fileex.ImageThumb = targetResult;       // <=== add to dislay
                    self.images.push(fileex);
                    console.log('images complete');
                    // self.showSpinner(false);
                 // }
              });
              console.log('readAsDataURL');
                 // Read the image
              picReader.readAsDataURL(file);
              console.log('readAsDataURL: completed');
             // this.showSpinner(false);
            }
          }
          */
 /*
    uploadImages(closeDialog: boolean) {
             
            console.log('profile-edit.page.ts uploadImages this.queuedImages.length:', this.selectedProfile.UUID, 'Profile');
            for (let i = 0; i < this.queuedImages.length; i++) {
              const formData = new FormData();
              console.log('profile-edit.page.ts uploadImages appending form data:', this.queuedImages[i]);
             // formData.append(i.toString(),files[i]);
        
                  formData.append('settingImage', this.queuedImages[i]);
                  console.log('profile-edit.page.ts uploadImages setting settingImage');
        
            const res = this.profileService.uploadFormEx(formData, this.selectedProfile.UUID, 'Profile');
              res.subscribe(data => {
                const response = data as ServiceResult;
                 // this.showSpinner(false);
                 if (response.Code !== 200) {
                    this.messages.publish('api:err',  response.Message);
                      return false;
                  }
        
                if (this.newProfile === true) {
                    this.messages.publish('api:ok' , 'Profile created.');
                } else {
                    this.messages.publish('api:ok' , 'Profile updated.');
                }
        
                  console.log('profile-edit.page.ts uploadImages image upload response:',  response.Result);
                  if (closeDialog === true) {
                    this.dismiss();
                  }
              }, err => {
                  if (err.status === 401) {
                    // this.messages.publish('user:logout');
                    return;
                  }
                  this.messages.publish('service:err',  err.statusText);
              });
          } // end for loop
          
          }
        */
     /*
           // This uploads the default image
    uploadImageEvent(imageEvent, isDefault: boolean) {
          
            console.log('Clicked to update picture');
        
          //   if ( this.images.length === this.maxFileUpload ) {
              //          this.messages.publish('app:err', 'Maximum number of images is ' + this.maxFileUpload);
              // return;
            // }
        
            if (!imageEvent.target.files || imageEvent.target.files.length === 0) {
              this.messages.publish('app:err', 'You must select a file to upload.');
              return;
            }
        
            this.showWait = true;
            const files =  imageEvent.target.files;
        
            for ( let i = 0; i < files.length; i++) {
              console.log('processing file:', i);
              const file = files[i];
        
                // Only pics
              if (!file.type.match('image')) {
                this.messages.publish('app:err', 'file type is not an image!');
                continue;
              }
        
              const formData = new FormData();
              console.log('appending form data:', file);
        
              if (this.picsReadOnly === true) {
                  console.log('gallery is read only, uploads are not allowed.');
                  return;
              }
              // if it's new or the default image is empty then set the first image to the default image.
                // todo put a button on gallery to let user select default image
                //
              if ( isDefault === true ) {
                  formData.append('defaultImage', file);
                  console.log('setting defaultImage');
              } else {
        
                  formData.append('settingImage', file);
                  console.log('setting settingImage');
              }
        
            const res = this.profileService.uploadFormEx(formData, this.selectedProfile.UUID, 'Profile' );
            res.subscribe(data => {
              const response = data as ServiceResult;
              this.showWait = false;
        
                if (response.Code !== 200) {
                  this.messages.publish('service:err', response.Message);
                    return false;
                }
                console.log('image upload response:',  response.Result);
                this.images.push(response.Result);
                this.selectedProfile.Image = response.Result.ImageThumb;
              }, err => {
                this.showWait = false;
        
        
                if (err.status === 401) {
                  // this.messages.publish('user:logout');
                  return;
                }
                this.messages.publish('service:err', err.statusText, 4);
            });
            }
        }
          */
  
}
