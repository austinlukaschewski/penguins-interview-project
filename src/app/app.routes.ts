import { Route } from '@angular/router';

import { resolveData } from './resolvers/data.resolver';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        resolve: {
            data: resolveData,
        },
        loadComponent: () => import('./pages/home/home').then(({ Home }) => Home),
    },
];
