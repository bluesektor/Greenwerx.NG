import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
// import 'rxjs/add/observable';
import { tap } from 'rxjs/operators';
import { AppSetting } from  '../app.settings';
import { ServiceResult } from  '../models/serviceresult';

@Injectable({
    providedIn: 'root'
  })
 
export class Api implements OnInit {
    static authToken: string;
   // url: string; // see environment.ts

    static url: string;


  constructor(protected http: HttpClient,
   // public events: Events,
    private appSettings: AppSetting
    ) {
    Api.url = 'https://localhost:44318/';
    // Api.url =   'https://greenwerx.org/'; // PROD
    // url:   'https://localhost:44311/';// <= .net core

       // console.log('api.ts ngOnInit this.url:', Api.url);
    }
 private handleError(arg: string) {
    console.log('api.ts handlError arg:', arg);
    return new Observable(observer => {
        observer.error(arg); 
    });
 }

 downloadFile(url: string): Observable<Object> {// Observable<HttpResponse<Text>> {
    return this.http.get(url , { responseType: 'text' } );

 }

 invokeRequest(verb: string, endPoint: string, parameters?: any  ): Observable<any> {

    const url = Api.url +  endPoint;

   // console.log('api.ts invokeRequest this.url:', Api.url);
  //  console.log('api.ts invokeRequest endPoint:', endPoint);
  //  console.log('api.ts invokeRequest parameters:', parameters);
    let request = null;

    switch (verb.toLowerCase()) {
        case 'get':
        //    console.log('api.ts invokeRequest GET');
            request =  this.http.get(url,
                { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.authToken}})
                .pipe(tap(_ =>console.log('api.ts get url:', url)));
               
                break;
        case 'post':
         //   console.log('api.ts invokeRequest POST');
            request =   this.http.post(url,  parameters,
                { headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.authToken}})
                .pipe(
                    tap(_ =>console.log('api.ts get url:', url)) );
                break;
        case 'patch':
          //  console.log('api.ts invokeRequest PATCH');
            request =   this.http.patch(url, parameters,
                { headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.authToken}});
                break;
        case 'put':
            request =   this.http.put(url, parameters,
                { headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.authToken}});
                break;
        case 'delete':
            request =   this.http.delete(url,
                { headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.authToken }})
                    .pipe(tap(_ =>
                        console.log('api.ts get url:', url))
                    );
                break;
    }

   // if (!request) {// todoredo
     ///   this.events.publish('api:err', 401 , 'Bad request');todoredo
   //     return  observableOf(new ServiceResult()  { });
   // }
    return request;
    // .pipe(        timeoutWith(5000, Observable.throw(new Error('Failed call api.'))
    //  )).catch(this.requestTimedOut);
  }


    ngOnInit() {
    }

  requestTimedOut() {
      console.log('api.ts requestTimedOut <<XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  }

  uploadFile(endPoint: string, files: File[]) {
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

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            console.log('appending form data:', files[i]);
            if (i === 0) {
                formData.append('file', files[i]);
                console.log('setting defaultFile true');
                formData.append('defaultFile', 'true');
            } else {
                formData.append('file', files[i]);
                console.log('setting defaultFile false');
                formData.append('defaultFile', 'false');
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + Api.authToken);
            xhr.send(formData);
        }
    });
  }

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
  }
}


