import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: 'Home',
    path: '',
    loadComponent: () =>
      import('./infrastructure/pages/home/home.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    title: 'Overview',
    path: 'overview',
    loadComponent: () =>
      import('./infrastructure/pages/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
];
