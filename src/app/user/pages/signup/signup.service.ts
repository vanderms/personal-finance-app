import { BehaviorSubject, combineLatest, firstValueFrom, map } from 'rxjs';
import { AlertService } from '../../../util/components/alert/alert.service';

import { User, UserDTO, UserErrors } from '../../user.model';
import { HttpService } from '../../../util/services/http';

type Touched = {
  [k in keyof Pick<UserDTO, 'username' | 'email' | 'password'>]: boolean;
};

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

  private touched = new BehaviorSubject<Touched>({
    username: false,
    email: false,
    password: false,
  });

  patchTouched(partial: Touched) {
    this.touched.next({ ...this.touched.value, ...partial });
  }

  private inUse = new BehaviorSubject({
    email: [] as string[],
    username: [] as string[],
  });

  private errors = combineLatest([this.user, this.touched, this.inUse]).pipe(
    map(([user, touched, inUse]) => {
      const username = touched.username
        ? user.validateUsername(inUse.username)
        : new Set<string>();

      const email = touched.email
        ? user.validateEmail(inUse.email)
        : new Set<string>();

      const password = touched.password
        ? user.validatePassword()
        : new Set<string>();

      return { username, email, password };
    })
  );

  private state = combineLatest([this.user, this.errors]).pipe(
    map(([user, errors]) => ({ user, errors }))
  );

  getState() {
    return this.state;
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
      const [username, email, password] = [true, true, true];
      this.touched.next({ username, email, password });
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
