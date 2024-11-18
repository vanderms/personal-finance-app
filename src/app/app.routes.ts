import { Title } from '@angular/platform-browser';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: 'Home',
    path: '',
    loadComponent: () =>
      import('./infrastructure/pages/home/home.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./infrastructure/pages/layout/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [],
    children: [
      {
        title: 'Overview',
        path: 'overview',
        loadComponent: () =>
          import('./infrastructure/pages/overview/overview.component').then(
            (m) => m.OverviewComponent,
          ),
      },
      {
        title: 'Transactions',
        path: 'transactions',
        loadComponent: () =>
          import('./infrastructure/pages/transactions/transactions.component').then(
            (m) => m.TransactionsComponent,
          ),
      },
    ],
  },
];
