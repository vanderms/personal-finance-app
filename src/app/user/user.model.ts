export interface UserBuilder {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
}

export class User {
  private id: string = '';
  private username: string = '';
  private email: string = '';
  private password: string = '';

  constructor(builder: UserBuilder = {}) {
    Object.assign(this, builder);
  }

  getId() {
    return this.id;
  }

  getUsername() {
    return this.username;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  patch(values: UserBuilder): User {
    return new User({ ...this, ...values });
  }

  validateUsername(usernameInUse: string[] = []) {
    const errors: Set<string> = new Set();
    if (this.username.length <= 4) errors.add(UserErrors.Username.Minlength);
    if (this.username.length >= 16) errors.add(UserErrors.Username.Maxlength);
    if (/\s/.test(this.username)) errors.add(UserErrors.Username.EmptySpace);
    if (usernameInUse.includes(this.username))
      errors.add(UserErrors.Username.InUse);
    return errors;
  }

  validatePassword() {
    const errors: Set<string> = new Set();
    const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{4,12}$/;
    if (!validPassword.test(this.password))
      errors.add(UserErrors.Password.Invalid);
    return errors;
  }

  validateEmail(emailInUse: string[] = []) {
    const errors: Set<string> = new Set();
    const validEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!validEmail.test(this.email)) errors.add(UserErrors.Email.Invalid);
    if (emailInUse.includes(this.email)) errors.add(UserErrors.Email.InUse);
    return errors;
  }
}

export const UserErrors = {
  Username: {
    Minlength: 'user::username::minlength',
    Maxlength: 'user::username::maxlength',
    EmptySpace: 'user::username::emptyspace',
    InUse: 'user::username::inuse',
  },
  Email: {
    Invalid: 'user::email::invalid',
    InUse: 'user::email::inuse',
  },
  Password: {
    Invalid: 'user::password::invalid',
  },
};
