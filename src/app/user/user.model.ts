export class User {
  private _id: string = '';
  private _username: string = '';
  private _email: string = '';
  private _password: string = '';

  constructor(builder: Partial<User>) {
    Object.assign(this, builder);
  }

  id() {
    return this._id;
  }

  username() {
    return this._username;
  }

  email() {
    return this._email;
  }

  password() {
    return this._password;
  }

  patch(values: Partial<User>): User {
    return Object.assign(new User(this), values);
  }

  validateUsername(usernameInUse: string[] = []) {
    const errors: Set<string> = new Set();
    if (this._username.length <= 4) errors.add('username::minlength');
    if (this._username.length >= 16) errors.add('username::maxlength');
    if (/\s/.test(this._username)) errors.add('username::emptyspace');
    if (usernameInUse.includes(this._username)) errors.add('username::inuse');
    return errors;
  }

  validatePassword() {
    const errors: Set<string> = new Set();
    const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{4,12}$/;
    if (!validPassword.test(this._password)) errors.add('password::invalid');
    return errors;
  }

  validateEmail(emailInUse: string[] = []) {
    const errors: Set<string> = new Set();
    const validEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!validEmail.test(this._email)) errors.add('email::invalid');
    if (emailInUse.includes(this._email)) errors.add('email::inuse');
    return errors;
  }




}