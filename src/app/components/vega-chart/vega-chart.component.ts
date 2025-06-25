import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, input, viewChild } from '@angular/core';

import { assign, cloneDeep, find, forEach, isArray, isNil, isPlainObject, isString } from 'lodash';
import { Data, InitSignal, parse, Renderers, Signal, Spec, View } from 'vega';

@Component({
    selector: 'app-vega-chart',
    imports: [CommonModule],
    templateUrl: './vega-chart.component.html',
    styleUrl: './vega-chart.component.scss',
})
export class VegaChartComponent {
    divChart = viewChild.required<ElementRef>('chart');

    data = input<any | any[]>([]);
    spec = input.required<Spec>();
    signals = input<{ [key: string]: any }>();
    renderer = input<Renderers>('canvas');

    #view?: View;

    constructor() {
        effect(() => {
            const data = cloneDeep(this.data());
            const signals = cloneDeep(this.signals());
            const spec = cloneDeep(this.spec());

            if (isNil(data)) spec.data = [];

            if (isArray(data) || isString(data)) this.updateData(spec.data ?? [], 'data', data);
            else
                forEach(data, (valuesOrUrl: Data[], name: string) => {
                    this.updateData(spec.data ?? [], name, valuesOrUrl);
                });

            if (isNil(spec.signals)) spec.signals = [];

            if (isPlainObject(signals)) {
                forEach(signals, (value: any, name: string) => {
                    this.updateSignals(spec.signals ?? [], name, value);
                });
            }

            this.render(spec);
        });
    }

    private render(spec: Spec): void {
        this.#view = new View(parse(spec))
            .renderer(this.renderer() || 'canvas')
            .initialize(this.divChart().nativeElement)
            .hover();

        this.#view.runAsync();
    }

    private updateData(data: Data[], name: string, valuesOrUrl: any[] | string): void {
        const item = find(data, { name });
        const values = isArray(valuesOrUrl) ? valuesOrUrl : undefined;
        const url = isString(valuesOrUrl) ? valuesOrUrl : undefined;

        if (isNil(item)) data.unshift({ name, values, url });
        else assign(item, { url, values });
    }

    private updateSignals(signals: Signal[], name: string, value: any): void {
        const signal = find(signals, { name });

        if (isNil(signal)) signals.unshift({ name, value });
        else (signal as InitSignal).value = value;
    }
}
