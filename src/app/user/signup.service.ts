import { User } from './user.model';
import { Injectable, signal } from '@angular/core';

type Pristine = {
  [k in keyof Pick<User, 'username' | 'email' | 'password'>]: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class SignupClientService {
  _user = signal(new User({}));

  _pristine = signal<Pristine>({ username: true, email: true, password: true });

  _inUse = signal({
    email: [] as string[],
    password: [] as string[],
  });

  user() {
    return this._user.asReadonly();
  }

  patchUser(partial: Partial<User>) {
    const pristine: Partial<Pristine> = {};
    if ('username' in partial) pristine.username = true;
    if ('password' in partial) pristine.password = true;
    if ('email' in partial) pristine.email = true;
    this._pristine.update((current) => ({ ...current, ...pristine }));
    this._user.update((current) => current.patch(partial));
  }

  signup() {}
}
