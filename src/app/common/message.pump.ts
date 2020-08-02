import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';

/**
 * A custom Events service just like Ionic 3 Events https://ionicframework.com/docs/v3/api/util/Events/ which got removed in Ionic 5.
 *
 * @author Shashank Agrawal
 *   //    this.notifications.subscribe('user:created', (data: any) => {
    //        console.log('Welcome', data.user, 'at', data.time);
     //   });

      //  this.notifications.publish('foo:user:logged-out', {
     //       user: any,
         //   time: new Date()
      //  });
 */
@Injectable({
    providedIn: 'root'
})
//this was Events then NotificationService.
//There's already a notifications service and Event(s) so this is a throwback to windows 
//
export class MessagePump{  

    private channels: { [key: string]: Subject<any>; } = {};

    /**
     * Subscribe to a topic and provide a single handler/observer.
     * @param topic The name of the topic to subscribe to.
     * @param observer The observer or callback function to listen when changes are published.
     *
     * @returns Subscription from which you can unsubscribe to release memory resources and to prevent memory leak.
     */
    subscribe(topic: string, observer: (_: any) => void): Subscription {
        if (!this.channels[topic]) {
            this.channels[topic] = new Subject<any>();
        }

        return this.channels[topic].subscribe(observer);
    }

    /**
     * Publish some data to the subscribers of the given topic.
     * @param topic The name of the topic to emit data to.
     * @param data data in any format to pass on.
     */
    publish(topic: string, data: any): void {
        const subject = this.channels[topic];
        if (!subject) {
            // Or you can create a new subject for future subscribers
            return;
        }

        subject.next(data);
    }

    /**
     * When you are sure that you are done with the topic and the subscribers no longer needs to listen to a particular topic, you can
     * destroy the observable of the topic using this method.
     * @param topic The name of the topic to destroy.
     */
    destroy(topic: string): null {
        const subject = this.channels[topic];
        if (!subject) {
            return;
        }

        subject.complete();
        delete this.channels[topic];
    }
}
/*
this was original code that was lost now found.. Implement?
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppEventsService {
    private subject = new Subject<any>();

    sendMessage(message: string) {
        this.subject.next({ text: message });
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}

//Implementation of AppEventsService above. Looks more flexible. todo review..

      this.subscription = this._events.getMessage().subscribe(message => {
        console.log('app.component.ts event received message:', message);
        this.message = message;
        switch (message.text) {
            case 'user:login':
                 console.log('app.component.ts subscription user:login');
                 this.userIsLoggedIn = this._sessionService.validSession();
                 console.log('app.component.ts subscription  this.userIsLoggedIn:',  this.userIsLoggedIn);
                 this.userIsAdmin = this._sessionService.isUserInRole('ADMIN');
                 if (this.userIsAdmin === false) {
                     this.userIsAdmin = this._sessionService.isUserInRole('OWNER');
                 }
                 console.log('app.component.ts subscription  this.userIsAdmin:',  this.userIsAdmin);
                 break;
            case 'user:logout':
             console.log('app.component.ts subscription user:logout');
            break;
            default:
            console.log('app.component.ts subscription default');
            break;
        }
     });
*/