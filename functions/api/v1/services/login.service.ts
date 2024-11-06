import { Singleton, UserDTO } from 'types/client';
import { BadRequestError } from 'util/errors/bad-request.error';
import { UnauthenticatedError } from 'util/errors/unauthenticated.error';
import { LoginEntity } from '../entities/login.entity';
import { UserEntity } from '../entities/user.entity';
import { Properties } from 'util/properties/properties';
import { retry } from '../../../../node_modules/rxjs/dist/types/index';

export interface LoginRepository {
  checkUsernameAndPassword(username: string, password: string): Promise<UserEntity | null>;
  createLogin(username: string, expiration: number): Promise<LoginEntity>;
  getLoginAndUserByLoginId(id: string): Promise<{ login: LoginEntity; user: UserEntity } | null>;
}

@Singleton()
export class LoginService {
  constructor(private loginRepository: LoginRepository) {}

  async login(dto: UserDTO): Promise<{ login: LoginEntity; user: UserEntity }> {
    //
    if (!dto.username || !dto.password) {
      throw new BadRequestError('Username or password is empty.');
    }

    const user = await this.loginRepository.checkUsernameAndPassword(dto.username, dto.password);

    if (!user) {
      throw new UnauthenticatedError('');
    }

    const login = await this.createLogin(user);

    return { login, user };
  }

  async loginWithCredentials(loginId: string) {
    const query = await this.loginRepository.getLoginAndUserByLoginId(loginId);

    if (!query) {
      throw new UnauthenticatedError('');
    }

    return query;
  }

  async createLogin(user: UserEntity) {
    const expiration = Date.now() + Properties.COOKIES_LOGIN_DURATION_IN_MILLISECONDS;

    const loginToken = await this.loginRepository.createLogin(user.getId(), expiration);

    return loginToken;
  }

  async getValidLoginAndUserByLoginId(loginId: string) {
    return await this.loginRepository.getLoginAndUserByLoginId(loginId);
  }
}
