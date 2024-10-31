import { UserDTO } from 'types/client';
import { UserEntity } from './entity';
import { SignupRepository } from './service';
export class SignupRepositoryImpl implements SignupRepository {
  private static _instance?: SignupRepositoryImpl;

  static getInstance(DB: D1Database) {
    if (!this._instance) {
      this._instance = new SignupRepositoryImpl(DB);
    }
    return this._instance;
  }

  private constructor(private db: D1Database) {}

  async getUserByNameAndEmail(
    name: string,
    email: string
  ): Promise<UserEntity[]> {
    const stmt = this.db
      .prepare(
        'SELECT id, username, email FROM user u WHERE u.username = ?1 AND u.email = ?2'
      )
      .bind(name, email);

    const { results } = await stmt.run<UserDTO>();

    return results.map((dto) => new UserEntity(dto));
  }
}
