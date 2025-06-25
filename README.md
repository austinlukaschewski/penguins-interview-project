# Penguins Interview Project
### Created By Austin Lukaschewski

## How to start
from the command line, run `pnpm run start`
You can also use `npx nx serve` or `nx serve`

## Description
I took the CSV and converted it into a JSON object to serve to my application.

For this basic comparison tool, you will select 2 players from the dropdown and a data grouping (default is season). A radar chart with stats (minus time on ice) for a quick overview comparison and then a breakdown table for a deeper dive into each stat will display below the dropdowns.

I have calculated `shot percentage` from taking `goals / shots` as I found that to be interesting addition, but I was unclear if `shots` were shot attempts or shot on goal.
To compare `toi` I converted this to `toiSeconds` to compare the values. I also noticed a possible error in the data with some `toi` values having a `.` at the end, after looking over that I made the assumption that those values where suppose to be `...:0X` and have accounted for that in my calculation of `toiSeconds`

I also have aggregated the data for each player's seasons given in the data set for the aggregated data grouping for another look at a player's career comparison.

## Notes
I created this project with NX workspace choosing a standalone Angular application.

Tech Stack:
- Angular
- DaisyUI + TailwindCSS
- Lodash
- Vega

Ways I would possibly improve this tool for production:
- Ability to add more than 2 players to compare.
- Have more accurate domains for the radar chart, I did some guessing and quick look over the data to get those.
- With `aggregated` data grouping, maybe a tabular view of each player's stats for each season given in the data set.