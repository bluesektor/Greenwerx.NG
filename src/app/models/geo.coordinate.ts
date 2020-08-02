import { EventLocation } from './event.location';

export class GeoCoordinate extends EventLocation {
    SearchDistance: number;
    Distance: number;
    Tags: string[]  = [];
    Distances: GeoCoordinate[] = [];
 

}