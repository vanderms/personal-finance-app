import { User, UserDTO } from 'types/client';

export class UserEntity extends User {
  constructor(builder: UserDTO) {
    super(builder);
  }

  patch(values: UserDTO): UserEntity {
    return new UserEntity({ ...this, ...values });
  }

  toJson() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
    };
  }
}
