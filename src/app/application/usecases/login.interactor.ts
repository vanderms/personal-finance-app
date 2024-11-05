import { BehaviorSubject, map, Subject } from 'rxjs';
import { User, UserDTO, UserErrors } from '../../domain/user.model';
import { UserNotificationAdapterImpl } from '../../infrastructure/adapters/user-notification.adapter.impl';
import { Singleton } from '../../util/decorators/singleton.decorator';
import { HttpAdapter } from '../adapters/http.adapter';

@Singleton()
export class LoginInteractor {
  constructor(
    private httpService: HttpAdapter,
    private alertService: UserNotificationAdapterImpl,
  ) {}

  private user = new BehaviorSubject(new User());

  getUser() {
    return this.user.asObservable().pipe(
      map((user) => {
        user.usernameErrors = () => {
          if (user.getUsername().length === 0) return new Set(UserErrors.Username.Required);
          return new Set<string>();
        };

        user.passwordErrors = () => {
          if (user.getPassword().length === 0) return new Set(UserErrors.Password.Required);
          return new Set<string>();
        };

        return user;
      }),
    );
  }

  private notificationLogin = new Subject<User>();

  getNotificationUserHasLogged() {
    return this.notificationLogin.asObservable();
  }

  patchUser(partial: UserDTO) {
    this.user.next(this.user.value.patch(partial));
  }

  private isUserInvalid() {
    return this.user.value.getUsername().length === 0 || this.user.value.getPassword().length === 0;
  }

  async loginWithCredentials(): Promise<User | null> {
    try {
      const response = await this.httpService.get<User | null>('user/login');
      if (response.ok && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  async login(): Promise<boolean> {
    const isInvalid = this.isUserInvalid();

    if (isInvalid) {
      return false;
    }

    try {
      const user = this.user.value;
      const response = await this.httpService.post<User>('user/login', user);

      if (response.ok) {
        this.notificationLogin.next(response.data);
        return true;
      }

      if (response.status === 400) {
        await this.alertService.push(this.feedback.BadRequest);
        return false;
      }

      throw new Error(response.message.join(' | '));
      //
    } catch (err) {
      console.error(err);
      await this.alertService.push(this.feedback.Unknown);
      return false;
    }
  }

  readonly feedback = {
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
