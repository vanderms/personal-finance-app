import { UserDTO } from 'types/client';
import { BadRequestError } from 'util/errors/bad-request.error';
import { UnauthenticatedError } from 'util/errors/unauthenticated.error';
import { LoginEntity } from '../login.entity';

export interface LoginRepository {
  checkUsernameAndPassword(
    username: string,
    password: string
  ): Promise<boolean>;
  createLogin(username: string, expiration: number): Promise<LoginEntity>;
  getLoginById(id: string): Promise<LoginEntity | null>;
}

export class LoginService {
  private constructor(private loginRepository: LoginRepository) {}

  static instance?: LoginService;

  static getInstance(loginRepository: LoginRepository) {
    if (!this.instance) this.instance = new LoginService(loginRepository);
    return this.instance;
  }

  static COOKIES_DURATION = 2 * 60 * 60 * 1000;

  static COOKIES_KEY = 'login';

  async login(user: UserDTO): Promise<LoginEntity> {
    //
    if (!user.username || !user.password) {
      throw new BadRequestError('Username or password is empty.');
    }

    const shouldBeAuthenticated =
      await this.loginRepository.checkUsernameAndPassword(
        user.username,
        user.password
      );

    if (!shouldBeAuthenticated) {
      throw new UnauthenticatedError('');
    }

    const expiration = Date.now() + LoginService.COOKIES_DURATION;

    const loginToken = await this.loginRepository.createLogin(
      user.username,
      expiration
    );

    return loginToken;
  }

  async isLogged(loginId: string, usernameId: string): Promise<boolean> {
    const login = await this.loginRepository.getLoginById(loginId);

    if (login.usernameId === usernameId) {
      return true;
    }

    throw new UnauthenticatedError('');
  }
}
