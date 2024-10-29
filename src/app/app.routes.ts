import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: 'Sign Up',
    path: 'signup',
    loadComponent: () =>
      import('./user/pages/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
];
