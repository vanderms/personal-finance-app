// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAdapter } from '../../application/adapters/user.adapter';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userAdapter: UserAdapter) {}

  canActivate(): Observable<boolean> {
    return this.userAdapter.getCurrentUser().pipe(map((user) => Boolean(user)));
  }
}
