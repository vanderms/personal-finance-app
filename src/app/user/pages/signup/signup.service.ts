import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EnvironmentToken } from '../../../../env/env.token';
import { AlertService } from '../../../util/components/alert/alert.service';
import { LoadingService } from '../../../util/services/loading.service';
import { ApiResponses } from '../../../util/types/api-responses.type';
import { User, UserBuilder, UserErrors } from '../../user.model';

type Touched = {
  [k in keyof Pick<UserBuilder, 'username' | 'email' | 'password'>]: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class SignupClientService {
  //is used by withloading
  public loadingService = inject(LoadingService);

  private alertService = inject(AlertService);

  private routerService = inject(Router);

  private env = inject(EnvironmentToken);

  private _user = signal(new User({}));

  private _touched = signal<Touched>({
    username: false,
    email: false,
    password: false,
  });

  private _inUse = signal({
    email: [] as string[],
    username: [] as string[],
  });

  get user() {
    return this._user.asReadonly();
  }

  patchUser(partial: UserBuilder) {
    this._user.update((current) => current.patch(partial));
  }

  patchTouched(partial: Touched) {
    this._touched.update((current) => ({ ...current, ...partial }));
  }

  private usernameErrorMessage = computed(() => {
    const user = this.user();
    const touched = this._touched();
    console.log(user.getUsername(), touched.username);

    if (!touched.username) return new Set<string>();
    return user.validateUsername(this._inUse().username);
  });

  getUsernameErrorMessage() {
    return this.usernameErrorMessage;
  }

  private emailErrorMessage = computed(() => {
    const user = this.user();
    const touched = this._touched();
    if (!touched.email) return new Set<string>();
    return user.validateEmail(this._inUse().email);
  });

  getEmailErrorMessage() {
    return this.emailErrorMessage;
  }

  passwordErrorMessage = computed(() => {
    const user = this.user();
    const touched = this._touched();
    if (!touched.password) return new Set<string>();
    return user.validatePassword();
  });

  getPasswordErrorMessage() {
    return this.passwordErrorMessage;
  }

  isUserValid = computed(() => {
    const user = this.user();
    const inUse = this._inUse();

    if (user.validateUsername(inUse.username).size > 0) {
      return false;
    }

    if (user.validateEmail(inUse.email).size > 0) {
      return false;
    }

    if (user.validatePassword().size > 0) {
      return false;
    }
    return true;
  });

  async signUp() {
    if (!this.isUserValid()) {
      return this._touched.set({
        username: true,
        email: true,
        password: true,
      });
    }

    switch ((await this.createUser()).message) {
      case ApiResponses.Ok:
        await this.alertService.push(this.errorMessages.Ok);
        return this.routerService.navigate(['/user/login']);

      case ApiResponses.BadRequest:
        return await this.alertService.push(this.errorMessages.BadRequest);

      case ApiResponses.Unknown: {
        return await this.alertService.push(this.errorMessages.Unknown);
      }
    }
  }

  async createUser() {
    const response = await fetch(`${this.env.ApiRoute}/user/signup`, {
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
          username: [...current.username, this.user().getUsername()],
        }));
      }
      if (data.errors.includes(UserErrors.Email.InUse)) {
        this._inUse.update((current) => ({
          ...current,
          email: [...current.email, this.user().getEmail()],
        }));
      }
      return { message: ApiResponses.BadRequest };
    }
    return { message: ApiResponses.Unknown };
  }

  readonly errorMessages = {
    Ok: {
      title: 'Success',
      text: 'User was created successfully!',
      type: 'info',
      primaryAction: 'Continue',
    },
    BadRequest: {
      title: 'Error',
      text: 'The form has errors, please correct them before submitting it again.',
      type: 'danger',
      primaryAction: 'Close',
    },
    Unknown: {
      title: 'Error',
      text: 'An unexpected error occurred. Please try again later.',
      type: 'danger',
      primaryAction: 'Close',
    },
  } as const;
}
