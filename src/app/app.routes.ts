import { Routes } from '@angular/router';
import { AuthGuard } from './infrastructure/guards/auth.guard';

export const routes: Routes = [
  {
    title: 'Home',
    path: 'home',
    loadComponent: () =>
      import('./infrastructure/pages/home/home.component').then((m) => m.HomePageComponent),
  },
  {
    title: 'Overview',
    path: 'overview',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./infrastructure/pages/overview/overview.component').then((m) => m.OverviewComponent),
  },
  {
    title: 'Transactions',
    path: '',
    canActivate: [],
    loadComponent: () =>
      import('./infrastructure/pages/transactions/transactions.component').then(
        (m) => m.TransactionsComponent,
      ),
  },
];
