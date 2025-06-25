import { Spec } from 'vega';

export const playerComparisonRadarSpec: Spec = {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    description: 'A radar chart with independent scales for each spoke in Vega.',
    width: 400,
    height: 400,
    padding: 40,
    autosize: { type: 'none', contains: 'padding' },

    signals: [
        { name: 'radius', update: 'width / 2' },
        { name: 'spokeDomains', value: {} },
    ],

    data: [
        {
            name: 'table',
            values: [],
            transform: [
                {
                    type: 'formula',
                    as: 'player_name',
                    expr: "datum.player_name + ' ' + (datum.season || '')",
                },
            ],
        },
        {
            name: 'keys',
            source: 'table',
            transform: [{ type: 'aggregate', groupby: ['key'] }],
        },
        {
            name: 'labels',
            source: 'table',
            transform: [{ type: 'aggregate', groupby: ['key', 'label'] }],
        },
        {
            name: 'key_domains',
            source: 'table',
            transform: [
                {
                    type: 'aggregate',
                    groupby: ['key'],
                    fields: ['value', 'value'],
                    ops: ['min', 'max'],
                    as: ['min_value', 'max_value'],
                },
            ],
        },
    ],

    legends: [
        {
            fill: 'players',
            title: 'Players',
            orient: 'none',
            direction: 'vertical',
            legendX: { value: 50 },
            legendY: { value: -200 },
            encode: {
                symbols: {
                    update: {
                        strokeWidth: { value: 0 },
                        shape: { value: 'square' },
                        opacity: { value: 0.3 },
                    },
                },
            },
        },
    ],

    scales: [
        {
            name: 'players',
            type: 'ordinal',
            domain: { data: 'table', field: 'player_name' },
            range: 'category',
        },
        {
            name: 'angular',
            type: 'point',
            range: { signal: '[-PI, PI]' },
            padding: 0.5,
            domain: { data: 'table', field: 'key' },
        },
        {
            name: 'color',
            type: 'ordinal',
            domain: { data: 'table', field: 'category' },
            range: { scheme: 'category10' },
        },
        {
            name: 'gp_radial',
            type: 'linear',
            range: { signal: '[0, radius]' },
            zero: true,
            nice: false,
            domain: { signal: 'spokeDomains.gp' },
        },
        {
            name: 'shots_radial',
            type: 'linear',
            range: { signal: '[0, radius]' },
            zero: true,
            nice: false,
            domain: { signal: 'spokeDomains.shots' },
        },
        {
            name: 'goals_radial',
            type: 'linear',
            range: { signal: '[0, radius]' },
            zero: true,
            nice: false,
            domain: { signal: 'spokeDomains.goals' },
        },
        {
            name: 'assists_radial',
            type: 'linear',
            range: { signal: '[0, radius]' },
            zero: true,
            nice: false,
            domain: { signal: 'spokeDomains.assists' },
        },
        {
            name: 'points_radial',
            type: 'linear',
            range: { signal: '[0, radius]' },
            zero: true,
            nice: false,
            domain: { signal: 'spokeDomains.points' },
        },
        {
            name: 'scouting_grade_radial',
            type: 'linear',
            range: { signal: '[0, radius]' },
            zero: true,
            nice: false,
            domain: [0, 10],
        },
        {
            name: 'shooting_percentage_radial',
            type: 'linear',
            range: { signal: '[0, radius]' },
            zero: true,
            nice: false,
            domain: [0, 15],
        },
    ],

    encode: {
        enter: {
            x: { signal: 'radius' },
            y: { signal: 'radius' },
        },
    },

    marks: [
        {
            type: 'group',
            name: 'categories',
            zindex: 1,
            from: {
                facet: { data: 'table', name: 'facet', groupby: ['category'] },
            },
            marks: [
                {
                    type: 'line',
                    name: 'category-line',
                    from: { data: 'facet' },
                    encode: {
                        enter: {
                            interpolate: { value: 'linear-closed' },
                            x: {
                                signal: "scale(datum.key + '_radial', datum.value) * cos(scale('angular', datum.key))",
                            },
                            y: {
                                signal: "scale(datum.key + '_radial', datum.value) * sin(scale('angular', datum.key))",
                            },
                            stroke: { scale: 'color', field: 'category' },
                            strokeWidth: { value: 1 },
                            fill: { scale: 'color', field: 'category' },
                            fillOpacity: { value: 0.1 },
                        },
                    },
                },
                {
                    type: 'symbol',
                    from: { data: 'facet' },
                    encode: {
                        enter: {
                            x: {
                                signal: "scale(datum.key + '_radial', datum.value) * cos(scale('angular', datum.key))",
                            },
                            y: {
                                signal: "scale(datum.key + '_radial', datum.value) * sin(scale('angular', datum.key))",
                            },
                            stroke: { scale: 'color', field: 'category' },
                            strokeWidth: { value: 0.5 },
                            fill: { scale: 'color', field: 'category' },
                            fillOpacity: { value: 0.75 },
                            size: { value: 30 },
                        },
                    },
                },
            ],
        },
        {
            type: 'rule',
            name: 'radial-grid',
            from: { data: 'keys' },
            zindex: 0,
            encode: {
                enter: {
                    x: { value: 0 },
                    y: { value: 0 },
                    x2: { signal: "radius * cos(scale('angular', datum.key))" },
                    y2: { signal: "radius * sin(scale('angular', datum.key))" },
                    stroke: { value: 'lightgray' },
                    strokeWidth: { value: 1 },
                },
            },
        },
        {
            type: 'text',
            name: 'key-label',
            from: { data: 'labels' },
            zindex: 1,
            encode: {
                enter: {
                    x: { signal: "(radius + 5) * cos(scale('angular', datum.key))" },
                    y: { signal: "(radius + 5) * sin(scale('angular', datum.key))" },
                    text: { field: 'label' },
                    align: [{ test: "abs(scale('angular', datum.key)) > PI / 2", value: 'right' }, { value: 'left' }],
                    baseline: [
                        { test: "scale('angular', datum.key) > 0", value: 'top' },
                        { test: "scale('angular', datum.key) == 0", value: 'middle' },
                        { value: 'bottom' },
                    ],
                    fill: { value: 'black' },
                    fontWeight: { value: 'bold' },
                },
            },
        },
        {
            type: 'line',
            name: 'outer-line',
            from: { data: 'radial-grid' },
            encode: {
                enter: {
                    interpolate: { value: 'linear-closed' },
                    x: { field: 'x2' },
                    y: { field: 'y2' },
                    stroke: { value: 'lightgray' },
                    strokeWidth: { value: 1 },
                },
            },
        },
    ],
};
