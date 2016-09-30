import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
        var v = '';
        if (value[key] === true || value[key] === false) {
            v = '';
        } else {
            v = value[key];
        }
      keys.push( {key: key, value:v  } );
    }
    return keys;
  }
}