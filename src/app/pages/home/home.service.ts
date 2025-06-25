import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { chain, forEach, isNumber, omit } from 'lodash';
import { combineLatest, map, shareReplay } from 'rxjs';

import type { PlayerSeasonData } from '../../types/player-data';
import type { SelectOption } from '../../types/select-option';

@Injectable()
export class HomeService {
    private readonly _route = inject(ActivatedRoute);

    readonly data$ = this._route.data.pipe(
        map((data) => data['data']),
        shareReplay(1),
    );

    readonly dataGrouping$ = this._route.queryParams.pipe(
        map((queryParams) => queryParams['dataGrouping'] ?? 'season'),
        shareReplay(1),
    );

    private readonly selectedData$ = combineLatest([this.data$, this.dataGrouping$]).pipe(
        map(([data, group]) => data[group] ?? []),
        shareReplay(1),
    );

    private readonly playerMap$ = this.selectedData$.pipe(
        map((data) =>
            data.reduce((acc: Record<number, PlayerSeasonData>, player) => {
                acc[player.id] = player;
                return acc;
            }, {}),
        ),
        shareReplay(1),
    );

    readonly selectedDataPlayerOptions$ = this.selectedData$.pipe(
        map((data) =>
            chain(data)
                .reduce((acc: Array<SelectOption<number>>, player) => {
                    let label = `${player.player_name}`;

                    if (isNumber(player.season)) label = `${label} | ${player.season} ${player.team}`;

                    acc.push({
                        label,
                        value: player.id,
                        selected: false,
                    });

                    return acc;
                }, [])
                .orderBy(['label'], ['asc'])
                .valueOf(),
        ),
        shareReplay(1),
    );

    readonly player1$ = combineLatest([this.playerMap$, this._route.queryParams]).pipe(
        map(([playerMap, queryParams]) => playerMap[queryParams['player1']]),
        shareReplay(1),
    );

    readonly player2$ = combineLatest([this.playerMap$, this._route.queryParams]).pipe(
        map(([playerMap, queryParams]) => playerMap[queryParams['player2']]),
        shareReplay(1),
    );

    readonly radarSpecSignals$ = this.dataGrouping$.pipe(
        map((dataGrouping) => ({
            spokeDomains:
                dataGrouping === 'season'
                    ? {
                          gp: [0, 82],
                          goals: [0, 82],
                          assists: [0, 100],
                          points: [0, 130],
                          scouting_grade: [0, 10],
                          shots: [0, 500],
                      }
                    : {
                          gp: [0, 600],
                          goals: [0, 200],
                          assists: [0, 300],
                          points: [0, 500],
                          scouting_grade: [0, 10],
                          shots: [0, 2000],
                      },
        })),
        shareReplay(1),
    );

    readonly radarSpecData$ = combineLatest([this.player1$, this.player2$]).pipe(
        map((players) =>
            players.reduce((acc, player, index) => {
                const data = omit(player, 'id', 'player_name', 'season', 'seasons', 'team', 'toi', 'toiSeconds');
                forEach(data, (value, key) => {
                    acc.push({
                        label: getRadarChartStatLabel(key),
                        key,
                        value,
                        category: index,
                        player_name: `${player.player_name}${player.season ? ` ${player.season}` : ''}`,
                    });
                });

                return acc;
            }, []),
        ),
        shareReplay(1),
    );
}

export const getRadarChartStatLabel = (stat: string) => {
    switch (stat) {
        case 'gp':
            return 'GP';
        case 'shots':
            return 'Shots';
        case 'goals':
            return 'G';
        case 'assists':
            return 'A';
        case 'points':
            return 'Pts';
        case 'toi':
            return 'TOI';
        case 'toiSeconds':
            return 'TOI (s)';
        case 'scouting_grade':
            return 'Sc Grade';
        case 'shooting_percentage':
            return 'Shot %';
        default:
            return '';
    }
};
