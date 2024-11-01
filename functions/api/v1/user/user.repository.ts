import { UserDTO } from 'types/client';
import { UserEntity } from './user.entity';
import { SignupRepository } from './signup/signup.service';
import { generateSalt, hashPassword, verifyPassword } from 'util/crypto/crypto';
import { LoginRepository } from './login/login.service';
import { LoginEntity } from './login.entity';

export class UserRepository implements SignupRepository, LoginRepository {
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

    await this.db
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

  async checkUsernameAndPassword(
    username: string,
    password: string
  ): Promise<boolean> {
    const stmt = this.db
      .prepare('SELECT password, salt FROM user u WHERE u.username = ?')
      .bind(username);

    const { results: users } = await stmt.run<{
      password: string;
      salt: string;
    }>();

    const user = users[0];

    if (!user) {
      return false;
    }

    return await verifyPassword(password, user.password, user.salt);
  }
  createLogin(username: string, expiration: number): Promise<LoginEntity> {
    throw new Error('Method not implemented.');
  }
  getLoginById(id: string): Promise<LoginEntity | null> {
    throw new Error('Method not implemented.');
  }
}
