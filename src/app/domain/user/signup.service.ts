import { BehaviorSubject, combineLatest, map, firstValueFrom } from 'rxjs';
import { AlertService } from '../../util/components/alert/alert.service';
import { HttpService } from '../../util/services/http';
import { UserDTO, User, UserErrors } from './user.model';
import { StateAcessor } from '../../util/misc/form-field';

export class SignupService {
  static instance?: SignupService;

  static getInstance(httpService: HttpService, alertService: AlertService) {
    if (!this.instance)
      this.instance = new SignupService(httpService, alertService);
    return this.instance;
  }

  private constructor(
    private httpService: HttpService,
    private alertService: AlertService
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
      const response = await this.httpService.post('user/signup', user);

      if (response.ok) {
        await this.alertService.push(this.feedback.Ok);
        return true;
      }

      if (response.status === 400) {
        this.updateInUse(response.message, user.getUsername(), user.getEmail());
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
