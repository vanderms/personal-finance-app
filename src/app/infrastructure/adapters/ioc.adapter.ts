import { Provider } from '@angular/core';
import { LoginInteractor } from '../../application/usecases/login.interactor';
import { SignupInteractor } from '../../application/usecases/signup.interactor';
import { HttpAdapterImpl } from './http.adapter.impl';
import { HttpAdapter } from '../../application/adapters/http.adapter';
import { UserNotificationAdapterImpl } from './user-notification.adapter.impl';
import { UserNotificationAdapter } from '../../application/adapters/user-notification.adapter';
import { UserAdapter } from '../../application/adapters/user.adapter';
import { UserAdapterImpl } from './user.adapter.impl';

const HttpAdapterProvider: Provider = {
  provide: HttpAdapter,
  useFactory: () => new HttpAdapterImpl(),
};

const UserNotificationAdapterProvider: Provider = {
  provide: UserNotificationAdapter,
  useFactory: () => new UserNotificationAdapterImpl(),
};

const SignupInteractorProvider: Provider = {
  provide: SignupInteractor,
  useFactory: (http: HttpAdapter, alert: UserNotificationAdapterImpl) => {
    return new SignupInteractor(http, alert);
  },
  deps: [HttpAdapter, UserNotificationAdapter],
};

const LoginInteractorProvider: Provider = {
  provide: LoginInteractor,
  useFactory: (http: HttpAdapter, alert: UserNotificationAdapterImpl) => {
    return new LoginInteractor(http, alert);
  },
  deps: [HttpAdapter, UserNotificationAdapter],
};

export const UserAdapterProvider: Provider = {
  provide: UserAdapter,
  useFactory: (
    loginInteractor: LoginInteractor,
    signupInteractor: SignupInteractor,
    httpAdapter: HttpAdapter
  ) => {
    return new UserAdapterImpl(loginInteractor, signupInteractor, httpAdapter);
  },
  deps: [LoginInteractor, SignupInteractor, HttpAdapter],
};

export const ApplicationProviders = [
  HttpAdapterProvider,
  UserNotificationAdapterProvider,
  SignupInteractorProvider,
  LoginInteractorProvider,
  UserAdapterProvider,
];
