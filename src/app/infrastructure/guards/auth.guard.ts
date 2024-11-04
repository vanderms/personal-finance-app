// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserAdapter } from '../../application/adapters/user.adapter';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userAdapter: UserAdapter,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> {
    return this.userAdapter.getCurrentUser().pipe(
      tap((user) => {
        if (!user) {
          debugger;
          console.log('Am i being called?');
          this.router.navigate(['/']);
        }
      }),
      map((user) => Boolean(user)),
    );
  }
}
