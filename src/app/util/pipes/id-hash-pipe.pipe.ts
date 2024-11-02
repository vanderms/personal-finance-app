import { Pipe, PipeTransform } from '@angular/core';
import { djb2 } from '../misc/djb2';

@Pipe({
  name: 'idHashSet',
  standalone: true,
})
export class IdHashSetPipe implements PipeTransform {
  transform(value: Set<string>, fieldName: string): string {
    return [...value].map((item) => `id-${fieldName}-${djb2(item)}`).join(' ');
  }
}

@Pipe({
  name: 'IdHash',
  standalone: true,
})
export class IdHashPipe implements PipeTransform {
  transform(value: string, fieldName: string): string {
    return `id-${fieldName}-${djb2(value)}`;
  }
}
