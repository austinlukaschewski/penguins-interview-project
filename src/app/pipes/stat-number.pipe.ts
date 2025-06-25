import { Pipe, PipeTransform } from '@angular/core';

import { isNumber, isString } from 'lodash';

@Pipe({
    name: 'statNumber',
    standalone: true,
})
export class StatNumberPipe implements PipeTransform {
    transform(value: number | string, options: PipeOptions): string {
        if (isString(value)) value = parseFloat(value);

        if (isNumber(options.digits)) value = value.toFixed(options.digits);

        return `${value}${options.suffix ?? ''}`;
    }
}

type PipeOptions = { digits?: number; suffix?: string };
