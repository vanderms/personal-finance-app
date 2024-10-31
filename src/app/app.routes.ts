import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user/pages/user-layout/user-layout.component').then(
        (m) => m.UserLayoutComponent
      ),
    children: [
      {
        title: 'Sign Up',
        path: '',
        loadComponent: () =>
          import('./user/pages/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        title: 'Login',
        path: 'login',
        loadComponent: () =>
          import('./user/pages/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
    ],
  },
];
