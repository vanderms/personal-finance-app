import { UserDTO } from 'types/client';
import { BadRequestError } from 'util/errors/bad-request.error';
import { UserEntity } from './entity';

export interface SignupRepository {
  getUserByNameAndEmail(name: string, email: string): Promise<UserEntity[]>;
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
      const message = errors.join('|');
      throw new BadRequestError(message);
    }

    return user;
  }

  private async validateUser(user: UserEntity): Promise<string[]> {
    const usersConflict = await this.signupRepository.getUserByNameAndEmail(
      user.getUsername(),
      user.getEmail()
    );

    const nameInUse = usersConflict
      .filter((other) => other.getUsername() === user.getUsername())
      .map(() => user.getUsername());

    const emailInUse = usersConflict
      .filter((other) => other.getEmail() === user.getEmail())
      .map(() => user.getEmail());

    const emailErrors = user.validateEmail(emailInUse);
    const nameErrors = user.validateUsername(nameInUse);
    const passwordErrors = user.validatePassword();

    return [...emailErrors, ...nameErrors, ...passwordErrors];
  }
}
