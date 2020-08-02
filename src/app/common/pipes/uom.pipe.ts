import { Pipe, PipeTransform } from '@angular/core';
import { UnitsOfMeasureService } from '../../services/unitsofmeasure.service';
import { Filter } from '../../models/filter';
import { Screen } from '../../models/screen';
import * as _ from 'lodash';
 
@Pipe({
    name: 'getUOMName',
    pure: true
  })

  export class GetUOMPipe implements PipeTransform {

     constructor( private _unitsOfMeasureService: UnitsOfMeasureService) {
         console.log('uom.pipe.ts constructor');
         this.loadMeasures();
      }

    transform(value: string, args?: any): any {
        if( value === '' ||
            value === undefined ||
            value === '0' ||
            value === null )
            return 'Invalid UOM ID';
                
            console.log('uom.pipe.ts transform value:', value);
      return this.geUOMName(value );

    }

    geUOMName(uomUUID: string ): String {
        console.log('uom.pipe.ts getUOMName uomUUID:', uomUUID);

        let uom = _.find(this._unitsOfMeasureService.unitsOfMeasure, x => x.UUID === uomUUID);
        if(uom)
            return uom.Name;

        uom = this.getMeasure(uomUUID);
        if(uom && uom !== false)
            return uom.Name;

      return 'uom not found';
    }

    loadMeasures(){
        if( this._unitsOfMeasureService.unitsOfMeasure === undefined || 
            this._unitsOfMeasureService.unitsOfMeasure === null ){
            const filter = new Filter();
            filter.PageResults = true;
            filter.StartIndex = 1;
            filter.PageSize = 25;
    
            this._unitsOfMeasureService.get(filter).subscribe(response => {
                if (response.Code !== 200) {
                    console.log('uom.pipe.ts _unitsOfMeasureService.get error:', response.Message);
                    return false;
                }
                this._unitsOfMeasureService.unitsOfMeasure = response.Result;
            });
        }
    }

    getMeasure(uuid:string){
        if(!uuid )
            return false;

        this._unitsOfMeasureService.getByUUID(uuid).subscribe(response =>
            {
                if (response.Code !== 200) {
                    console.log('uom.pipe.ts _unitsOfMeasureService.getByUUID error:', response.Message);
                    return false;
                }
                console.log('uom.pipe.ts _unitsOfMeasureService.getByUUID response:', response);
                this._unitsOfMeasureService.unitsOfMeasure.push(response.Result);
                return response.Result;
            })
    }
}
