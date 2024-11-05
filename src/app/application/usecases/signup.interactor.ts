import { BehaviorSubject, combineLatest, firstValueFrom, map, Subject } from 'rxjs';
import { User, UserDTO, UserErrors } from '../../domain/user.model';
import { Singleton } from '../../util/decorators/singleton.decorator';
import { HttpAdapter } from '../adapters/http.adapter';
import { UserNotificationAdapter } from '../adapters/user-notification.adapter';

@Singleton()
export class SignupInteractor {
  constructor(
    private httpService: HttpAdapter,
    private notificationService: UserNotificationAdapter,
  ) {}

  private notificationLogin = new Subject<User>();

  getNotificationUserHasLogged() {
    return this.notificationLogin.asObservable();
  }

  private user = new BehaviorSubject(new User());

  private inUse = new BehaviorSubject({
    email: [] as string[],
    username: [] as string[],
  });

  getUser() {
    return combineLatest([this.user, this.inUse]).pipe(
      map(([user, inUse]) => {
        const emailValidator = user.emailErrors.bind(user);
        user.emailErrors = () => emailValidator(inUse.email);

        const usernameValidator = user.usernameErrors.bind(user);
        user.usernameErrors = () => usernameValidator(inUse.username);
        return user;
      }),
    );
  }

  patchUser(partial: UserDTO) {
    this.user.next(this.user.value.patch(partial));
  }

  private isUserInvalid = combineLatest([this.user, this.inUse]).pipe(
    map(([user, inUse]) => {
      return (
        user.usernameErrors(inUse.username).size ||
        user.emailErrors(inUse.email).size ||
        user.passwordErrors().size
      );
    }),
  );

  async signUp(): Promise<boolean> {
    const isInvalid = await firstValueFrom(this.isUserInvalid);

    if (isInvalid) {
      return false;
    }

    try {
      const user = this.user.value;
      const response = await this.httpService.post<User>('user/signup', user);

      if (response.ok) {
        await this.notificationService.push(this.feedback.Ok);
        return true;
      }

      if (response.status === 400) {
        this.updateInUse(response.message, user.getUsername(), user.getEmail());
        await this.notificationService.push(this.feedback.BadRequest);
        return false;
      }

      throw new Error(response.message.join(' | '));
      //
    } catch (err) {
      console.error(err);
      await this.notificationService.push(this.feedback.Unknown);
      return false;
    }
  }

  private updateInUse(message: string[], username: string, email: string) {
    if (message.includes(UserErrors.Username.InUse)) {
      this.inUse.next({
        ...this.inUse.value,
        username: [...this.inUse.value.username, username],
      });
    }

    if (message.includes(UserErrors.Email.InUse)) {
      this.inUse.next({
        ...this.inUse.value,
        email: [...this.inUse.value.username, email],
      });
    }
  }

  readonly feedback = {
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
