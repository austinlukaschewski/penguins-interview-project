import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { TeamLogoPipe } from '../../pipes/team-logo.pipe';
import { PlayerSeasonData } from '../../types/player-data';

@Component({
    selector: 'app-player-info-header',
    imports: [CommonModule, TeamLogoPipe],
    templateUrl: './player-info-header.html',
    styleUrl: './player-info-header.scss',
})
export class PlayerInfoHeader {
    player = input.required<PlayerSeasonData>();

    logoPlacement = input<'left' | 'right'>('left');
}
