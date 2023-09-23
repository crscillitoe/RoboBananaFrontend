import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertWithFunction'
})
export class ConvertWithFunctionPipe implements PipeTransform {

  transform<TValue, TReturn>(value: TValue, convertFn: (value: TValue) => TReturn): TReturn {
    return convertFn(value);
  }

}
