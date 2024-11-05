import { Singleton, UserDTO } from 'types/client';
import { BadRequestError } from 'util/errors/bad-request.error';
import { UserEntity } from '../entities/user.entity';

export interface SignupRepository {
  getUsersUsingNameOrEmail(name: string, email: string): Promise<UserEntity[]>;

  saveUser(user: UserEntity): Promise<UserEntity>;
}

@Singleton()
export class SignupService {
  constructor(private signupRepository: SignupRepository) {}

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
    const usersUsingNameOrEmail = await this.signupRepository.getUsersUsingNameOrEmail(
      user.getUsername(),
      user.getEmail(),
    );

    const nameInUse = usersUsingNameOrEmail
      .filter((other) => other.getUsername() === user.getUsername())
      .map(() => user.getUsername());

    const emailInUse = usersUsingNameOrEmail
      .filter((other) => other.getEmail() === user.getEmail())
      .map(() => user.getEmail());

    const emailErrors = user.emailErrors(emailInUse);
    const nameErrors = user.usernameErrors(nameInUse);
    const passwordErrors = user.passwordErrors();

    return [...emailErrors, ...nameErrors, ...passwordErrors];
  }
}
