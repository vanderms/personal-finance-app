import { BehaviorSubject, combineLatest, map, Subject } from 'rxjs';
import { UserNotificationAdapterImpl } from '../../infrastructure/adapters/user-notification.adapter.impl';
import { StateAcessor } from '../../util/dtos/state-acessor.dto';
import { User, UserDTO, UserErrors } from '../../domain/user.model';
import { HttpAdapter } from '../adapters/http.adapter';
import { Singleton } from '../../util/decorators/singleton.decorator';

@Singleton()
export class LoginInteractor {
  constructor(
    private httpService: HttpAdapter,
    private alertService: UserNotificationAdapterImpl
  ) {}

  private user = new BehaviorSubject(new User());

  private notificationLogin = new Subject<User>();

  getNotificationUserHasLogged() {
    return this.notificationLogin.asObservable();
  }

  patchUser(partial: UserDTO) {
    this.user.next(this.user.value.patch(partial));
  }

  private errors = this.user.pipe(
    map((user) => {
      const username =
        user.getUsername().length === 0 ? [UserErrors.Username.Required] : [];
      const password =
        user.getPassword().length === 0 ? [UserErrors.Password.Required] : [];
      return { username: new Set(username), password: new Set(password) };
    })
  );

  private stateAcessors = combineLatest([this.user, this.errors]).pipe(
    map(([user, errors]) => {
      const username: StateAcessor<string> = {
        getValue: () => user.getUsername(),
        setValue: (username) => this.patchUser({ username }),
        getErrors: () => errors.username,
      };

      const password: StateAcessor<string> = {
        getValue: () => user.getPassword(),
        setValue: (password) => this.patchUser({ password }),
        getErrors: () => errors.password,
      };

      return { username, password };
    })
  );

  getStateAcessors() {
    return this.stateAcessors;
  }

  private isUserInvalid() {
    return (
      this.user.value.getUsername().length === 0 ||
      this.user.value.getPassword().length === 0
    );
  }

  async loginWithCredentials(): Promise<boolean> {
    try {
      const response = await this.httpService.get<User | null>('user/login');
      if (response.ok && response.data) {
        this.notificationLogin.next(response.data);
        return true;
      }
    } catch (error) {
      console.error(error);
    }

    return false;
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
