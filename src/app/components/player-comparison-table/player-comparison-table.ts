import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { StatNumberPipe } from '../../pipes/stat-number.pipe';
import { PlayerSeasonData } from '../../types/player-data';

@Component({
    selector: 'app-player-comparison-table',
    imports: [CommonModule, StatNumberPipe],
    templateUrl: './player-comparison-table.html',
    styleUrl: './player-comparison-table.scss',
})
export class PlayerComparisonTable {
    player1 = input.required<PlayerSeasonData>();
    player2 = input.required<PlayerSeasonData>();

    readonly statKeyLabelMap = {
        gp: 'Games Played',
        shots: 'Shots',
        goals: 'Goals',
        assists: 'Assists',
        points: 'Points',
        scouting_grade: 'Scouting Grade',
        shooting_percentage: 'Goals / Shots',
        toi: 'Time on Ice',
    };
}
