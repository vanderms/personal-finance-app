import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { UserNotificationGatewayImpl } from '../../infrastructure/gateways/user-notification.gateway.impl';
import { StateAcessor } from '../../util/dtos/state-acessor.dto';
import { User, UserDTO, UserErrors } from '../../domain/user.model';
import { HttpGateway } from '../gateways/http.gateway';
import { Singleton } from '../../util/decorators/singleton.decorator';

@Singleton()
export class LoginInteractor {
  constructor(
    private httpService: HttpGateway,
    private alertService: UserNotificationGatewayImpl
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
