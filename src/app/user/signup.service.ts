import { LoadingService } from '../util/services/loading.service';
import { ApiResponses } from '../util/types/api-responses.type';
import { User, UserErrors } from './user.model';
import { inject, Injectable, signal } from '@angular/core';
import { WithLoading } from '../util/decorators/with-loading.decorator';

type Pristine = {
  [k in keyof Pick<User, 'username' | 'email' | 'password'>]: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class SignupClientService {
  //is used by withloading
  public loadingService = inject(LoadingService);

  private _user = signal(new User({}));

  private _pristine = signal<Pristine>({
    username: true,
    email: true,
    password: true,
  });

  private _inUse = signal({
    email: [] as string[],
    username: [] as string[],
  });

  get user() {
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

  getUsernameErrorMessage() {
    const user = this.user();
    const pristine = this._pristine();

    if (pristine.username) return new Set();
    return user.validateUsername(this._inUse().username);
  }

  getEmailErrorMessage() {
    const user = this.user();
    const pristine = this._pristine();
    if (pristine.email) return new Set();
    return user.validateEmail(this._inUse().email);
  }

  getPasswordErrorMessage() {
    const user = this.user();
    const pristine = this._pristine();
    if (pristine.password) return new Set();
    return user.validatePassword();
  }

  isUserValid() {
    if (this.getUsernameErrorMessage().size > 0) {
      return false;
    }
    if (this.getEmailErrorMessage().size > 0) {
      return false;
    }
    if (this.getPasswordErrorMessage().size > 0) {
      return false;
    }
    return true;
  }

  async signUp() {
    if (this.isUserValid()) {
      return await this.createUser();
    }
    this._pristine.set({ username: false, email: false, password: false });
    return { message: ApiResponses.BadRequest };
  }

  @WithLoading()
  async createUser() {
    const response = await fetch('api/v1/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.user()),
    });

    const data = response.ok
      ? { message: ApiResponses.Ok }
      : await this.handlePostUserErrors(response);

    return data;
  }

  private async handlePostUserErrors(response: Response) {
    if (response.status === 400) {
      const data = await response.json();
      if (data.errors.includes(UserErrors.Username.InUse)) {
        this._inUse.update((current) => ({
          ...current,
          username: [...current.username, this.user().username()],
        }));
      }
      if (data.errors.includes(UserErrors.Email.InUse)) {
        this._inUse.update((current) => ({
          ...current,
          email: [...current.email, this.user().email()],
        }));
      }
      return { message: ApiResponses.BadRequest };
    }
    return { message: ApiResponses.Server };
  }
}
