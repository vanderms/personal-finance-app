import { Provider } from '@angular/core';
import { SignupService } from '../../domain/user/signup.service';
import { UserService } from '../../domain/user/user.service';
import { AlertService } from '../components/alert/alert.service';
import { HttpService } from '../services/http';
import { HttpServiceImpl } from '../services/http.service';
import { LoginService } from '../../domain/user/login.service';

export const HttpServiceProvider: Provider = {
  provide: HttpService,
  useFactory: (userService: UserService) => {
    return HttpServiceImpl.getInstance(userService);
  },
  deps: [UserService],
};

export const AlertServiceProvider: Provider = {
  provide: AlertService,
  useFactory: () => AlertService.getInstance(),
};

export const SignupServiceProvider: Provider = {
  provide: SignupService,
  useFactory: (http: HttpService, alert: AlertService) => {
    return SignupService.getInstance(http, alert);
  },
  deps: [HttpService, AlertService],
};

export const UserServiceProvider: Provider = {
  provide: UserService,
  useFactory: () => UserService.getInstance(),
};

export const LoginServiceProvider: Provider = {
  provide: LoginService,
  useFactory: (http: HttpService, alert: AlertService) => {
    return LoginService.getInstance(http, alert);
  },
  deps: [HttpService, AlertService],
};
