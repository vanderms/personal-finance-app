import { Singleton, UserDTO } from 'types/client';
import { UserEntity } from '../entities/user.entity';
import { generateSalt, hashPassword, verifyPassword } from 'util/crypto/crypto';
import { LoginRepository } from '../services/login.service';
import { LoginEntity } from '../entities/login.entity';
import { Env } from 'types/env';
import { SignupRepository } from '../services/signup.service';

@Singleton()
export class UserRepository implements SignupRepository, LoginRepository {
  constructor(private env: Env) {}

  async saveUser(user: UserEntity): Promise<UserEntity> {
    const saltArray = generateSalt();

    const { password, salt } = await hashPassword(
      user.getPassword(),
      saltArray,
      this.env.PEPPER
    );

    const id = crypto.randomUUID();

    await this.env.DB.prepare(
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
    const stmt = this.env.DB.prepare(
      'SELECT id, username, email FROM user u WHERE u.username = ?1 OR u.email = ?2'
    ).bind(name, email);

    const { results } = await stmt.run<UserDTO>();

    return results.map((dto) => new UserEntity(dto));
  }

  async checkUsernameAndPassword(
    username: string,
    password: string
  ): Promise<UserEntity | null> {
    const stmt = this.env.DB.prepare(
      'SELECT id, username, email, password, salt FROM user u WHERE u.username = ?'
    ).bind(username);

    const { results: users } = await stmt.run<UserDTO & { salt: string }>();

    const user = users[0];

    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(
      password,
      user.password,
      user.salt,
      this.env.PEPPER
    );

    return isValid ? new UserEntity(user) : null;
  }

  async createLogin(userId: string, expiration: number): Promise<LoginEntity> {
    const id = crypto.randomUUID();

    await this.env.DB.prepare(
      ` INSERT INTO login (id, user_id, expiration) VALUES (?, ?, ?)`
    )
      .bind(id, userId, expiration)
      .run();

    return new LoginEntity(id, userId, expiration);
  }

  async getLoginAndUserByLoginId(
    id: string
  ): Promise<{ login: LoginEntity; user: UserEntity } | null> {
    const stmt = this.env.DB.prepare(
      `SELECT l.id, l.user_id, l.expiration, u.email, u.username 
        FROM login l 
        JOIN user u ON u.id = l.user_id        
        WHERE l.id = ? AND l.expiration > ?`
    ).bind(id, Date.now());

    const { results: dtos } = await stmt.run<{
      id: string;
      user_id: string;
      expiration: number;
      email: string;
      username: string;
    }>();

    const dto = dtos[0];

    if (!dto) {
      return null;
    }
    const login = new LoginEntity(dto.id, dto.user_id, dto.expiration);

    const user = new UserEntity({
      username: dto.username,
      email: dto.email,
      id: dto.user_id,
    });

    return { login, user };
  }
}
