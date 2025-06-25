import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { get } from 'lodash';

import { PlayerComparisonTable } from '../../components/player-comparison-table/player-comparison-table';
import { PlayerInfoHeader } from '../../components/player-info-header/player-info-header';
import { VegaChartComponent } from '../../components/vega-chart/vega-chart.component';
import { playerComparisonRadarSpec } from '../../vega-specs/player-comparison-radar';

import { HomeService } from './home.service';

@Component({
    selector: 'app-home',
    imports: [CommonModule, PlayerComparisonTable, PlayerInfoHeader, VegaChartComponent],
    providers: [HomeService],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home {
    private readonly _route = inject(ActivatedRoute);
    private readonly _router = inject(Router);

    isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    readonly service = inject(HomeService);

    readonly radarSpec = playerComparisonRadarSpec;

    onDataGroupingChanged(value: 'aggregate' | 'season'): void {
        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: {
                dataGrouping: value,
                player1: null,
                player2: null,
            },
            queryParamsHandling: 'merge',
        });
    }

    onPlayerChanged(key: string, evt: Event): void {
        const value = get(evt.target, 'value', null);

        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: {
                [key]: value,
            },
            queryParamsHandling: 'merge',
        });
    }
}
