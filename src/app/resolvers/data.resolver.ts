import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { chain, forEach } from 'lodash';
import { map } from 'rxjs';

import type { PlayerSeasonData } from '../types/player-data';

export const resolveData: ResolveFn<{ season: PlayerSeasonData[] }> = () =>
    inject(HttpClient)
        .get<Array<PlayerSeasonData>>('/data/data.json')
        .pipe(
            map((data) => {
                data = data.map((datum, index) => ({
                    ...datum,
                    id: index + 1,
                    shooting_percentage: (datum.goals / datum.shots) * 100,
                    toiSeconds: datum.toi.split(':').reduce((acc, value, index) => {
                        if (index === 0) return (acc += parseInt(value) * 60);

                        if (value.endsWith('.')) value = value.slice(0, -1);
                        return (acc += parseInt(value));
                    }, 0),
                }));

                return {
                    season: data,
                    aggregate: chain(data)
                        .groupBy('player_name')
                        .reduce((acc, values, key) => {
                            const aggregate = values.reduce((acc2, value) => {
                                forEach(value, (value2, key2) => {
                                    if (
                                        !['player_name', 'season', 'team', 'shooting_percentage', 'toi'].includes(key2)
                                    ) {
                                        if (!acc2[key2]) acc2[key2] = 0;
                                        acc2[key2] += value2 ?? 0;
                                    }
                                });

                                return acc2;
                            }, {});

                            acc.push({
                                ...aggregate,
                                id: key,
                                player_name: key,
                                shooting_percentage: (aggregate['goals'] / aggregate['shots']) * 100,
                                scouting_grade: aggregate['scouting_grade'] / values.length,
                                toi: `${Math.floor(aggregate['toiSeconds'] / 60)}:${`${aggregate['toiSeconds'] % 60}`.padStart(2, '0')}`,
                                seasons: values,
                            });

                            return acc;
                        }, [])
                        .valueOf(),
                };
            }),
        );
