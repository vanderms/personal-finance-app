import { User, UserDTO } from 'types/client';

export class UserEntity extends User {
  constructor(builder: UserDTO) {
    super(builder);
  }

  toJson() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
    };
  }
}
