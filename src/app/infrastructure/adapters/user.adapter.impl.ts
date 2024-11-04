import { BehaviorSubject, filter, Observable, tap } from 'rxjs';
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
    private user$ = new BehaviorSubject<User | null | undefined>(undefined)
  ) {
    super();

    loginInteractor
      .loginWithCredentials()
      .then((user) => this.user$.next(user));

    loginInteractor.getNotificationUserHasLogged().subscribe((user) => {
      console.log(user);
      this.user$.next(user);
    });

    signupInteractor
      .getNotificationUserHasLogged()
      .subscribe((user) => this.user$.next(user));

    httpAdapter
      .getUnauthenticatedResponse()
      .subscribe(() => this.user$.next(null));
  }

  override getCurrentUser(): Observable<User | null> {
    return this.user$.pipe(
      filter(<T>(x: T | undefined): x is T => {
        return x !== undefined;
      }),
      tap(console.log)
    );
  }
}
