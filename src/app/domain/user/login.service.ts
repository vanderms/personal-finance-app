import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AlertService } from '../../util/components/alert/alert.service';
import { HttpService } from '../../util/services/http';
import { User, UserDTO, UserErrors } from './user.model';
import { StateAcessor } from '../../util/misc/form-field';

export class LoginService {
  static instance?: LoginService;
  static getInstance(httpService: HttpService, alertService: AlertService) {
    if (!this.instance)
      this.instance = new LoginService(httpService, alertService);
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
}
