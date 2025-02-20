import { Router } from '@angular/router';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { HttpAdapter } from '../../application/adapters/http.adapter';
import { UserAdapter } from '../../application/adapters/user.adapter';
import { User, UserDTO } from '../../domain/user.model';
import { Singleton } from '../../util/decorators/singleton.decorator';

@Singleton()
export class UserAdapterImpl extends UserAdapter {
  constructor(
    private router: Router,
    private http: HttpAdapter,
  ) {
    super();
    this.checkCredentials();
  }

  private user$ = new BehaviorSubject<User | null | undefined>(null);

  async checkCredentials() {
    try {
      const response = await this.http.get<UserDTO | null>('user/login');
      if (response.ok && response.data) {
        console.log(`checkCredentials: user logged: ${response.data.id}`);
        this.setUser(new User({ ...response.data }));
      } else {
        console.log(`checkCredentials: user not logged: ${JSON.stringify(response)}`);
        this.setUser(null);
      }
    } catch (error) {
      console.error(error);
      this.setUser(null);
    }
  }

  override getCurrentUser(): Observable<User | null> {
    return this.user$.pipe(filter((user) => user !== undefined));
  }

  override setUser(user: User | null) {
    console.log(`setUser: new user: ${user?.getId()}`);
    this.user$.next(user);
    if (user === null) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['dashboard/overview']);
    }
  }
}
