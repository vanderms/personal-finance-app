import { Provider } from '@angular/core';
import { LoginInteractor } from '../../application/usecases/login.interactor';
import { SignupInteractor } from '../../application/usecases/signup.interactor';
import { HttpGatewayImpl } from '../gateways/http.gateway.impl';
import { HttpGateway } from '../../application/gateways/http.gateway';
import { UserNotificationGatewayImpl } from '../gateways/user-notification.gateway.impl';
import { UserNotificationGateway } from '../../application/gateways/user-notification.gateway';

export const HttpGatewayProvider: Provider = {
  provide: HttpGateway,
  useFactory: () => new HttpGatewayImpl(),
};

export const UserNotificationGatewayProvider: Provider = {
  provide: UserNotificationGateway,
  useFactory: () => new UserNotificationGatewayImpl(),
};

export const SignupInteractorProvider: Provider = {
  provide: SignupInteractor,
  useFactory: (http: HttpGateway, alert: UserNotificationGatewayImpl) => {
    return new SignupInteractor(http, alert);
  },
  deps: [HttpGateway, UserNotificationGateway],
};

export const LoginInteractorProvider: Provider = {
  provide: LoginInteractor,
  useFactory: (http: HttpGateway, alert: UserNotificationGatewayImpl) => {
    return new LoginInteractor(http, alert);
  },
  deps: [HttpGateway, UserNotificationGateway],
};
