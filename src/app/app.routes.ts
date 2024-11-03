import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: 'Home',
    path: '',
    loadComponent: () =>
      import('./infrastructure/pages/home/home.component').then((m) => m.HomePageComponent),
  },
];
