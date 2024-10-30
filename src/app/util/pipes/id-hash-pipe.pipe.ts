import { Pipe, PipeTransform } from '@angular/core';
import { djb2 } from '../functions/djb2';

@Pipe({
  name: 'idHashSet',
  standalone: true,
})
export class IdHashSetPipe implements PipeTransform {
  transform(value: Set<string>, fieldName: string): Set<string> {
    const hashSet = new Set<string>();
    value.forEach((item) => {
      hashSet.add(djb2(fieldName + item));
    });
    return hashSet;
  }
}

@Pipe({
  name: 'IdHash',
  standalone: true,
})
export class IdHashPipe implements PipeTransform {
  transform(value: string, fieldName: string): string {
    return djb2(fieldName + value);
  }
}
