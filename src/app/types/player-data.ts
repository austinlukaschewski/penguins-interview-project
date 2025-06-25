export type PlayerSeasonData = {
    season: number;
    player_name: string;
    team: string;
    gp: string;
    toi: string;
    shots: number;
    goals: number;
    assists: number;
    points: number;
    scouting_grade: number;
    seasons?: PlayerSeasonData[];
    toiSeconds?: number;
    shooting_percentage?: number;
};
