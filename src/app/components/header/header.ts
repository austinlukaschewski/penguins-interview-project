import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TeamLogoPipe } from '../../pipes/team-logo.pipe';

@Component({
    selector: 'app-header',
    imports: [CommonModule, TeamLogoPipe],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {}
