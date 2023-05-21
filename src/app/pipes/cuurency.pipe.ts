import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    // Formatea el valor a un formato de moneda específico
    return '$' + value.toFixed(2);
  }
}
