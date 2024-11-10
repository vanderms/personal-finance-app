import { Provider } from '@angular/core';
import { HttpAdapter } from '../../application/adapters/http.adapter';
import { UserNotificationAdapter } from '../../application/adapters/user-notification.adapter';
import { UserAdapter } from '../../application/adapters/user.adapter';
import { LoginInteractor } from '../../application/usecases/login.interactor';
import { RecordTransactionInteractor } from '../../application/usecases/record-transaction.interactor';
import { SignupInteractor } from '../../application/usecases/signup.interactor';
import { HttpAdapterImpl } from './http.adapter.impl';
import { UserNotificationAdapterImpl } from './user-notification.adapter.impl';
import { UserAdapterImpl } from './user.adapter.impl';
import { Router } from '@angular/router';

const HttpAdapterProvider: Provider = {
  provide: HttpAdapter,
  useFactory: () => new HttpAdapterImpl(),
};

export const UserAdapterProvider: Provider = {
  provide: UserAdapter,
  useFactory: (router: Router, httpAdapter: HttpAdapter) => {
    return new UserAdapterImpl(router, httpAdapter);
  },
  deps: [Router, HttpAdapter],
};

const UserNotificationAdapterProvider: Provider = {
  provide: UserNotificationAdapter,
  useFactory: () => new UserNotificationAdapterImpl(),
};

const SignupInteractorProvider: Provider = {
  provide: SignupInteractor,
  useFactory: (http: HttpAdapter, alert: UserNotificationAdapterImpl, userAdapter: UserAdapter) => {
    return new SignupInteractor(http, alert, userAdapter);
  },
  deps: [HttpAdapter, UserNotificationAdapter, UserAdapter],
};

const LoginInteractorProvider: Provider = {
  provide: LoginInteractor,
  useFactory: (http: HttpAdapter, alert: UserNotificationAdapterImpl, user: UserAdapter) => {
    return new LoginInteractor(http, alert, user);
  },
  deps: [HttpAdapter, UserNotificationAdapter, UserAdapter],
};

const AddTransactionProvider: Provider = {
  provide: RecordTransactionInteractor,
  useFactory: (
    userAdapter: UserAdapter,
    httpAdapter: HttpAdapter,
    userNotificationAdapter: UserNotificationAdapter,
  ) => {
    return new RecordTransactionInteractor(userAdapter, httpAdapter, userNotificationAdapter);
  },
  deps: [UserAdapter, HttpAdapter, UserNotificationAdapter],
};

export const ApplicationProviders = [
  HttpAdapterProvider,
  UserAdapterProvider,
  UserNotificationAdapterProvider,
  SignupInteractorProvider,
  LoginInteractorProvider,
  AddTransactionProvider,
];
