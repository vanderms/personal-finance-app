import { UserDTO } from 'types/client';
import { UserEntity } from './user.entity';
import { SignupRepository } from './signup/signup.service';
import { generateSalt, hashPassword } from 'util/crypto/crypto';

export class UserRepository implements SignupRepository {
  private static _instance?: UserRepository;

  static getInstance(db: D1Database) {
    return this._instance ?? (this._instance = new UserRepository(db));
  }

  private constructor(private db: D1Database) {}

  async saveUser(user: UserEntity): Promise<UserEntity> {
    const saltArray = generateSalt();

    const { password, salt } = await hashPassword(
      user.getPassword(),
      saltArray
    );

    const id = crypto.randomUUID();

    this.db
      .prepare(
        ` INSERT INTO user (id, username, email, password, salt) VALUES (?, ?, ?, ?, ?)`
      )
      .bind(id, user.getUsername(), user.getEmail(), password, salt)
      .run();

    return user.patch({ id, password: '' });
  }

  async getUsersUsingNameOrEmail(
    name: string,
    email: string
  ): Promise<UserEntity[]> {
    //
    const stmt = this.db
      .prepare(
        'SELECT id, username, email FROM user u WHERE u.username = ?1 OR u.email = ?2'
      )
      .bind(name, email);

    const { results } = await stmt.run<UserDTO>();

    return results.map((dto) => new UserEntity(dto));
  }
}
