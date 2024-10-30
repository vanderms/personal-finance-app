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

    if (!this.username.trim()) {
      errors.add(UserErrors.Username.Required);
      return errors;
    }

    if (this.username.length < 4) errors.add(UserErrors.Username.Minlength);
    if (this.username.length > 16) errors.add(UserErrors.Username.Maxlength);
    if (/\s/.test(this.username)) errors.add(UserErrors.Username.EmptySpace);
    if (usernameInUse.includes(this.username))
      errors.add(UserErrors.Username.InUse);
    return errors;
  }

  validatePassword() {
    const errors: Set<string> = new Set();

    if (!this.password.trim()) {
      errors.add(UserErrors.Password.Required);
      return errors;
    }

    const validPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
    if (!validPassword.test(this.password))
      errors.add(UserErrors.Password.Invalid);
    return errors;
  }

  validateEmail(emailInUse: string[] = []) {
    const errors: Set<string> = new Set();

    if (!this.email.trim()) {
      errors.add(UserErrors.Email.Required);
      return errors;
    }

    const validEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!validEmail.test(this.email)) errors.add(UserErrors.Email.Invalid);
    if (emailInUse.includes(this.email)) errors.add(UserErrors.Email.InUse);
    return errors;
  }
}

export const UserErrors = {
  Username: {
    Required: 'Name is required',
    Minlength: 'Name must be at least 4 characters long',
    Maxlength: 'Name must not exceed 16 characters',
    EmptySpace: 'No spaces allowed in the name',
    InUse: 'This name is already taken',
  },
  Email: {
    Required: 'Email is required',
    Invalid: 'Invalid email address',
    InUse: 'Email address is already registered by another user',
  },
  Password: {
    Required: 'Password is required',
    Invalid:
      'Password must be at least 8 characters long and contain both letters and numbers',
  },
};
