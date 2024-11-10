import { BehaviorSubject, map, Subject } from 'rxjs';
import { User, UserDTO, UserErrors } from '../../domain/user.model';
import { UserNotificationAdapterImpl } from '../../infrastructure/adapters/user-notification.adapter.impl';
import { Singleton } from '../../util/decorators/singleton.decorator';
import { HttpAdapter } from '../adapters/http.adapter';
import {
  BadRequestFormNotification,
  UnknownErrorNotifcation,
} from '../../util/functions/notifcations';
import { UserAdapter } from '../adapters/user.adapter';

@Singleton()
export class LoginInteractor {
  constructor(
    private httpService: HttpAdapter,
    private alertService: UserNotificationAdapterImpl,
    private userService: UserAdapter,
  ) {}

  private user = new BehaviorSubject(new User());

  getUser() {
    return this.user.asObservable().pipe(
      map((user) => {
        user.usernameErrors = () => {
          if (user.getUsername().length === 0) return new Set([UserErrors.Username.Required]);
          return new Set<string>();
        };

        user.passwordErrors = () => {
          if (user.getPassword().length === 0) return new Set([UserErrors.Password.Required]);
          return new Set<string>();
        };

        return user;
      }),
    );
  }

  patchUser(partial: UserDTO) {
    this.user.next(this.user.value.patch(partial));
  }

  private isUserInvalid() {
    return this.user.value.getUsername().length === 0 || this.user.value.getPassword().length === 0;
  }



  async login(): Promise<boolean> {
    const isInvalid = this.isUserInvalid();

    if (isInvalid) {
      return false;
    }

    try {
      const user = this.user.value;
      const response = await this.httpService.post<UserDTO>('user/login', user);

      if (response.ok) {
        this.userService.setUser(new User({ ...response.data }));
        return true;
      }

      if (response.status === 400) {
        await this.alertService.push(new BadRequestFormNotification());
        return false;
      }

      throw new Error(response.message.join(' | '));
      //
    } catch (err) {
      console.error(err);
      await this.alertService.push(new UnknownErrorNotifcation());
      return false;
    }
  }
}
