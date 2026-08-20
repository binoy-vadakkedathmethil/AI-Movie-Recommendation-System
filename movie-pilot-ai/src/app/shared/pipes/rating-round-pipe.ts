import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingRound'
})
export class RatingRoundPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
      return '0.0';
    }

    return value.toFixed(1);
  }

}
