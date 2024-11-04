import { BehaviorSubject, Observable } from 'rxjs';
import { HttpAdapter } from '../../application/adapters/http.adapter';
import { UserAdapter } from '../../application/adapters/user.adapter';
import { LoginInteractor } from '../../application/usecases/login.interactor';
import { SignupInteractor } from '../../application/usecases/signup.interactor';
import { User } from '../../domain/user.model';
import { Singleton } from '../../util/decorators/singleton.decorator';

@Singleton()
export class UserAdapterImpl extends UserAdapter {
  constructor(
    loginInteractor: LoginInteractor,
    signupInteractor: SignupInteractor,
    httpAdapter: HttpAdapter,
    private user$ = new BehaviorSubject<User | null>(null)
  ) {
    super();
    loginInteractor
      .getNotificationUserHasLogged()
      .subscribe((user) => this.user$.next(user));

    signupInteractor
      .getNotificationUserHasLogged()
      .subscribe((user) => this.user$.next(user));

    httpAdapter
      .getUnauthenticatedResponse()
      .subscribe(() => this.user$.next(null));
  }

  override getCurrentUser(): Observable<User | null> {
    return this.user$.asObservable();
  }
}
