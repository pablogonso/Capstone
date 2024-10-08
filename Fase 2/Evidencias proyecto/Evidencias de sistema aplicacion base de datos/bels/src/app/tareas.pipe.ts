import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tareas',
  standalone: true
})
export class TareasPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
