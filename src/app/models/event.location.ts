import { Node } from './node';

export class EventLocation extends Node {

    constructor() {
       super();
     //  this.City = '';
    }
     Latitude: string;
 
     Longitude: string;
 
     EventUUID: string;
 
     // this replaces the Id field on the insert. the ParentId will reference this.
     RootId: number;
 
     Abbr: string;
 
     Code: string;
 
     CurrencyUUID: number;
 
     LocationType: string;
 
     TimeZone: number;
 
     FirstName: string;
 
     LastName: string;
 
     Address1: string;
 
     Address2: string;
 
     City: string;
 
     State: string;
 
     Country: string;
 
     Postal: string;
 
     Type: number;
 
     Category: string;
 
     Description: string;
 
     IsBillingAddress: boolean;
 
     Virtual: boolean;
 
     isDefault: boolean;
 
     OnlineStore: boolean;
 
     IpNumStart: number;
 
     IpNumEnd: number;
 
     IpVersion: number;
  }
 
  