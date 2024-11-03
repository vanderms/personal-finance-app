import { BehaviorSubject, combineLatest, firstValueFrom, map } from 'rxjs';
import { User, UserDTO, UserErrors } from '../../domain/user.model';
import { Singleton } from '../../util/decorators/singleton.decorator';
import { StateAcessor } from '../../util/dtos/state-acessor.dto';
import { HttpGateway } from '../gateways/http.gateway';
import { UserNotificationGateway } from '../gateways/user-notification.gateway';

@Singleton()
export class SignupInteractor {
  constructor(
    private httpService: HttpGateway,
    private notificationService: UserNotificationGateway
  ) {}

  private user = new BehaviorSubject(new User());

  patchUser(partial: UserDTO) {
    this.user.next(this.user.value.patch(partial));
  }

  private inUse = new BehaviorSubject({
    email: [] as string[],
    username: [] as string[],
  });

  private errors = combineLatest([this.user, this.inUse]).pipe(
    map(([user, inUse]) => {
      const username = user.validateUsername(inUse.username);
      const email = user.validateEmail(inUse.email);
      const password = user.validatePassword();
      return { username, email, password };
    })
  );

  private stateAcessors = combineLatest([this.user, this.errors]).pipe(
    map(([user, errors]) => {
      const username: StateAcessor<string> = {
        getValue: () => user.getUsername(),
        setValue: (username) => this.patchUser({ username }),
        getErrors: () => errors.username,
      };

      const email: StateAcessor<string> = {
        getValue: () => user.getEmail(),
        setValue: (email) => this.patchUser({ email }),
        getErrors: () => errors.email,
      };

      const password: StateAcessor<string> = {
        getValue: () => user.getPassword(),
        setValue: (password) => this.patchUser({ password }),
        getErrors: () => errors.password,
      };

      return { username, email, password };
    })
  );

  getStateAcessors() {
    return this.stateAcessors;
  }

  private isUserInvalid = combineLatest([this.user, this.inUse]).pipe(
    map(([user, inUse]) => {
      return (
        user.validateUsername(inUse.username).size ||
        user.validateEmail(inUse.email).size ||
        user.validatePassword().size
      );
    })
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