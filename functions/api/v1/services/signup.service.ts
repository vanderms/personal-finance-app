import { UserDTO } from 'types/client';
import { BadRequestError } from 'util/errors/bad-request.error';
import { UserEntity } from '../entities/user.entity';


export interface SignupRepository {
  getUsersUsingNameOrEmail(name: string, email: string): Promise<UserEntity[]>;

  saveUser(user: UserEntity): Promise<UserEntity>;
}

export class SignupService {
  private constructor(private signupRepository: SignupRepository) {}

  private static _instance?: SignupService;

  static getInstance(signupRepository: SignupRepository): SignupService {
    if (!this._instance) {
      this._instance = new SignupService(signupRepository);
    }
    return this._instance;
  }

  public async signup(userBuilder: UserDTO): Promise<UserEntity> {
    const user = new UserEntity(userBuilder);

    const errors = await this.validateUser(user);

    if (errors.length > 0) {
      throw new BadRequestError(errors.join('|'));
    }

    const created = await this.signupRepository.saveUser(user);

    return created;
  }

  private async validateUser(user: UserEntity): Promise<string[]> {
    const usersUsingNameOrEmail =
      await this.signupRepository.getUsersUsingNameOrEmail(
        user.getUsername(),
        user.getEmail()
      );

    const nameInUse = usersUsingNameOrEmail
      .filter((other) => other.getUsername() === user.getUsername())
      .map(() => user.getUsername());

    const emailInUse = usersUsingNameOrEmail
      .filter((other) => other.getEmail() === user.getEmail())
      .map(() => user.getEmail());

    const emailErrors = user.validateEmail(emailInUse);
    const nameErrors = user.validateUsername(nameInUse);
    const passwordErrors = user.validatePassword();

    return [...emailErrors, ...nameErrors, ...passwordErrors];
  }
}
